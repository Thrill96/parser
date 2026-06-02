// Smart prompt generation: use Claude to write the realistic queries a real
// customer would type into an AI assistant about THIS kind of business,
// tuned to its archetype (local/retail/food vs B2B service vs SaaS, etc.).
// Falls back to the static template set when no API key or on error.

import Anthropic from '@anthropic-ai/sdk';
import { generatePrompts } from './prompts.js';

let _client;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const VALID_TYPES = ['recommendation', 'identity', 'comparison', 'direct'];

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON');
  return JSON.parse(candidate.slice(start, end + 1));
}

// Validate/clean the model's prompts; returns [] if nothing usable.
export function normalizeSmartPrompts(parsed) {
  const arr = Array.isArray(parsed?.prompts) ? parsed.prompts : [];
  const seen = new Set();
  const out = [];
  for (const p of arr) {
    const type = VALID_TYPES.includes(p?.prompt_type) ? p.prompt_type : null;
    const text = typeof p?.prompt_text === 'string' ? p.prompt_text.trim().replace(/\s+/g, ' ') : '';
    if (!type || !text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ prompt_type: type, prompt_text: text });
  }
  return out;
}

function buildPrompt(domain, competitors) {
  return `You are designing test prompts to measure a brand's visibility in AI assistants
(ChatGPT, Claude, Gemini). The prompts must read EXACTLY like what a real potential customer
or researcher would type — natural, not marketing copy.

BUSINESS:
- Brand: ${domain.brand_name}
- Owner/founder: ${domain.owner_name || '(unknown)'}
- What they do: ${domain.service_category || '(unknown)'}
- Location: ${domain.location || '(not specified)'}
- Known competitors: ${competitors.length ? competitors.join(', ') : '(none given)'}

Step 1: infer the business archetype (e.g. local service, retail/product, restaurant/food,
B2B service or consulting, SaaS/software, professional practice, e-commerce).

Step 2: write 12 prompts grounded in that archetype:
- 4 "recommendation": how a shopper looks for this type of business. Use realistic framings
  ("best", "top", "who should I hire", "where can I buy/find", "near me", include the city if
  local). These MUST NOT name the brand — we want to see if the brand surfaces on its own.
- 4 "identity": someone who heard the brand or owner name and wants to know about it
  (include "What is ${domain.brand_name}?" and natural variations; use the owner name if given).
- 2 "comparison": the brand vs a named competitor, and "${domain.brand_name} reviews".
- 2 "direct": short navigational queries for the brand/owner.

Rules:
- For local/retail/food: use "near me", the city, "where can I get/buy" — never "consultants".
- For B2B/professional: use "who should I hire", "best firm/agency/consultant for ...".
- Make recommendation prompts category-accurate, so a win means the AI truly recommends this
  brand for real buyer intent.

Return JSON ONLY (no prose, no fences):
{ "archetype": "...", "prompts": [ { "prompt_type": "recommendation|identity|comparison|direct", "prompt_text": "..." } ] }`;
}

/**
 * @param {object} domain row (competitors is a JSON string)
 * @returns {Promise<{archetype: string|null, prompts: {prompt_text,prompt_type}[], source: 'ai'|'fallback'}>}
 */
export async function generateSmartPrompts(domain) {
  const fallback = () => ({ archetype: null, prompts: generatePrompts(domain), source: 'fallback' });

  if (!process.env.ANTHROPIC_API_KEY) return fallback();

  let competitors = [];
  try {
    competitors = domain.competitors ? JSON.parse(domain.competitors) : [];
  } catch {
    competitors = [];
  }

  try {
    const model = process.env.PROMPTGEN_MODEL || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
    const msg = await client().messages.create({
      model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildPrompt(domain, competitors) }],
    });
    const text = msg.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');
    const parsed = extractJson(text);
    const prompts = normalizeSmartPrompts(parsed);

    // Guard against a thin/garbled result — keep the deterministic set instead.
    if (prompts.length < 6) return fallback();
    return { archetype: parsed.archetype || null, prompts, source: 'ai' };
  } catch (err) {
    console.error('[smart-prompts] falling back to templates:', err.message);
    return fallback();
  }
}
