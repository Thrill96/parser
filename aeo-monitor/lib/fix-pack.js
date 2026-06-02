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
    };
  } catch {
    return { items: salvageArray(body, 'items'), offsite_checklist: salvageStringArray(body, 'offsite_checklist') };
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

BRAND DATA:
${JSON.stringify(
  {
    brand: ctx.brand_name,
    owner: ctx.owner_name,
    domain: ctx.domain,
    service_category: ctx.service_category,
    location: ctx.location,
    linkedin_url: ctx.linkedin_url,
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

PLATFORM INSTALL CONTEXT for "${ctx.cms?.label}": ${ctx.cms?.inject}

Produce the highest-impact, directly-installable artifacts (aim for 5-7). Favor things that
go ON the site: the meta description tag, JSON-LD schema blocks (Organization, Person, and a
relevant Service/FAQ), rewritten homepage hero copy, an About-page draft, and one comparison
or FAQ page draft. For each artifact, write the FINAL content the owner pastes — fully filled
in with their real details, no placeholders like [Name]. Make schema valid JSON-LD wrapped in
a <script type="application/ld+json"> tag.

Return JSON ONLY (no prose, no markdown fences):
{
  "items": [
    {
      "title": "Short name of the deliverable",
      "type": "meta" | "schema" | "copy" | "page",
      "format": "html" | "jsonld" | "markdown" | "text",
      "where": "Exactly where this goes (e.g. homepage <head>, /about page body)",
      "content": "The complete, ready-to-paste content.",
      "instructions": "Plain-English, ${ctx.cms?.label}-specific steps to install it."
    }
  ],
  "offsite_checklist": [
    "Brief off-site actions that can't be pasted (e.g. 'Create a Clutch.co profile listing AI implementation consulting')."
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
