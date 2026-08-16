import Link from 'next/link';

/**
 * Site-wide footer.
 *
 * Contact info sourced from docs/Design.md §Contact/footer details.
 * Visual structure mirrors design/stitch-export/homepage-mobile/code.html footer section.
 * Brand colors from design/brand/palette-notes.md (primary-container bg, on-primary-container text).
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: 'var(--color-primary-container)',
        borderColor: 'color-mix(in srgb, var(--color-secondary) 20%, transparent)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-20 flex flex-col items-center gap-8 text-center">

        {/* Wordmark */}
        <div>
          <span
            className="font-serif text-2xl md:text-3xl font-bold tracking-[0.15em]"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            ZAM ZAM TRAVEL
          </span>
          <p
            className="label-caps mt-2 opacity-70"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            Your Journey, Our Priority
          </p>
        </div>

        {/* Gold divider */}
        <hr className="divider-gold w-16" />

        {/* Contact + links */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-3 md:gap-10">
          <span
            className="text-sm"
            style={{ color: 'color-mix(in srgb, var(--color-on-primary-container) 80%, transparent)' }}
          >
            Fordsburg, Johannesburg, 2092
          </span>
          <a
            href="tel:0721999999"
            className="text-sm transition-colors hover:opacity-100 opacity-80"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            Irfan: 072 199 9999
          </a>
          <a
            href="mailto:info@zamzamtravel.co.za"
            className="text-sm transition-colors hover:opacity-100 opacity-80"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            info@zamzamtravel.co.za
          </a>
          {/* WhatsApp click-to-chat — number matches Irfan's number */}
          <a
            href="https://wa.me/270721999999"
            target="_blank"
            rel="noopener noreferrer"
            id="footer-whatsapp-link"
            className="text-sm transition-colors hover:opacity-100 opacity-80"
            style={{ color: 'var(--color-secondary-fixed-dim)' }}
          >
            WhatsApp Support
          </a>
        </div>

        {/* Policy links */}
        <nav aria-label="Footer links" className="flex items-center gap-6">
          <Link
            href="/policies/privacy"
            className="label-caps opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            Privacy Policy
          </Link>
          <span style={{ color: 'var(--color-on-primary-container)', opacity: 0.3 }}>·</span>
          <Link
            href="/policies/refund"
            className="label-caps opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            Refund Policy
          </Link>
        </nav>

        {/* Copyright */}
        <p
          className="text-xs opacity-50"
          style={{ color: 'var(--color-on-primary-container)' }}
        >
          © {currentYear} Zam Zam Travel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
