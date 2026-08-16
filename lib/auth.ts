import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';
import type { Profile } from '@/lib/types';

/**
 * Ensures the current request has an authenticated session.
 * Redirects to /login if not.
 * Returns the authenticated user object on success.
 *
 * Usage (in a Server Component):
 *   const user = await requireAuth();
 */
export async function requireAuth() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Ensures the current request has an authenticated session AND that the
 * user's profiles.role is 'admin'.
 *
 * Redirects to / (silently — no "not admin" message exposed) if:
 *   - not logged in, OR
 *   - logged in but role !== 'admin'
 *
 * Returns the Profile row on success.
 *
 * Usage (in a Server Component):
 *   const profile = await requireAdmin();
 */
export async function requireAdmin(): Promise<Profile> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  return profile as Profile;
}
