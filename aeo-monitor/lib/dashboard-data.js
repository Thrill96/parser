// Read-side queries for the dashboard. Server-only.

import { all, one } from './db.js';

export async function getPrimaryDomain() {
  return one('SELECT * FROM domains ORDER BY id LIMIT 1');
}

export async function getAllDomains() {
  return all('SELECT id, domain, brand_name FROM domains ORDER BY id');
}

export async function getDomainById(id) {
  return one('SELECT * FROM domains WHERE id = ?', [id]);
}

export async function getLatestVisibility(domainId) {
  return one(
    'SELECT * FROM visibility_scores WHERE domain_id = ? ORDER BY score_date DESC, id DESC LIMIT 1',
    [domainId]
  );
}

export async function getVisibilityTrend(domainId, weeks = 12) {
  const rows = await all(
    `SELECT score_date, overall_score, chatgpt_score, claude_score,
            gemini_score, perplexity_score, schema_score, competitor_displacement
       FROM visibility_scores
      WHERE domain_id = ?
   ORDER BY score_date DESC, id DESC
      LIMIT ?`,
    [domainId, weeks]
  );
  return rows.reverse();
}

export async function getLatestResults(domainId) {
  // Most recent run only.
  const latest = await one(
    'SELECT MAX(run_date) AS d FROM results WHERE domain_id = ?',
    [domainId]
  );
  if (!latest || !latest.d) return [];
  return all(
    `SELECT r.*, p.prompt_text, p.prompt_type
       FROM results r
       JOIN prompts p ON p.id = r.prompt_id
      WHERE r.domain_id = ? AND r.run_date = ?
   ORDER BY p.prompt_type, p.id, r.engine`,
    [domainId, latest.d]
  );
}

export async function getLatestRecommendations(domainId) {
  const row = await one(
    'SELECT * FROM recommendations WHERE domain_id = ? ORDER BY gen_date DESC, id DESC LIMIT 1',
    [domainId]
  );
  if (!row) return null;
  let recommendations = [];
  try {
    recommendations = JSON.parse(row.recommendations || '[]');
  } catch {
    recommendations = [];
  }
  return { summary: row.summary, gen_date: row.gen_date, recommendations };
}

export async function getLatestFixPack(domainId) {
  const row = await one(
    'SELECT * FROM fix_packs WHERE domain_id = ? ORDER BY gen_date DESC, id DESC LIMIT 1',
    [domainId]
  );
  if (!row) return null;
  const safe = (s) => {
    try {
      return JSON.parse(s || '[]');
    } catch {
      return [];
    }
  };
  return {
    gen_date: row.gen_date,
    cms_label: row.cms_label,
    items: safe(row.items),
    offsite_checklist: safe(row.offsite_checklist),
    needs_input: safe(row.needs_input),
  };
}

export async function getLatestSchemaAudit(domainId) {
  return one(
    'SELECT * FROM schema_audits WHERE domain_id = ? ORDER BY audit_date DESC, id DESC LIMIT 1',
    [domainId]
  );
}

// Aggregate competitor mentions across the latest run.
export async function getCompetitorStats(domainId) {
  const results = await getLatestResults(domainId);
  const counts = {};
  for (const r of results) {
    let comps = [];
    try {
      comps = JSON.parse(r.competitor_mentioned || '[]');
    } catch {
      comps = [];
    }
    for (const c of comps) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
