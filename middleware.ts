import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * Middleware: refreshes the Supabase session cookie on every request.
 *
 * This is required by @supabase/ssr — without it, server components will
 * see a stale/expired session even if the user is still active. The actual
 * route protection (redirect logic) lives in lib/auth.ts, not here.
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient({
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      // Write cookies onto both the request (for downstream server components)
      // and the response (for the browser).
      cookiesToSet.forEach(({ name, value }) =>
        request.cookies.set(name, value)
      );
      supabaseResponse = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options)
      );
    },
  });

  // IMPORTANT: do not run any logic between createServerClient and
  // supabase.auth.getUser() — required by @supabase/ssr.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (png, svg, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
