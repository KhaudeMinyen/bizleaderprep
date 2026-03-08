import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGemini(apiKey: string, prompt: string) {
  return fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 200, temperature: 0.4 },
    }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, answer, options, eventName } = req.body ?? {};
  if (!question || !answer) return res.status(400).json({ error: 'Missing question or answer' });

  const key1 = process.env.GEMINI_KEY_A;
  const key2 = process.env.GEMINI_KEY_B;
  const keys = [key1, key2].filter(Boolean) as string[];

  if (keys.length === 0) return res.status(500).json({ error: 'Gemini API keys not configured' });

  const optionsList = Array.isArray(options)
    ? options.map((o: string, i: number) => `${String.fromCharCode(65 + i)}. ${o}`).join('\n')
    : '';

  const prompt = `You are a concise study assistant for ${eventName || 'a business competitive event'} exam prep.

Question: ${question}

Options:
${optionsList}

Correct Answer: ${answer}

In 2-3 sentences, explain why "${answer}" is correct and what key concept this tests. Briefly note why the other options are wrong if helpful. Be educational and direct.`;

  // Try key1 first, fall back to key2 on rate limit (429)
  const [primaryKey, fallbackKey] = keys;

  let geminiRes = await callGemini(primaryKey, prompt);

  if (geminiRes.status === 429 && fallbackKey) {
    geminiRes = await callGemini(fallbackKey, prompt);
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error('Gemini API error:', errText);
    return res.status(502).json({ error: 'Gemini API error' });
  }

  const data = await geminiRes.json();
  const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No explanation available.';
  return res.status(200).json({ explanation });
}
