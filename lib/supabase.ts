import { createBrowserClient as ssrBrowserClient } from '@supabase/ssr';
import { createServerClient as ssrServerClient, type CookieMethodsServer } from '@supabase/ssr';

// ---------------------------------------------------------------------------
// Environment validation (runs at module load time on both client and server)
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  );
}

// ---------------------------------------------------------------------------
// Browser client — use in Client Components ('use client')
// Creates a new client per call but @supabase/ssr handles deduplication.
// ---------------------------------------------------------------------------
export function createBrowserClient() {
  return ssrBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

// ---------------------------------------------------------------------------
// Server client — use in Server Components, Route Handlers, and Middleware.
// Caller must supply cookie read/write methods from the Next.js request context.
// ---------------------------------------------------------------------------
export function createServerClient(cookieMethods: CookieMethodsServer) {
  return ssrServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: cookieMethods,
  });
}
