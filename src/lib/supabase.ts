import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Cookie-based storage so auth persists across new tabs and browser restarts.
// Supabase tokens are typically 1–3 KB; well within the 4 KB cookie limit.
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function setCookie(name: string, value: string): void {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const enc = encodeURIComponent(name);
  const match = document.cookie.split('; ').find(c => c.startsWith(enc + '='));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(enc.length + 1));
  } catch {
    return null;
  }
}

function removeCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/;`;
}

const cookieStorage = {
  getItem: getCookie,
  setItem: setCookie,
  removeItem: removeCookie,
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: cookieStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = () =>
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project-url');

// Matches the 'FBLA HS Questions' table in Supabase
export type QuestionRow = {
  id: number;
  event: string;
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
};
