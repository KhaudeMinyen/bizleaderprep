export const config = { api: { bodyParser: true } };

export default async function handler(req: any, res: any) {
  try {
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

    const callGemini = async (key: string) =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.4 },
        }),
      });

    let geminiRes = await callGemini(keys[0]);
    if (geminiRes.status === 429 && keys[1]) {
      geminiRes = await callGemini(keys[1]);
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', geminiRes.status, errText);
      return res.status(502).json({ error: `Gemini error ${geminiRes.status}` });
    }

    const data = await geminiRes.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No explanation available.';
    return res.status(200).json({ explanation });

  } catch (err: any) {
    console.error('explain handler crash:', err?.message ?? err);
    return res.status(500).json({ error: String(err?.message ?? 'Internal error') });
  }
}
