'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { logout } from '@/app/actions/logout';
import type { User } from '@supabase/supabase-js';

/**
 * Site-wide header.
 *
 * Desktop: fixed top bar with logo centred, nav left, "Book Now" CTA right.
 * Mobile: fixed top bar with hamburger left, logo centre, account icon right.
 * On scroll over imagery: glassmorphism backdrop-blur effect (bg-surface/80).
 *
 * Auth-aware: subscribes to onAuthStateChange so the header updates
 * immediately after login/logout without a full page reload.
 *
 * Design source: design/stitch-export/homepage-mobile/code.html (TopAppBar section)
 * Brand tokens: design/brand/palette-notes.md
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  return (
    <>
      {/* ── Fixed header ── */}
      <header
        className="fixed top-0 w-full z-50 shadow-sm"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface) 85%, transparent)' }}
      >
        {/* backdrop blur for the glassmorphism effect */}
        <div className="absolute inset-0 backdrop-blur-md -z-10" />

        <div className="relative flex items-center justify-between h-16 px-5 md:px-16 max-w-[1280px] mx-auto">

          {/* ── Left: hamburger (mobile) / nav links (desktop) ── */}
          <div className="flex items-center gap-6">
            {/* Hamburger — mobile only */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden text-[color:var(--color-primary)] hover:opacity-70 transition-opacity"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              <Link
                href="/packages"
                className="label-caps text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
              >
                Packages
              </Link>
              <Link
                href="/about"
                className="label-caps text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
              >
                About
              </Link>
              {/* Login link — desktop, logged out only */}
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="label-caps text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>

          {/* ── Centre: logo + wordmark ── */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            aria-label="Zam Zam Travel — home"
          >
            {/* Globe/plane SVG placeholder — replace with actual logo asset */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="text-[color:var(--color-primary)]"
            >
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="14" cy="14" rx="5" ry="12" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 14h24" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M18 6 Q22 10 14 14 Q6 18 10 22"
                stroke="var(--color-secondary)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="label-caps text-[color:var(--color-primary)] tracking-[0.18em] font-bold text-sm"
            >
              ZAM ZAM TRAVEL
            </span>
          </Link>

          {/* ── Right: account icon + Book Now CTA / Logout ── */}
          <div className="flex items-center gap-3">
            {/* Account icon — always visible */}
            <Link
              href="/account"
              id="account-icon-link"
              aria-label="My account"
              className="text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>

            {/* Logged in: Log Out button (desktop) */}
            {isLoggedIn ? (
              <form action={logout} className="hidden md:block">
                <button
                  id="header-logout-btn"
                  type="submit"
                  className="label-caps px-4 py-2 rounded transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-surface-container-high)',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  Log Out
                </button>
              </form>
            ) : (
              /* Logged out: Book Now CTA (desktop) */
              <Link
                href="/packages"
                id="header-book-now-cta"
                className="hidden md:inline-flex items-center label-caps px-4 py-2 rounded transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-on-primary-container)',
                }}
              >
                Book Now
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            className="md:hidden border-t px-5 py-4 flex flex-col gap-4"
            style={{
              borderColor: 'var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface-container-lowest)',
            }}
            aria-label="Mobile navigation"
          >
            <Link
              href="/packages"
              className="label-caps text-[color:var(--color-on-surface-variant)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link
              href="/about"
              className="label-caps text-[color:var(--color-on-surface-variant)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  className="label-caps text-[color:var(--color-on-surface-variant)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <form action={logout}>
                  <button
                    id="mobile-logout-btn"
                    type="submit"
                    className="label-caps text-[color:var(--color-on-surface-variant)] text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="label-caps text-[color:var(--color-on-surface-variant)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/packages"
                  id="mobile-book-now-cta"
                  className="label-caps px-4 py-2 rounded text-center transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    color: 'var(--color-on-primary-container)',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
