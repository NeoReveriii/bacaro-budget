# Design System: Bacaro Budget Manager
**Project ID:** 5004376411867209368

## 1. Visual Theme & Atmosphere
The atmosphere is **"Institutional Modernist"** — evoking a premium private banking terminal crossed with a cutting-edge fintech dashboard. The design communicates Precision, Authority, and Transparency. It rejects decorative fluff in favor of high-contrast data visualization and structural stability. Users should feel in **total control** of their financial data.

The density is **Comfortable** — information-rich but never cluttered, with generous whitespace that lets data breathe.

## 2. Color Palette & Roles

### Primary Anchors
- **Deep Authority Navy** (#0F172A) — The commanding foundation. Used for primary buttons, headers, and active navigation states. Conveys trust and professionalism.
- **Crisp White** (#FFFFFF) — Clean surface for cards and content areas. Creates maximum contrast with navy elements.
- **Pale Frost** (#F8FAFC) — A whisper-cool background wash for the page canvas. Differentiates functional areas without heavy shadows.

### Functional Accents
- **Prosperous Emerald** (#10B981) — Used surgically for income indicators, positive trends, and "success" actions (Deposit, Confirm). High-energy contrast against darker tones.
- **Cautionary Coral** (#EF4444) — Reserved for expense indicators, negative trends, and destructive actions (Delete). Used sparingly for maximum impact.
- **Calm Cerulean** (#3B82F6) — Transfer indicators, informational states, and secondary interactive elements.
- **Warm Amber** (#F59E0B) — Goal progress, warning states, and milestone indicators.

### Neutral System
- **Slate Ink** (#334155) — Primary body text. Rich enough for readability, soft enough to avoid fatigue.
- **Steel Gray** (#64748B) — Secondary text, labels, timestamps. Establishes visual hierarchy below primary text.
- **Whisper Border** (#E2E8F0) — Card borders, table dividers, and separator lines. Present but never distracting.
- **Surface Container** (#F1F5F9) — Input field backgrounds, hover states, and subtle zone differentiation.

## 3. Typography Rules
**Manrope** is the sole typeface — chosen for geometric precision and excellent legibility in data-heavy environments.

- **Display/Balance Numbers**: 48px, Weight 700, Letter-spacing -0.02em. Used for large financial figures.
- **H1 (Page Titles)**: 32px, Weight 700, Letter-spacing -0.01em. Tight spacing creates authority.
- **H2 (Section Titles)**: 24px, Weight 600. Clean and commanding.
- **H3 (Card Titles)**: 20px, Weight 600. Card headers and subsections.
- **Body Large**: 18px, Weight 400, Line-height 1.6. Generous leading for comfortable reading.
- **Body Medium**: 16px, Weight 400, Line-height 1.6. Standard content text.
- **Body Small**: 14px, Weight 400, Line-height 1.5. Table data, descriptions.
- **Label Medium**: 14px, Weight 600, Letter-spacing 0.05em. UPPERCASE for meta-data labels.
- **Label Small**: 12px, Weight 500. Timestamps, captions.

Financial figures MUST use tabular (monospaced) numerals for column alignment.

## 4. Component Stylings
* **Buttons:** Gently rounded (6px radius). Primary uses Deep Navy background with White text. Secondary uses Slate outline with transparent fill. Positive actions use Emerald. Destructive actions use Coral with ghost styling.
* **Cards/Containers:** Subtly rounded (8px radius). White background with Whisper Border (1px solid #E2E8F0). No heavy shadows — uses ultra-diffused shadow (blur: 12px, opacity: 4%, color: Navy) for active/floating states.
* **Inputs/Forms:** Surface Container (#F1F5F9) background transitioning to White with Navy border on focus. Labels positioned above in Label Medium style.
* **Stat Cards:** White background with left-accent color bar (4px). Prominent value in Display weight. Sparkline micro-charts where applicable.
* **Data Tables:** Clean horizontal dividers only, no vertical borders. Body Small typography. Numeric columns right-aligned. Alternating hover states.
* **Chips/Status Tags:** 4px radius or pill-shaped. Subtle tinted background with high-contrast text. Never vibrant enough to distract.

## 5. Layout Principles
Fixed **12-column grid** for desktop (1440px max-width). Fluid single-column for mobile.

All spacing governed by **8px base unit**:
- `xs`: 4px — Tight internal spacing
- `sm`: 12px — Element grouping
- `md`: 24px — Container padding, card gaps
- `lg`: 48px — Section separation
- `xl`: 80px — Page-level margins
- `gutter`: 24px — Column gutters
- `margin`: 32px — Page edge margins

Depth is communicated through **tonal layering** rather than floating shadows:
1. **Level 0** (Background): Pale Frost (#F8FAFC)
2. **Level 1** (Cards): White (#FFFFFF) with 1px Whisper Border
3. **Level 2** (Active/Floating): White with ultra-diffused Navy shadow

## 6. Design System Notes for Stitch Generation

When generating new screens for Bacaro Budget Manager, use the following design direction:

**Style:** Corporate Modern Fintech. Clean, precise, data-first. No decorative illustrations or playful elements. The aesthetic is "Swiss private bank meets Silicon Valley dashboard."

**Colors:** Deep Navy (#0F172A) for primary actions and headers. Pale Frost (#F8FAFC) page background. White (#FFFFFF) cards. Emerald (#10B981) for income/success. Coral (#EF4444) for expenses/danger. Cerulean (#3B82F6) for transfers/info. Steel Gray (#64748B) for secondary text.

**Typography:** Manrope font family exclusively. Bold 700 for headings, 600 for subheadings, 400 for body. Financial figures should be large and prominent.

**Shape:** Rounded corners at 6-8px for cards and buttons. Clean 1px borders (#E2E8F0). Minimal shadows. Depth through tonal layering.

**Layout:** 12-column grid. Generous whitespace. 24px gaps between cards. Comfortable density — never cramped, never sparse.

**Components:** Left sidebar navigation (240px). Top header with user greeting. Stat cards with accent color bars. Clean data tables with horizontal dividers only. Doughnut and line charts for data visualization.
