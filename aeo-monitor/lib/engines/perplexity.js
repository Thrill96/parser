// Perplexity — OpenAI-compatible chat completions, online "sonar" model.

export const id = 'perplexity';
export const label = 'Perplexity';

export function enabled() {
  return Boolean(process.env.PERPLEXITY_API_KEY);
}

export async function run(prompt) {
  const model = process.env.PERPLEXITY_MODEL || 'sonar';
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    throw new Error(`Perplexity ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
