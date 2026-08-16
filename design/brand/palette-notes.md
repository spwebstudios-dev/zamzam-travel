---
name: Zam Zam Travel Identity
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#414843'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#727973'
  outline-variant: '#c1c8c1'
  surface-tint: '#436652'
  primary: '#001f11'
  on-primary: '#ffffff'
  primary-container: '#123524'
  on-primary-container: '#7a9f88'
  inverse-primary: '#a9cfb7'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdc34d'
  on-secondary-container: '#715000'
  tertiary: '#191a19'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e2f2d'
  on-tertiary-container: '#969694'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5ecd2'
  primary-fixed-dim: '#a9cfb7'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#2b4e3b'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f7bd48'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-padding: 120px
---

## Brand & Style

The design system is rooted in **Modern Minimalism with a Tonal Luxury** aesthetic. It aims to evoke a sense of quiet confidence, high-end hospitality, and curated adventure. The visual language prioritizes clarity and "breathing room" to let high-resolution photography serve as the window into the travel experience.

The interface should feel like a premium editorial magazine—authoritative yet inviting. We avoid decorative flourishes in favor of precision, using deliberate alignment and a restrained palette to communicate trust and exclusivity. All interactions should be smooth and intentional, mirroring the seamless service of a boutique concierge.

## Colors

The palette is anchored by **Deep Forest Green**, providing a sense of stability and traditional luxury. This is used for structural elements and primary actions to command attention without being aggressive. 

**Gold/Bronze accents** are applied sparingly to highlight value (prices, ratings) and signify "Premium" tiers or selected states. The background strategy utilizes **Warm Off-White** (#FAF9F6) for large sections to reduce eye strain and provide a softer, more "analog" feel than pure white, while **Pure White** is reserved for cards and input fields to create subtle internal contrast. Secondary text uses a **Warm Gray** (#6B6B63) to maintain legibility while softening the hierarchy against the near-black headings.

## Typography

This design system employs a classic high-contrast pairing. **Playfair Display** provides the editorial character required for a boutique brand, used exclusively for headings to establish a sophisticated hierarchy. 

**Inter** handles all functional UI and body copy, ensuring maximum legibility across booking flows and technical details. A specific **Label-Caps** style is used for overlines and section markers; it must always be uppercase with a generous 15% letter spacing to create an "architectural" feel. Avoid using the serif font for small labels or interactive elements like buttons to maintain a modern, functional edge.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop (12 columns) to maintain the "magazine" structure, while transitioning to a fluid single-column model on mobile. 

We utilize **Generous Whitespace** (Section Padding of 120px) to separate core narratives and allow imagery to breathe. Spacing follows an 8px linear scale. For luxury impact, use asymmetrical layouts—for example, a 7-column image paired with a 4-column text block with a 1-column offset—to avoid the "standard SaaS" look. Margins on desktop are intentionally wide (64px) to frame the content as a curated collection rather than a data-heavy application.

## Elevation & Depth

Depth is achieved primarily through **Tonal Layers** and **Soft Ambient Shadows**. 

- **Surface Tiers:** Use the Warm Off-White (#FAF9F6) as the base "Canvas." Floating cards and interactive elements use Pure White (#FFFFFF) to naturally lift from the background without needing heavy shadows.
- **Shadows:** When necessary (e.g., in the booking modal), use a very diffused, low-opacity shadow tinted with the Primary color: `box-shadow: 0 20px 40px rgba(18, 53, 36, 0.08)`.
- **Dividers:** Use the Secondary Gold (#B8860B) at 0.5pt thickness for elegant, horizontal rules that separate sections or highlight prices.
- **Glassmorphism:** Apply a light backdrop blur (`blur(10px)`) on navigation bars when scrolling over imagery to maintain the sense of depth and transparency.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness level. This subtle rounding removes the clinical sharpness of 0px corners while maintaining a professional, structured appearance. 

- **Buttons & Inputs:** Use the standard 4px (0.25rem) radius.
- **Image Containers:** Can occasionally use 0px (sharp) corners when spanning the full width of the screen to emphasize the "architectural" luxury feel.
- **Cards:** Use 8px (0.5rem) to provide a gentle containerized feel against the off-white background.
- **Selection Indicators:** Use sharp lines or 1px underlines rather than pills to keep the aesthetic "elevated."

## Components

### Buttons
- **Primary:** Solid Deep Forest Green with white Inter medium text. No gradients.
- **Secondary:** Transparent background with a 1px Forest Green border.
- **Text Button:** Near-black text with a 1px Gold bottom-border that expands on hover.

### Input Fields
- Underlined style or subtle 1px gray border. Focus state uses a Forest Green 1px border. Labels should use the `body-sm` weight in Forest Green when active.

### Cards
- Pure White background, subtle 1px border (#E5E5E1), and an 8px corner radius. Image should always be at the top with a 3:2 or 16:9 aspect ratio.

### Price Highlights
- Always in Gold (#B8860B) using a slightly heavier weight of Inter or a medium Playfair Display for "Starting at" labels.

### Navigation
- Top-aligned with a centered logo. Links use `label-caps` with Forest Green for the active state. Include a "Book Now" primary button at the far right for constant conversion access.

### Booking Flow
- Focus on high-contrast clarity. Use white containers on the off-white background to isolate the user's task. Progress indicators should be minimalist dots or thin lines in Gold.