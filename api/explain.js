export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { question, answer, options, selectedAnswer, eventName } = req.body || {};
    if (!question || !answer) return res.status(400).json({ error: 'Missing question or answer' });

    const key1 = process.env.GEMINI_KEY_A;
    const key2 = process.env.GEMINI_KEY_B;
    const keys = [key1, key2].filter(Boolean);

    if (keys.length === 0) return res.status(500).json({ error: 'Gemini API keys not configured' });

    const letters = ['A', 'B', 'C', 'D'];
    const opts = Array.isArray(options) ? options : [];
    const [a1, a2, a3, a4] = opts;

    const prompt = `You are an FBLA study tutor helping middle and high school students prepare for competitive exams.

A student just answered this question:

Question: ${question}
A. ${a1 || ''}
B. ${a2 || ''}
C. ${a3 || ''}
D. ${a4 || ''}

Correct Answer: ${answer}
Student's Answer: ${selectedAnswer || 'Unknown'}

Write a study explanation following this EXACT structure every time, no exceptions:

1. WHY IT'S CORRECT: In 1-2 sentences, explain specifically why "${answer}" is the right answer. Do NOT just restate the answer — explain the reasoning behind it.

2. WHY THE OTHERS ARE WRONG: In 1 sentence each, briefly explain why each of the other 3 answer choices is incorrect.

3. KEY CONCEPT: In 1-2 sentences, state the broader concept or rule a student should remember from this question.

Always use simple language appropriate for a middle or high school student. Always follow all 3 sections — never skip any section. Never start your response by repeating the question.`;

    const callGemini = (key) =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 900, temperature: 0.4 },
        }),
      });

    let geminiRes = await callGemini(keys[0]);
    if (geminiRes.status === 429 && keys[1]) {
      geminiRes = await callGemini(keys[1]);
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', geminiRes.status, errText);
      return res.status(502).json({ error: `Gemini error ${geminiRes.status}: ${errText.slice(0, 200)}` });
    }

    const data = await geminiRes.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation available.';
    return res.status(200).json({ explanation });

  } catch (err) {
    console.error('explain crash:', err && err.message);
    return res.status(500).json({ error: String(err && err.message || 'Unknown error') });
  }
}
