// OpenAI Chat Completions — ChatGPT monitoring engine.
// Model: gpt-4o-mini (cheap, sufficient for monitoring).

export const id = 'chatgpt';
export const label = 'ChatGPT';

export function enabled() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function run(prompt) {
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
