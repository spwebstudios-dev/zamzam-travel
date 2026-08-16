'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

interface Props {
  profile: Profile | null;
}

/**
 * Client Component: edit form for /account.
 * Updates the profiles row in Supabase directly.
 * Email is shown read-only (managed by Supabase Auth, not profiles directly).
 */
export default function AccountEditForm({ profile }: Props) {
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp_number ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    if (!profile) return;

    const supabase = createBrowserClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ phone, whatsapp_number: whatsapp })
      .eq('id', profile.id);

    if (updateError) {
      setError('Could not save changes. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {/* Email — read only */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="account-email"
          className="label-caps"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Email address
        </label>
        <input
          id="account-email"
          type="email"
          value={profile?.email ?? ''}
          disabled
          className="w-full px-4 py-3 rounded border text-sm opacity-60 cursor-not-allowed"
          style={{
            borderColor: 'var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface-container)',
            color: 'var(--color-on-surface)',
          }}
        />
        <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
          Email cannot be changed here.
        </p>
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="account-phone"
          className="label-caps"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Phone number
        </label>
        <input
          id="account-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
          style={{
            borderColor: 'var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface-container-lowest)',
            color: 'var(--color-on-surface)',
          }}
        />
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="account-whatsapp"
          className="label-caps"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          WhatsApp number
        </label>
        <input
          id="account-whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
          style={{
            borderColor: 'var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface-container-lowest)',
            color: 'var(--color-on-surface)',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-sm px-4 py-3 rounded"
          style={{
            backgroundColor: 'var(--color-error-container)',
            color: 'var(--color-on-error-container)',
          }}
        >
          {error}
        </div>
      )}

      {/* Success */}
      {saved && (
        <div
          className="text-sm px-4 py-3 rounded"
          style={{
            backgroundColor: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
          }}
        >
          Changes saved.
        </div>
      )}

      {/* Save button */}
      <button
        id="account-save"
        type="submit"
        disabled={saving}
        className="self-start px-8 py-3 rounded label-caps transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
        }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

      {/* Role badge (read-only info) */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
        <span className="label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
          Account type:{' '}
        </span>
        <span
          className="label-caps px-2 py-0.5 rounded"
          style={{
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
          }}
        >
          {profile?.role ?? 'traveler'}
        </span>
      </div>
    </form>
  );
}
