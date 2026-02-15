# BizLeaderPrep (PrepHub FBLA)

## Overview
An AI-driven study platform for FBLA and DECA competition preparation. Features flashcards, mock exams, and competitive event mastery tools.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS (CDN)
- **Backend/Auth**: Supabase (external)
- **AI**: Google GenAI (@google/genai)

## Project Structure
- `index.html` - Entry HTML file
- `index.tsx` - React root mount
- `App.tsx` - Main application component with routing
- `components/` - React components (Auth, Dashboard, Hero, Quiz, StudyView, etc.)
- `data/questionBank.ts` - Question data
- `assets/` - Logo images
- `supabaseClient.ts` - Supabase client configuration
- `firebase.ts` - Firebase integration (removed)
- `vite.config.ts` - Vite configuration

## Development
- Dev server: `npm run dev` (port 5000)
- Build: `npm run build`
- Output: `dist/`

## Environment Variables
- `API_KEY` - Google GenAI API key (used for AI-driven flashcard generation)

## Deployment
- Static deployment, build output in `dist/`
