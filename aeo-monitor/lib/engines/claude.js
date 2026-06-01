// Anthropic Messages — Claude monitoring engine.
// Model: claude-sonnet-4-20250514.

import Anthropic from '@anthropic-ai/sdk';

export const id = 'claude';
export const label = 'Claude';

let _client;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

export function enabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function run(prompt) {
  const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
  const msg = await client().messages.create({
    model,
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}
