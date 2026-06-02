// Claude-generated "Recommended Actions" — reads a domain's latest scan data
// (visibility, per-engine scores, competitor displacement, schema gaps) and
// produces prioritized, specific AEO fixes.

import Anthropic from '@anthropic-ai/sdk';

let _client;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('no JSON object found');
  return JSON.parse(candidate.slice(start, end + 1));
}

// Salvage parser: if the model's JSON is truncated (e.g. cut off at the token
// limit mid-array), recover the summary and every COMPLETE recommendation
// object instead of losing the whole batch.
function salvage(text) {
  let summary = '';
  const sm = text.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (sm) {
    try {
      summary = JSON.parse(`"${sm[1]}"`);
    } catch {
      summary = sm[1];
    }
  }

  const recommendations = [];
  const arrAt = text.search(/"recommendations"\s*:\s*\[/);
  if (arrAt !== -1) {
    let depth = 0;
    let objStart = -1;
    let inStr = false;
    let esc = false;
    const from = text.indexOf('[', arrAt) + 1;
    for (let j = from; j < text.length; j++) {
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
            recommendations.push(JSON.parse(text.slice(objStart, j + 1)));
          } catch {
            /* skip a malformed object */
          }
          objStart = -1;
        }
      } else if (c === ']' && depth === 0) break;
    }
  }
  return { summary, recommendations };
}

export function parseRecommendations(text) {
  try {
    const parsed = extractJson(text);
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch {
    return salvage(text);
  }
}

// Compact the raw results into a per-prompt digest so the prompt stays cheap.
function digest(results) {
  return results.map((r) => ({
    prompt: r.prompt_text,
    type: r.prompt_type,
    engine: r.engine,
    mentioned: !!r.brand_mentioned,
    linked: !!r.website_linked,
    correct: !!r.correctly_identified,
    score: r.confidence_score,
    competitors: Array.isArray(r.competitor_mentioned)
      ? r.competitor_mentioned
      : safeArr(r.competitor_mentioned),
  }));
}

function safeArr(v) {
  try {
    const a = JSON.parse(v || '[]');
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

/**
 * @param {object} ctx
 *   domain, brand_name, owner_name, service_category, linkedin_url
 *   visibility (computed object), results (parsed rows), schemaIssues (string[]),
 *   schemaScore (number|null), competitors (string[])
 * @returns {{summary: string, recommendations: Array}}
 */
export async function generateRecommendations(ctx) {
  const model = process.env.RECOMMENDATIONS_MODEL || process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

  const payload = {
    brand: ctx.brand_name,
    owner: ctx.owner_name,
    domain: ctx.domain,
    service_category: ctx.service_category,
    linkedin_url: ctx.linkedin_url,
    overall_score: ctx.visibility?.overall_score,
    per_engine: {
      chatgpt: ctx.visibility?.chatgpt_score,
      claude: ctx.visibility?.claude_score,
      gemini: ctx.visibility?.gemini_score,
      perplexity: ctx.visibility?.perplexity_score,
    },
    schema_score: ctx.schemaScore,
    schema_gaps: ctx.schemaIssues || [],
    competitor_displacement_pct: ctx.visibility?.competitor_displacement,
    competitors_seen: ctx.competitors || [],
    prompt_results: digest(ctx.results || []),
  };

  const prompt = `You are an AI Engine Optimization (AEO) strategist. Below is real monitoring
data for a brand: how AI assistants (ChatGPT, Claude, Gemini, Perplexity) responded to
standardized prompts about it, plus a technical schema/JSON-LD audit of its homepage.

DATA:
${JSON.stringify(payload, null, 2)}

Produce concrete, prioritized recommendations to improve how AI engines find, recommend,
and correctly identify this brand. Be specific to THIS data — reference the actual prompts
that failed, the actual competitors displacing them, and the actual schema gaps. Avoid
generic SEO advice. Each recommendation must be an action the owner can take.

Return JSON ONLY in this exact shape (no markdown fences, no prose outside the JSON):
{
  "summary": "2-3 sentence executive summary of where the brand stands and the single biggest lever.",
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "category": "schema" | "content" | "authority" | "competitive" | "technical",
      "title": "Short imperative title",
      "why": "What the data shows that makes this matter (cite specifics).",
      "action": "The concrete step to take."
    }
  ]
}
Order recommendations by priority (high first). Aim for 4-7 recommendations.`;

  const msg = await client().messages.create({
    model,
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return parseRecommendations(text);
}
