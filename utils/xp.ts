/*
================================================================================
SUPABASE SCHEMA SQL (run in Supabase SQL Editor)
================================================================================

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE,
  xp integer DEFAULT 0,
  rank text DEFAULT 'Intern',
  is_founder boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own xp"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-insert trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, xp, rank)
  VALUES (new.id, 0, 'Intern');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Admin function to appoint Founder:
-- UPDATE user_profiles
-- SET is_founder = true, rank = 'Founder', updated_at = now()
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@email.com');

================================================================================
*/

export type Rank =
  | 'Intern'
  | 'Associate'
  | 'Manager'
  | 'Director'
  | 'Vice President'
  | 'President'
  | 'CEO'
  | 'Founder';

export const RANKS: { rank: Rank; minXP: number; color: string }[] = [
  { rank: 'Intern',         minXP: 0,      color: '#888888' },
  { rank: 'Associate',      minXP: 500,    color: '#3b82f6' },
  { rank: 'Manager',        minXP: 2000,   color: '#8b5cf6' },
  { rank: 'Director',       minXP: 5000,   color: '#f59e0b' },
  { rank: 'Vice President', minXP: 10000,  color: '#ef4444' },
  { rank: 'President',      minXP: 20000,  color: '#00cc55' },
  { rank: 'CEO',            minXP: 35000,  color: '#00ff6a' },
  { rank: 'Founder',        minXP: -1,     color: '#ffd700' },
];

export const XP_REWARDS = {
  CORRECT_ANSWER:    10,
  WRONG_ANSWER:       2,
  EVENT_COMPLETED:  150,
  DAILY_QUESTION:    25,
  NEW_EVENT_STARTED: 50,
  PERFECT_QUIZ:      75,
  STREAK_BONUS:      30,
};

export function getRankFromXP(xp: number, isFounder: boolean): Rank {
  if (isFounder) return 'Founder';
  const earned = [...RANKS]
    .filter(r => r.minXP >= 0)
    .reverse()
    .find(r => xp >= r.minXP);
  return earned?.rank ?? 'Intern';
}

export function getNextRank(currentRank: Rank): (typeof RANKS)[0] | null {
  if (currentRank === 'CEO' || currentRank === 'Founder') return null;
  const idx = RANKS.findIndex(r => r.rank === currentRank);
  return RANKS[idx + 1] ?? null;
}

export function getXPToNextRank(xp: number, currentRank: Rank): number {
  const next = getNextRank(currentRank);
  if (!next) return 0;
  return Math.max(0, next.minXP - xp);
}

export function getRankColor(rank: Rank): string {
  return RANKS.find(r => r.rank === rank)?.color ?? '#888';
}

export function getXPProgress(xp: number, rank: Rank): number {
  // Returns 0-100 percentage progress to next rank
  const current = RANKS.find(r => r.rank === rank);
  const next = getNextRank(rank);
  if (!current || !next) return 100;
  const range = next.minXP - current.minXP;
  const earned = xp - current.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
}
