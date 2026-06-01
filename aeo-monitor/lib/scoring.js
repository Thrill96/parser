// Visibility scoring. Turns a batch of parsed results (for a single run)
// into 0-100 scores, overall and per-engine.

import { ENGINE_IDS } from './engines/index.js';

// A single result contributes a 0-100 "visibility points" value.
// confidence_score is 0-10; we weight in whether the site was linked and
// whether the brand was correctly identified.
export function resultPoints(r) {
  const base = (Number(r.confidence_score) || 0) * 10; // 0-100
  let pts = base;
  if (r.website_linked) pts += 10;
  if (r.correctly_identified) pts += 5;
  if (!r.brand_mentioned) pts = 0;
  return Math.max(0, Math.min(100, pts));
}

function avg(nums) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/**
 * @param {Array} results parsed result rows for one run, each with .engine and visibility fields
 * @param {number|null} schemaScore latest schema audit score (0-100) or null
 * @returns aggregate score object ready to insert into visibility_scores
 */
export function computeVisibility(results, schemaScore = null) {
  const perEngine = {};
  for (const id of ENGINE_IDS) {
    const rows = results.filter((r) => r.engine === id);
    perEngine[id] = rows.length ? avg(rows.map(resultPoints)) : null;
  }

  const scored = results.map(resultPoints);
  const promptVisibility = avg(scored);

  // How often a competitor showed up (across all results).
  const withCompetitor = results.filter(
    (r) => Array.isArray(r.competitor_mentioned) && r.competitor_mentioned.length > 0
  ).length;
  const competitorDisplacement = results.length
    ? Math.round((withCompetitor / results.length) * 100)
    : 0;

  // Overall: 80% prompt visibility, 20% schema health (if available).
  const overall =
    schemaScore == null
      ? promptVisibility
      : Math.round(promptVisibility * 0.8 + schemaScore * 0.2);

  return {
    overall_score: overall,
    chatgpt_score: perEngine.chatgpt,
    claude_score: perEngine.claude,
    gemini_score: perEngine.gemini,
    perplexity_score: perEngine.perplexity,
    schema_score: schemaScore,
    competitor_displacement: competitorDisplacement,
  };
}
