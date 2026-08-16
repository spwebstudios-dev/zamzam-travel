import { requireAuth } from '@/lib/auth';
import { getSupabaseServer } from '@/lib/supabase-server';
import type { Profile } from '@/lib/types';
import AccountEditForm from './AccountEditForm';

/**
 * /account — Traveler profile page (auth required).
 *
 * Server Component:
 * - requireAuth() redirects to /login if no session
 * - Fetches the profiles row server-side (no client-visible fetch)
 * - Passes profile data to the client-side edit form
 */
export default async function AccountPage() {
  const user = await requireAuth();

  const supabase = await getSupabaseServer();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  return (
    <section className="px-5 md:px-16 py-12 max-w-2xl mx-auto">
      {/* Page heading */}
      <h1
        className="font-serif text-4xl mb-2"
        style={{ color: 'var(--color-primary)' }}
      >
        My Account
      </h1>
      <p className="text-sm mb-10" style={{ color: 'var(--color-on-surface-variant)' }}>
        Manage your contact details.
      </p>

      {/* Edit form (Client Component) */}
      <AccountEditForm profile={profile} />
    </section>
  );
}
