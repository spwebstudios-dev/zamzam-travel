'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

/**
 * /login — Traveler login page.
 *
 * On success → redirect to /account.
 * On failure → generic "Invalid email or password" (never leaks which field
 * is wrong, per security spec in 03-auth.md §2).
 */
export default function LoginPage() {
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

    const supabase = createBrowserClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Generic message — do not expose whether email or password was wrong.
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push('/account');
    router.refresh(); // Refresh server components (header) after login
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
          Welcome Back
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Log in to manage your bookings.
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
              htmlFor="login-email"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Email address
            </label>
            <input
              id="login-email"
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
              htmlFor="login-password"
              className="label-caps"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded border text-sm outline-none transition-colors focus:border-[color:var(--color-primary)]"
              style={{
                borderColor: 'var(--color-outline-variant)',
                backgroundColor: 'var(--color-surface-container-lowest)',
                color: 'var(--color-on-surface)',
              }}
            />
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded label-caps transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
            }}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        {/* Switch to signup */}
        <p
          className="text-sm text-center mt-6"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="underline"
            style={{ color: 'var(--color-secondary)' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
