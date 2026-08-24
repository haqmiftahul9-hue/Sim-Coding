---
name: Academic Precision
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9de'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#efedf2'
  surface-container-high: '#e9e7ec'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1f'
  on-surface-variant: '#44474f'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#455e90'
  primary: '#00183d'
  on-primary: '#ffffff'
  primary-container: '#0f2d5c'
  on-primary-container: '#7d96cb'
  inverse-primary: '#adc6ff'
  secondary: '#3c5e9b'
  on-secondary: '#ffffff'
  secondary-container: '#9bbbff'
  on-secondary-container: '#264a86'
  tertiary: '#2e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#4e2200'
  on-tertiary-container: '#c9865b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#2c4676'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#214582'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#6c3a14'
  background: '#faf9fd'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
  sidebar-width: 260px
---

## Brand & Style

This design system is built on a **Premium SaaS aesthetic**, prioritizing clarity, intentionality, and a "handcrafted" educational feel. It moves away from generic dashboard templates in favor of a structured, reliable environment that feels both authoritative and accessible. 

The visual direction combines **Modern Professionalism** with a **Minimalist** ethos. It utilizes clean white canvases, high-contrast dark sidebars for navigation, and subtle elevation to define hierarchy. The emotional response should be one of "structured focus"—reducing cognitive load for students and administrators while maintaining a high-end, institutional quality.

Key stylistic pillars include:
- **Subtle Precision:** Every line, margin, and padding is calculated to feel deliberate.
- **Surface Layering:** Using soft grays and blues to create depth without relying on heavy gradients.
- **Functional Clarity:** Status colors are used sparingly but decisively to guide user action.

## Colors

The palette is anchored by deep, institutional blues that convey stability and intelligence. 

- **Primary Dark Blue (#0F2D5C):** Reserved for primary navigation backgrounds (sidebars) and high-level headings. It provides the "anchor" for the UI.
- **Secondary Navy Blue (#173E7A):** Used for hover states on dark elements and secondary branding marks.
- **Accent Blue (#2563EB):** The "action" color. Used for primary buttons, active states, and focus indicators.
- **Background Tiers:** The main application background uses a **Soft Blue (#EFF6FF)** to reduce eye strain, while the content "canvases" are pure **White (#FFFFFF)** to ensure maximum legibility and a premium feel.
- **Status Colors:** These follow standard semantic patterns but are slightly desaturated to fit the professional tone.

## Typography

This design system employs a dual-font strategy to balance character with utility.

- **Plus Jakarta Sans** is used for headlines and titles. Its slightly wider, geometric proportions provide a modern, approachable, and premium feel.
- **Inter** is used for all body text, inputs, and data tables. It is chosen for its exceptional legibility at small sizes and its neutral, systematic tone.

**Hierarchy Rules:**
- Use `display-lg` only for marketing hero sections or major dashboard greetings.
- `label-sm` should be used for table headers and section overlines, often paired with a subtle color like a medium gray.
- Ensure a minimum line-height of 1.5x for body text to maintain the "educational tool" readability standards.

## Layout & Spacing

The design system utilizes a **8px linear scale** to ensure consistent rhythm across all components.

**Layout Model:**
- **Sidebar:** A fixed-width left navigation (`260px`) using the Primary Dark Blue background.
- **Main Canvas:** A fluid content area that sits on the Soft Blue background. Content is usually contained within a white card-like "stage" with `24px` internal padding.
- **Grid:** A 12-column grid is used for complex forms and dashboards. Gutters are fixed at `24px`.

**Breakpoints:**
- **Mobile (<768px):** Sidebar collapses into a hamburger menu. Margins reduce to `16px`.
- **Tablet (768px - 1024px):** Sidebar may transition to a narrow icon-only rail (`72px`).
- **Desktop (>1024px):** Standard 12-column layout with the full sidebar.

## Elevation & Depth

To maintain the "Stripe/Linear" aesthetic, elevation is handled with **Tonal Layers** and **Ambient Shadows** rather than stark borders.

1.  **Level 0 (Background):** `EFF6FF` (Soft Blue). The base of the application.
2.  **Level 1 (Canvas):** `FFFFFF` (White). Main content cards. These feature a very soft, diffused shadow: `0px 1px 3px rgba(15, 45, 92, 0.05), 0px 10px 20px rgba(15, 45, 92, 0.02)`.
3.  **Level 2 (Interactions):** Popovers, dropdowns, and modals. These use a slightly more pronounced shadow and a thin `1px` border in `F1F5F9`.

**Sidebars** do not use shadows; they rely on color contrast (Primary Dark Blue against Soft Blue) to establish their position in the stack.

## Shapes

The shape language is controlled and modern. 

- **Components (Buttons, Inputs):** Use a `0.5rem` (8px) radius. This provides a soft, professional look without feeling overly "bubbly" or childish.
- **Containers (Cards, Sections):** Use `rounded-lg` (1rem / 16px) to clearly define content areas.
- **Large Surfaces:** Modals or main dashboard containers may use `rounded-xl` (1.5rem / 24px) for a more premium, "app-like" feel.

## Components

### Buttons
- **Primary:** Background `Accent Blue`, white text. No gradient. 1px inset top border for a "pressed" look.
- **Secondary:** White background, 1px border in `E2E8F0`, text in `Primary Dark Blue`.
- **Ghost:** No background or border. Text in `Secondary Navy Blue`.

### Data Tables (The Core Education Tool)
- **Header:** `Soft Gray` background, `label-sm` typography (all-caps), 1px bottom border.
- **Rows:** White background, subtle hover state in `EFF6FF`. Row height `56px` minimum.
- **Cells:** `body-sm` typography. Status indicators should use small, colored dots or pill-shaped badges with `10%` opacity backgrounds.

### Input Fields
- **Default:** White background, `1px` border in `E2E8F0`. 
- **Focus:** `1px` border in `Accent Blue` with a `3px` soft blue outer glow.
- **Labels:** Always positioned above the input in `label-md`.

### Sidebar Navigation
- **Items:** Transparent background. Hover state uses `173E7A`. 
- **Active State:** A vertical `2px` strip of `Accent Blue` on the far left of the item.

### Cards
- Always white background. 
- Border: `1px` solid `F1F5F9` (very faint).
- Padding: `24px` standard.