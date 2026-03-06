/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

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
  answer_choice_1: string;
  answer_choice_2: string;
  answer_choice_3: string;
  answer_choice_4: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
};
