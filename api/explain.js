export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { question, answer, options, selectedAnswer, eventName } = req.body || {};
    if (!question || !answer) return res.status(400).json({ error: 'Missing question or answer' });

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) return res.status(500).json({ error: 'Anthropic API key not configured' });

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

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 900,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('Claude error:', claudeRes.status, errText);
      return res.status(502).json({ error: `Claude error ${claudeRes.status}: ${errText.slice(0, 200)}` });
    }

    const data = await claudeRes.json();
    const explanation = data.content?.[0]?.text || 'No explanation available.';
    return res.status(200).json({ explanation });

  } catch (err) {
    console.error('explain crash:', err && err.message);
    return res.status(500).json({ error: String(err && err.message || 'Unknown error') });
  }
}
