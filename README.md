# BizLeaderPrep

A study prep platform for FBLA and DECA competitive events. Built for high school and middle school students competing in business and leadership organizations.

Live at: [bizleaderprep.com](https://bizleaderprep.com)

---

## Features

- **Flashcards** — Flip-card memorization with question and answer
- **Mock Exam** — Timed multiple-choice test with scoring and wrong answer review
- **Animal Stax** — Arcade-style break game
- **Difficulty Levels** — Beginner, Intermediate, Advanced (FBLA HS only)
- **Wrong Answer Review** — See every mistake after a test with correct answers highlighted
- **Exam Timer** — Countdown based on number of questions (45s per question)
- **Free Preview** — Non-logged-in users get 5 questions with retry support
- **Google OAuth** — Sign in with Google via Supabase Auth
- **Mastery Tracking** — Best scores saved locally per event

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS (CDN) |
| Backend / Auth | Supabase |
| Deployment | Vercel |

---

## Project Structure

```
bizleaderprep-main/
├── App.tsx                  # Root component, routing, auth state
├── index.tsx                # Entry point
├── index.html
├── components/
│   ├── Dashboard.tsx        # Event selection screen
│   ├── StudyView.tsx        # Flashcard, test, summary, and review modes
│   ├── Header.tsx
│   └── Quiz.tsx
├── src/
│   └── lib/
│       └── supabase.ts      # Supabase client setup
├── data/
│   └── questionBank.ts      # Static fallback questions (non-FBLA-HS)
├── assets/                  # Logos (FBLA, DECA, etc.)
└── vercel.json              # Vercel routing config
```

---

## Supabase Table: `FBLA HS Questions`

| Column | Type | Notes |
|---|---|---|
| `id` | int | Primary key |
| `event` | text | Must match event name exactly |
| `question` | text | Question text |
| `difficulty` | text | `Beginner`, `Intermediate`, or `Advanced` |
| `answer_choice_1` | text | Option A |
| `answer_choice_2` | text | Option B |
| `answer_choice_3` | text | Option C |
| `answer_choice_4` | text | Option D |
| `correct_answer` | text | `A`, `B`, `C`, or `D` |

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 3. Start dev server
npm run dev
```

### Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> The anon key is safe to expose — Supabase Row Level Security (RLS) controls data access.

---

## Deployment

The project auto-deploys to Vercel on every push to `main`.

1. Push to GitHub
2. Vercel detects the push and rebuilds (~1 minute)
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables

---

## Supported Events

### FBLA High School (30 events, live from Supabase)
Accounting, Advanced Accounting, Advertising, Agribusiness, Business Communication, Business Ethics, Business Law, Computer Problem Solving, Cybersecurity, Data Science & AI, Economics, Entrepreneurship, Financial Math & Analysis, Healthcare Administration, Human Resource Management, Insurance & Risk Management, International Business, Introduction to Business Communication, Introduction to Business Concepts, Introduction to Business Procedures, Introduction to FBLA, Introduction to Information Technology, Introduction to Marketing Concepts, Introduction to Marketing Strategies, Introduction to Parliamentary Procedure, Marketing, Networking Concepts, Organizational Leadership, Personal Finance, Securities & Investments

### DECA and FBLA Middle School
Static question bank — see [data/questionBank.ts](data/questionBank.ts)
