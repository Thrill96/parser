// Scan orchestrator — shared by the cron route and the on-demand "Run Scan Now".
//
// For each active domain → each active prompt → each active engine:
//   1. query the engine
//   2. parse the response with Claude
//   3. store a result row
// Then compute + store a visibility score and fire alerts on regressions.

import { all, one, run } from './db.js';
import { activeEngines } from './engines/index.js';
import { mapWithConcurrency } from './concurrency.js';
import { parseResponse } from './parser.js';
import { computeVisibility } from './scoring.js';
import { maybeAlert } from './alerts.js';
import { generateRecommendations } from './recommendations.js';

const TRUNCATE = 2000;

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function scanDomain(domain, engines) {
  const prompts = await all(
    'SELECT * FROM prompts WHERE domain_id = ? AND is_active = 1 ORDER BY id',
    [domain.id]
  );
  const runDate = today();

  // Build the full task list (prompt × engine) and run the slow part — the
  // engine call + Claude parse — in parallel with a concurrency cap. The cap
  // keeps us under provider rate limits (e.g. Gemini free tier = 15 req/min).
  const tasks = [];
  for (const prompt of prompts) {
    for (const engine of engines) tasks.push({ prompt, engine });
  }
  const concurrency = Number(process.env.SCAN_CONCURRENCY || 5);

  const computed = await mapWithConcurrency(tasks, concurrency, async ({ prompt, engine }) => {
    let raw = '';
    try {
      raw = await engine.run(prompt.prompt_text);
    } catch (err) {
      console.error(`[scan] ${engine.id} failed on "${prompt.prompt_text}":`, err.message);
      raw = `__ENGINE_ERROR__: ${err.message}`;
    }

    let extracted;
    try {
      extracted = await parseResponse({
        domain: domain.domain,
        brand_name: domain.brand_name,
        owner_name: domain.owner_name || '',
        service_category: domain.service_category || '',
        prompt_text: prompt.prompt_text,
        engine: engine.id,
        raw_response: raw,
      });
    } catch (err) {
      console.error('[scan] parser failed:', err.message);
      extracted = {
        brand_mentioned: false,
        website_linked: false,
        correctly_identified: false,
        competitor_mentioned: [],
        sentiment: 'absent',
        confidence_score: 0,
        extraction_notes: `Parser error: ${err.message}`,
      };
    }

    return { prompt, engine, raw, extracted };
  });

  // Persist results sequentially (SQLite is a single writer — avoid contention).
  const parsedResults = [];
  for (const { prompt, engine, raw, extracted } of computed) {
    await run(
      `INSERT INTO results
        (domain_id, prompt_id, engine, run_date, raw_response,
         brand_mentioned, website_linked, correctly_identified,
         competitor_mentioned, sentiment, confidence_score, extraction_notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        domain.id,
        prompt.id,
        engine.id,
        runDate,
        raw.slice(0, TRUNCATE),
        extracted.brand_mentioned ? 1 : 0,
        extracted.website_linked ? 1 : 0,
        extracted.correctly_identified ? 1 : 0,
        JSON.stringify(extracted.competitor_mentioned),
        extracted.sentiment,
        extracted.confidence_score,
        extracted.extraction_notes,
      ]
    );

    parsedResults.push({
      engine: engine.id,
      prompt_text: prompt.prompt_text,
      prompt_type: prompt.prompt_type,
      ...extracted,
    });
  }

  // Latest schema audit (if any) feeds the overall score and recommendations.
  const latestSchema = await one(
    'SELECT score, issues FROM schema_audits WHERE domain_id = ? ORDER BY audit_date DESC, id DESC LIMIT 1',
    [domain.id]
  );
  const schemaScore = latestSchema ? latestSchema.score : null;
  let schemaIssues = [];
  try {
    schemaIssues = latestSchema && latestSchema.issues ? JSON.parse(latestSchema.issues) : [];
  } catch {
    schemaIssues = [];
  }

  const visibility = computeVisibility(parsedResults, schemaScore);

  // Previous score for comparison BEFORE inserting the new one.
  const previous = await one(
    'SELECT * FROM visibility_scores WHERE domain_id = ? ORDER BY score_date DESC, id DESC LIMIT 1',
    [domain.id]
  );

  await run(
    `INSERT INTO visibility_scores
       (domain_id, score_date, overall_score, chatgpt_score, claude_score,
        gemini_score, perplexity_score, schema_score, competitor_displacement)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      domain.id,
      runDate,
      visibility.overall_score,
      visibility.chatgpt_score,
      visibility.claude_score,
      visibility.gemini_score,
      visibility.perplexity_score,
      visibility.schema_score,
      visibility.competitor_displacement,
    ]
  );

  const alert = await maybeAlert(domain, visibility, previous, parsedResults);

  // Claude-generated recommended actions. Non-fatal: a failure here must not
  // lose the scan results we just stored.
  let recommendations = null;
  try {
    const competitors = [
      ...new Set(
        parsedResults.flatMap((r) =>
          Array.isArray(r.competitor_mentioned) ? r.competitor_mentioned : []
        )
      ),
    ];
    recommendations = await generateRecommendations({
      domain: domain.domain,
      brand_name: domain.brand_name,
      owner_name: domain.owner_name,
      service_category: domain.service_category,
      linkedin_url: domain.linkedin_url,
      visibility,
      results: parsedResults,
      schemaIssues,
      schemaScore,
      competitors,
    });
    await run(
      `INSERT INTO recommendations (domain_id, gen_date, summary, recommendations)
       VALUES (?,?,?,?)`,
      [domain.id, runDate, recommendations.summary, JSON.stringify(recommendations.recommendations)]
    );
  } catch (err) {
    console.error('[scan] recommendations failed:', err.message);
  }

  return {
    domain: domain.domain,
    prompts: prompts.length,
    engines: engines.map((e) => e.id),
    results: parsedResults.length,
    visibility,
    alert,
    recommendations: recommendations ? recommendations.recommendations.length : 0,
  };
}

/**
 * Run a scan.
 * @param {object} opts { domainId?: number }  scan one domain, or all active
 */
export async function runScan(opts = {}) {
  const engines = activeEngines();
  if (!engines.length) {
    throw new Error(
      'No AI engines are configured. Set at least ANTHROPIC_API_KEY (and optionally ' +
        'OPENAI_API_KEY / GEMINI_API_KEY / PERPLEXITY_API_KEY).'
    );
  }

  const domains = opts.domainId
    ? await all('SELECT * FROM domains WHERE id = ?', [opts.domainId])
    : await all('SELECT * FROM domains ORDER BY id');

  const summaries = [];
  for (const domain of domains) {
    summaries.push(await scanDomain(domain, engines));
  }

  return {
    ran_at: new Date().toISOString(),
    engines: engines.map((e) => e.id),
    domains: summaries,
  };
}
