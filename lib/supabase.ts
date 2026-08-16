import { createClient } from '@supabase/supabase-js';

// These env vars must be set in .env.local (never committed to git).
// NEXT_PUBLIC_ prefix means they are safe to expose to the browser;
// they only give access to Supabase via Row-Level Security — the
// service-role key (which bypasses RLS) must NEVER go in a NEXT_PUBLIC_ var.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  );
}

// Singleton client — every file in the app imports from here.
// Do NOT call createClient() elsewhere in the codebase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
