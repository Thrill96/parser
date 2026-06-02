// Pure helpers for the prospect-facing Shock Report. No I/O — easy to test.

export function scoreVerdict(score) {
  if (score == null) return { label: 'Not yet measured', tone: 'muted', blurb: 'Run a scan to measure AI visibility.' };
  if (score >= 67)
    return {
      label: 'Strong',
      tone: 'good',
      blurb: 'AI engines reliably find and recommend this brand. Defend the position.',
    };
  if (score >= 34)
    return {
      label: 'At risk',
      tone: 'warn',
      blurb: 'AI engines know the brand but inconsistently — competitors are taking the recommendations.',
    };
  return {
    label: 'Critically low',
    tone: 'bad',
    blurb: "AI engines can't reliably find or correctly identify this brand. Customers asking AI are being routed to competitors.",
  };
}

// Buyer-intent = the prompts a real shopper types (recommendation/comparison/direct).
const BUYER_INTENT = new Set(['recommendation', 'comparison', 'direct']);

export function buyerIntentStats(results) {
  const rows = (results || []).filter((r) => BUYER_INTENT.has(r.prompt_type));
  // Count UNIQUE prompts (a prompt is "won" if the brand appeared on any engine).
  const byPrompt = new Map();
  for (const r of rows) {
    const key = r.prompt_text;
    const cur = byPrompt.get(key) || { appeared: false, competitor: false };
    if (r.brand_mentioned) cur.appeared = true;
    let comps = [];
    try {
      comps = Array.isArray(r.competitor_mentioned)
        ? r.competitor_mentioned
        : JSON.parse(r.competitor_mentioned || '[]');
    } catch {
      comps = [];
    }
    if (comps.length) cur.competitor = true;
    byPrompt.set(key, cur);
  }
  const total = byPrompt.size;
  let appeared = 0;
  let competitorWon = 0;
  for (const v of byPrompt.values()) {
    if (v.appeared) appeared++;
    if (!v.appeared && v.competitor) competitorWon++;
  }
  return { total, appeared, missed: total - appeared, competitorWon };
}

// Honest framing copy — counts and named competitors, never invented dollar figures.
export function lossLine(stats, brandName) {
  if (!stats.total) return `No buyer-intent prompts have been tested yet for ${brandName}.`;
  if (stats.appeared === 0) {
    return `Across ${stats.total} ways a customer might ask AI for a business like ${brandName}, it appeared ${0} times. Competitors were recommended in ${stats.competitorWon} of them.`;
  }
  return `${brandName} appeared in ${stats.appeared} of ${stats.total} buyer-intent questions — competitors took ${stats.missed}.`;
}
