---
name: Emerald Institutional
colors:
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  secondary: '#416656'
  on-secondary: '#ffffff'
  secondary-container: '#c3ecd7'
  on-secondary-container: '#476c5b'
  tertiary: '#1f2f43'
  on-tertiary: '#ffffff'
  tertiary-container: '#35455a'
  on-tertiary-container: '#a2b2cb'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface: '#faf8ff'
  on-surface: '#131b2e'
  surface-variant: '#dae2fd'
  on-surface-variant: '#404944'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  surface-tint: '#2b6954'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.01em
  h2:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.05em
    textTransform: uppercase
  numeric-data:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.125rem
  md: 0.25rem
  lg: 0.25rem
  xl: 0.5rem
  full: 0.75rem
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin: 32px
  max_width: 1280px
motion:
  fade-in: fade-in 0.6s ease-out
---

# Emerald Institutional Design System

## Visual Identity & Brand Intent
The **Emerald Institutional** design system is engineered for a high-tier fintech environment where trust, stability, and precision are paramount. Moving away from typical "startup blue," it utilizes a sophisticated, nature-inspired institutional palette that suggests both growth and environmental consciousness.

The design style is **Corporate Modern with a Minimalist influence**. It prioritizes high-contrast legibility and structural clarity. Visual interest is generated through precise geometry and a "tiled" layout approach rather than excessive decoration.

## Color Philosophy
The palette is anchored by a deep **Forest Green (#003527)**, used for primary actions and brand presence. This is supported by a range of functional greens and cool neutrals:
- **Primary Actions:** Forest Green provides a sense of authority and stability.
- **Surface Strategy:** The neutral scale uses "Cool Slate" tones rather than pure grays, preventing the green from feeling too organic or "soft" and keeping it grounded in a professional financial context.
- **Layers:** Depth is created through tonal layers and 1px borders rather than heavy shadows, ensuring the UI feels architectural and fast.

## Typography
**Manrope** is the sole typeface, chosen for its semi-geometric proportions that maintain high legibility even in data-heavy dashboard views.
- **Data Emphasis:** Financial numbers utilize the `numeric-data` token, which features tighter letter-spacing for a "ticker" feel.
- **Hierarchy:** Strong weight differentiation guides the eye, with headlines using Bold (700) or ExtraBold (800) to anchor the page.
- **Labels:** Meta-information and small tags use `label-caps` to distinguish them from interactive text.

## Layout & Spacing
The layout follows a strict **4px base unit** to ensure mathematical harmony across all components.
- **Grid:** On desktop, a 12-column grid is used with consistent `lg` (24px) gutters.
- **Density:** Padding is intentionally kept tight (`sm` or `md`) in data dashboards to maximize information density while maintaining clarity.

## Motion & Depth
- **Motion:** Subtle entrance animations (like `fade-in`) provide a premium feel without slowing down the user.
- **Elevation:** Depth is communicated through color shifts on interactive elements rather than physical "sinking" effects, maintaining a flat, modern architectural style.
