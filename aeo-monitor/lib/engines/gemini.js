// Google Gemini — generateContent. Free tier covers monitoring volume.
// Model: gemini-2.0-flash.

export const id = 'gemini';
export const label = 'Gemini';

export function enabled() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function run(prompt) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` +
    `?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() ?? ''
  );
}
