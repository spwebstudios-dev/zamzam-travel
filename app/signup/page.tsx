'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

/**
 * /signup — Traveler account creation.
 *
 * Flow:
 * 1. supabase.auth.signUp() creates the Auth user
 * 2. The handle_new_user DB trigger auto-creates the profiles row
 * 3. We immediately UPDATE profiles with phone + whatsapp_number
 * 4. Redirect to /account on success
 *
 * Role is ALWAYS 'traveler' — there is no path for a user to
 * self-assign the 'admin' role.
 */
export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const phone = form.get('phone') as string;
    const whatsapp_number = form.get('whatsapp') as string;

    const supabase = createBrowserClient();

    // 1. Create Auth user — trigger fires on the DB side
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    // 2. Update the auto-created profile with phone + WhatsApp
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ phone, whatsapp_number })
      .eq('id', signUpData.user.id);

    if (profileError) {
      // Non-fatal — profile was created, contact details can be filled later
      console.error('Profile update error:', profileError.message);
    }

    router.push('/account');
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-5 py-16">
      <div
        className="w-full max-w-md rounded-lg p-8 shadow-sm"
        style={{ backgroundColor: 'var(--color-surface-container-low)' }}
      >
        {/* Heading */}
        <h1
          className="font-serif text-3xl mb-2"
          style={{ color: 'var(--color-primary)' }}
        >
          Create Account
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Join ZamZam Travel to start booking your journey.
        </p>

        {/* Error banner */}
        {error && (
          <div
            className="text-sm px-4 py-3 rounded mb-6"
            style={{
              backgroundColor: 'var(--color-error-container)',
              color: 'var(--color-on-error-container)',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-email"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
              style={{
                borderColor: 'var(--color-outline-variant)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-password"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
              style={{
                borderColor: 'var(--color-outline-variant)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
              }}
            />
            <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
              Minimum 8 characters
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="signup-phone"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Phone number
            </label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
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
              htmlFor="signup-whatsapp"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              WhatsApp number
            </label>
            <input
              id="signup-whatsapp"
              name="whatsapp"
              type="tel"
              className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
              style={{
                borderColor: 'var(--color-outline-variant)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
              }}
            />
            <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
              We&apos;ll send booking updates via WhatsApp
            </p>
          </div>

          {/* Submit */}
          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded label-caps transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Switch to login */}
        <p
          className="text-sm text-center mt-6"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="underline"
            style={{ color: 'var(--color-secondary)' }}
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
