// Response parser: use Claude to extract structured brand-visibility data
// from each AI engine's raw response.

import Anthropic from '@anthropic-ai/sdk';

let _client;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const EXTRACTION_PROMPT = `Analyze this AI engine response for brand visibility.

Domain: {domain}
Brand: {brand_name}
Owner: {owner_name}
Service category: {service_category}
Query: {prompt_text}
Engine: {engine}
Response:
"""
{raw_response}
"""

Extract the following and return JSON ONLY (no prose, no markdown fences):
{
  "brand_mentioned": boolean,        // Is "{brand_name}" mentioned by name?
  "website_linked": boolean,         // Is "{domain}" linked or referenced?
  "correctly_identified": boolean,   // Is the brand described accurately as {service_category}, not confused with another entity?
  "competitor_mentioned": string[],  // Names of competitors mentioned instead of / alongside the brand
  "sentiment": "positive" | "neutral" | "negative" | "absent",
  "confidence_score": number,        // 0-10 how prominently the brand is featured:
                                     // 10 = first recommendation with link
                                     // 7 = mentioned as an option
                                     // 4 = briefly referenced
                                     // 1 = mentioned but incorrectly
                                     // 0 = absent
  "extraction_notes": string         // Brief analysis of what the AI "thinks" about this brand
}`;

function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ''));
}

function coerce(parsed) {
  const clampScore = (n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(10, Math.round(v)));
  };
  const sentiments = ['positive', 'neutral', 'negative', 'absent'];
  return {
    brand_mentioned: Boolean(parsed.brand_mentioned),
    website_linked: Boolean(parsed.website_linked),
    correctly_identified: Boolean(parsed.correctly_identified),
    competitor_mentioned: Array.isArray(parsed.competitor_mentioned)
      ? parsed.competitor_mentioned.map(String)
      : [],
    sentiment: sentiments.includes(parsed.sentiment) ? parsed.sentiment : 'neutral',
    confidence_score: clampScore(parsed.confidence_score),
    extraction_notes: typeof parsed.extraction_notes === 'string' ? parsed.extraction_notes : '',
  };
}

function extractJson(text) {
  // Tolerate ```json fences or surrounding prose.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON object found');
  return JSON.parse(candidate.slice(start, end + 1));
}

/**
 * @param {object} ctx { domain, brand_name, owner_name, service_category, prompt_text, engine, raw_response }
 * @returns extracted, coerced visibility record
 */
export async function parseResponse(ctx) {
  const model = process.env.PARSER_MODEL || 'claude-haiku-4-5-20251001';
  const prompt = fill(EXTRACTION_PROMPT, ctx);

  const msg = await client().messages.create({
    model,
    max_tokens: 700,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    return coerce(extractJson(text));
  } catch (err) {
    // Never let a parse failure abort the whole scan; record an absent result.
    return coerce({
      sentiment: 'absent',
      confidence_score: 0,
      extraction_notes: `Parser could not extract structured data: ${err.message}`,
    });
  }
}
