'use server';

import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * Server Action: signs the current user out and redirects to the homepage.
 * Called from the Header's "Log Out" button via a form action.
 */
export async function logout() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect('/');
}
