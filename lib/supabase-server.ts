import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

/**
 * Returns a Supabase client wired to the current request's cookie store.
 * Call this inside Server Components, Server Actions, and Route Handlers.
 *
 * Usage:
 *   const supabase = await getSupabaseServer();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      } catch {
        // setAll is called from Server Components where setting cookies
        // is not allowed — safe to ignore, middleware handles refresh.
      }
    },
  });
}
