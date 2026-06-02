// Lightweight prospecting audit: a fast, cheap signal for whether a business
// is a good outreach target. Runs the (free) schema audit plus a few
// recommendation prompts on ONE engine, then scores the OPPORTUNITY —
// higher when the business is hard to find via AI and has weak schema
// (i.e. the most to gain, the easiest to sell).

import { activeEngines } from './engines/index.js';
import { parseResponse } from './parser.js';
import { auditSchema } from './schema-audit.js';
import { generatePrompts } from './prompts.js';
import { mapWithConcurrency } from './concurrency.js';

const ENGINE_PREFERENCE = ['gemini', 'chatgpt', 'claude', 'perplexity'];

function pickEngine() {
  const active = activeEngines();
  if (!active.length) throw new Error('No AI engines configured.');
  for (const id of ENGINE_PREFERENCE) {
    const e = active.find((x) => x.id === id);
    if (e) return e;
  }
  return active[0];
}

// Three recommendation prompts (buyer intent) derived from the category.
function quickPrompts(prospect) {
  const row = {
    brand_name: prospect.brand_name || prospect.domain,
    owner_name: '',
    service_category: prospect.service_category || '',
    location: prospect.location || '',
    competitors: '[]',
  };
  return generatePrompts(row)
    .filter((p) => p.prompt_type === 'recommendation')
    .slice(0, 3);
}

export async function scanProspect(prospect, engine) {
  const eng = engine || pickEngine();
  const prompts = quickPrompts(prospect);

  // Schema audit (no API cost) in parallel with the AI checks.
  const schemaPromise = auditSchema({
    domain: prospect.domain,
    brand_name: prospect.brand_name || prospect.domain,
    service_category: prospect.service_category || '',
  }).catch(() => ({ score: 0 }));

  let appeared = 0;
  const competitors = new Set();
  for (const p of prompts) {
    let raw = '';
    try {
      raw = await eng.run(p.prompt_text);
    } catch {
      raw = '';
    }
    try {
      const ex = await parseResponse({
        domain: prospect.domain,
        brand_name: prospect.brand_name || prospect.domain,
        owner_name: '',
        service_category: prospect.service_category || '',
        prompt_text: p.prompt_text,
        engine: eng.id,
        raw_response: raw,
      });
      if (ex.brand_mentioned) appeared++;
      (ex.competitor_mentioned || []).forEach((c) => competitors.add(c));
    } catch {
      /* skip */
    }
  }

  const schema = await schemaPromise;
  const tested = prompts.length || 1;
  const aiScore = Math.round((appeared / tested) * 100);
  const schemaScore = schema.score ?? 0;
  // Opportunity: low AI visibility + weak schema = hot prospect.
  const opportunity = Math.round((100 - aiScore) * 0.6 + (100 - schemaScore) * 0.4);

  return {
    domain: prospect.domain,
    brand_name: prospect.brand_name || null,
    service_category: prospect.service_category || null,
    location: prospect.location || null,
    engine: eng.id,
    prompts_tested: tested,
    appeared,
    ai_score: aiScore,
    schema_score: schemaScore,
    opportunity_score: opportunity,
    top_competitors: [...competitors].slice(0, 6),
  };
}

// Scan many prospects with a concurrency cap to respect rate limits.
export async function scanProspects(list, concurrency = 3) {
  const engine = pickEngine();
  return mapWithConcurrency(list, concurrency, (p) => scanProspect(p, engine));
}
