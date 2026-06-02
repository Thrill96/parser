// Fix Pack generator (Rung 2): turns the audit + recommendations into actual,
// ready-to-paste deliverables — copy, meta tags, JSON-LD, page drafts — with
// platform-specific install instructions. This is the "done for you" layer.

import Anthropic from '@anthropic-ai/sdk';

let _client;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

// Tolerant JSON: recover complete `items` even if the model truncates.
export function parseFixPack(text) {
  const tryParse = (s) => {
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('no JSON');
    return JSON.parse(s.slice(start, end + 1));
  };
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  try {
    const p = tryParse(body);
    return {
      items: Array.isArray(p.items) ? p.items : [],
      offsite_checklist: Array.isArray(p.offsite_checklist) ? p.offsite_checklist : [],
      needs_input: Array.isArray(p.needs_input) ? p.needs_input : [],
    };
  } catch {
    return {
      items: salvageArray(body, 'items'),
      offsite_checklist: salvageStringArray(body, 'offsite_checklist'),
      needs_input: salvageStringArray(body, 'needs_input'),
    };
  }
}

function salvageArray(text, key) {
  const out = [];
  const at = text.search(new RegExp(`"${key}"\\s*:\\s*\\[`));
  if (at === -1) return out;
  let depth = 0;
  let objStart = -1;
  let inStr = false;
  let esc = false;
  for (let j = text.indexOf('[', at) + 1; j < text.length; j++) {
    const c = text[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === '{') {
      if (depth === 0) objStart = j;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && objStart !== -1) {
        try {
          out.push(JSON.parse(text.slice(objStart, j + 1)));
        } catch {
          /* skip */
        }
        objStart = -1;
      }
    } else if (c === ']' && depth === 0) break;
  }
  return out;
}

function salvageStringArray(text, key) {
  const m = text.match(new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => {
    try {
      return JSON.parse(`"${x[1]}"`);
    } catch {
      return x[1];
    }
  });
}

/**
 * @param {object} ctx
 *   domain, brand_name, owner_name, service_category, linkedin_url, location
 *   cms ({id,label,inject}), recommendations (array), schemaIssues (string[])
 * @returns {{items: Array, offsite_checklist: string[]}}
 */
export async function generateFixPack(ctx) {
  const model = process.env.FIXPACK_MODEL || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  const prompt = `You are producing a "Fix Pack" for a small-business owner: the actual, ready-to-paste
deliverables that implement AEO (AI Engine Optimization) fixes. The owner is NOT technical —
they will copy your output and paste it into their site. Write the real artifacts, not advice.

VERIFIED DATA (the ONLY facts you may state about this business):
${JSON.stringify(
  {
    brand: ctx.brand_name,
    owner: ctx.owner_name || null,
    domain: ctx.domain,
    service_category: ctx.service_category || null,
    location: ctx.location || null,
    linkedin_url: ctx.linkedin_url || null,
    other_profiles: ctx.same_as || [],
    owner_supplied_material: ctx.verified_facts || null,
    platform: ctx.cms?.label,
    schema_gaps: ctx.schemaIssues || [],
    strategy_recommendations: (ctx.recommendations || []).map((r) => ({
      title: r.title,
      action: r.action,
      category: r.category,
    })),
  },
  null,
  2
)}

CRITICAL — DO NOT FABRICATE. This content will be pasted onto a live website, so accuracy is
non-negotiable:
- State ONLY facts present in VERIFIED DATA above. Never invent URLs, social/profile handles,
  statistics, percentages, dollar amounts, dates, addresses, phone numbers, client names, or
  credentials.
- NEVER write fake testimonials, reviews, or ratings. If a review/testimonial section or
  Review/AggregateRating schema is warranted, output the STRUCTURE with placeholders only.
- When a needed detail is missing, insert a clearly-bracketed ALL-CAPS placeholder such as
  [ADD YOUR REAL LINKEDIN URL], [ADD A REAL CLIENT TESTIMONIAL — DO NOT FABRICATE], or
  [ADD YEAR FOUNDED], and add a short note to "needs_input".
- For sameAs in schema, include only the linkedin_url / other_profiles that were provided;
  otherwise use a placeholder. Do not guess a handle.
- You MAY write marketing/positioning prose (value props, descriptions of the service) since
  that's derived from the category — but any concrete claim of fact must come from VERIFIED DATA.

PLATFORM INSTALL CONTEXT for "${ctx.cms?.label}": ${ctx.cms?.inject}

Produce the highest-impact, directly-installable artifacts (aim for 5-7). Favor things that
go ON the site: the meta description tag, JSON-LD schema blocks (Organization, Person, and a
relevant Service/FAQ), rewritten homepage hero copy, an About-page draft, and one comparison
or FAQ page draft. Make schema valid JSON-LD wrapped in a <script type="application/ld+json"> tag.

Return JSON ONLY (no prose, no markdown fences):
{
  "items": [
    {
      "title": "Short name of the deliverable",
      "type": "meta" | "schema" | "copy" | "page",
      "format": "html" | "jsonld" | "markdown" | "text",
      "where": "Exactly where this goes (e.g. homepage <head>, /about page body)",
      "content": "The complete, ready-to-paste content (with [PLACEHOLDERS] for any missing facts).",
      "instructions": "Plain-English, ${ctx.cms?.label}-specific steps to install it."
    }
  ],
  "offsite_checklist": [
    "Brief off-site actions that can't be pasted (e.g. 'Create a Clutch.co profile')."
  ],
  "needs_input": [
    "Each real fact the owner must supply before publishing (e.g. 'Real LinkedIn URL', 'At least 3 genuine client testimonials with names')."
  ]
}`;

  const msg = await client().messages.create({
    model,
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return parseFixPack(text);
}
