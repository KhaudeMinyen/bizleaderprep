
import { createClient } from '@supabase/supabase-js';

// INSTRUCTIONS:
// 1. Go to https://supabase.com/dashboard/project/_/settings/api
// 2. Copy "Project URL" -> SUPABASE_URL
// 3. Copy the "anon" or "publishable" key -> SUPABASE_ANON_KEY

const SUPABASE_URL: string = 'https://pvusqaabryhcsmwwhfot.supabase.co';
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dXNxYWFicnloY3Ntd3doZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMDkwMDIsImV4cCI6MjA4NDc4NTAwMn0.pT9lhL9OoImV7mjwEmSNMNjpkieo-ktj_ffpBiViOuk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to check if the user has configured their keys correctly
export const isSupabaseConfigured = () => {
  const isUrlConfigured = SUPABASE_URL.length > 0 && 
                          !SUPABASE_URL.includes('your-project-url');
                          
  const isKeyConfigured = SUPABASE_ANON_KEY.length > 0 && 
                          !SUPABASE_ANON_KEY.includes('INSERT_YOUR_ANON_KEY') &&
                          !SUPABASE_ANON_KEY.includes('your-anon-key');
  
  return isUrlConfigured && isKeyConfigured;
};
