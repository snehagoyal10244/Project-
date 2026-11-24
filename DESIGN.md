---
name: Novara Atelier
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4c463e'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#7e766d'
  outline-variant: '#cfc5ba'
  surface-tint: '#695c4c'
  primary: '#695c4c'
  on-primary: '#ffffff'
  primary-container: '#9e8f7d'
  on-primary-container: '#33291b'
  inverse-primary: '#d5c4b0'
  secondary: '#625e59'
  on-secondary: '#ffffff'
  secondary-container: '#e5ded8'
  on-secondary-container: '#66625d'
  tertiary: '#536256'
  on-tertiary: '#ffffff'
  tertiary-container: '#859587'
  on-tertiary-container: '#1f2d23'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f2e0cb'
  primary-fixed-dim: '#d5c4b0'
  on-primary-fixed: '#231a0e'
  on-primary-fixed-variant: '#504536'
  secondary-fixed: '#e8e1db'
  secondary-fixed-dim: '#ccc5bf'
  on-secondary-fixed: '#1e1b17'
  on-secondary-fixed-variant: '#4a4642'
  tertiary-fixed: '#d6e7d7'
  tertiary-fixed-dim: '#bacbbc'
  on-tertiary-fixed: '#101f15'
  on-tertiary-fixed-variant: '#3b4a3f'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: 4rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 2.5rem
    fontWeight: '400'
    lineHeight: 3rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.04em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the understated elegance of a heritage European department store reimagined as an effortless digital flagship. The aesthetic pairs tactile warmth with editorial discipline, catering to discerning consumers who value curated craftsmanship, intentional living, and quiet luxury.

Key stylistic principles:
- **Quiet Warmth:** Replace sterile whites with warm alabaster, oatmeal, and softened champagne layers.
- **Editorial Contrast:** Juxtapose sweeping transitional serif headlines with structured, highly legible geometric sans-serif UI elements.
- **Restrained Tactility:** Elevate layouts using architectural whitespace, micro-hairlines, and diffused warm ambient shadows rather than stark flat borders or heavy depth effects.

## Colors

The palette revolves around balanced earth minerals, soft parchment, and deep espresso tones that evoke natural linen, bookcloth, and gallery walls.

- **Primary (`#9E8F7D`):** Oatmeal clay. Applied to key interactive accents, elevated category tags, and refined focal touches.
- **Secondary (`#2D2A26`):** Warm espresso. Used for primary interactive actions (CTA buttons), deep contrast icons, and primary titles.
- **Tertiary (`#6B7B6E`):** Dried sage. Provides organic balance for curated highlights, badges, and conscious shopping indicators.
- **Neutral Canvas (`#FAF8F5`):** Soft alabaster warm-white. Serves as the global backdrop to prevent eye strain and establish an inviting atmosphere.
- **Border & Hairline Tints (`#EFECE6`):** Delicate separator lines that anchor spatial relationships without visual weight.
- **Text Hierarchy:** Primary body and prices leverage `#1A1817` for crisp readability, while supporting copy recedes into `#66615B`.

## Typography

Typography establishes an editorial balance: `Playfair Display` evokes timeless literary grace and prestige, while `Plus Jakarta Sans` delivers clarity for shopping mechanics, pricing tiers, and filter navigation.

- **Headlines & Editorial Callouts:** Use `Playfair Display` with standard or italic treatments for titles, hero statements, and collection names. Keep headline weights at 400 or 500 to preserve calligraphic refinement.
- **Functional UI & Metadata:** Use `Plus Jakarta Sans` for body copy, category labels, navigation, and transactional information.
- **Labels & Micro-copy:** Render small category tags and status labels in uppercase `label-md` or `label-sm` with generous letter spacing (0.04em to 0.08em) for an archival, boutique impression.

## Layout & Spacing

The layout philosophy mirrors the curated pacing of an upscale gallery. Generous negative space frames individual products as collectible objects.

- **Grid Structure:** A 12-column responsive fluid grid on desktop (`margin: 3rem`, `gutter: 1.5rem`), transitioning to 8 columns on tablet and 4 columns on mobile devices (`margin-mobile: 1.25rem`, `gutter-mobile: 1rem`).
- **Whitespace Cadence:** Product cards, lookbook features, and editorial carousels use deliberate breathing room (`space-xl` or larger) to ensure browsing feels calm and unhurried.
- **Component Compactness:** Form elements and compact listing rows use `space-sm` and `space-md` gaps to retain tight, predictable transactional workflows.

## Elevation & Depth

Visual depth is achieved primarily through tonal layering and featherweight ambient shadows rather than stark drop-shadows or high-contrast borders.

- **Tonal Stepping:** Surfaces stack naturally from base canvas (`#FAF8F5`) to raised cards (`#FFFFFF`) and inset wells (`#F4EFEB`).
- **Ambient Micro-Shadows:** Floating elements (dropdown menus, sticky checkout bars, floating cart sheets) employ extra-diffused, low-opacity shadows tinted with warm espresso: `0 8px 32px -4px rgba(29, 26, 24, 0.06), 0 2px 8px -2px rgba(29, 26, 24, 0.03)`.
- **Low-Contrast Separation:** Structural divisions favor 1px borders tinted in `#EFECE6` over shadows, keeping interfaces luminous and tactile.

## Shapes

The design system employs a balanced `2` (Rounded) geometry, balancing tailored luxury with modern digital ergonomics.

- **Standard Elements:** Form controls, action buttons, cards, and modal sheets use `0.5rem` (`rounded`) corner radii.
- **Containers & Overlays:** Large collection cards and banner features scale to `1rem` (`rounded-lg`) and `1.5rem` (`rounded-xl`).
- **Badges & Micro-Pills:** Status indicators, quantity incrementors, and subtle filter chips may adopt full pill curvature (`rounded-full`) to complement the geometry of `Plus Jakarta Sans`.

## Components

### Buttons
- **Primary:** Solid warm espresso (`#2D2A26`) background with warm-white (`#FAF8F5`) text. Corner radius `0.5rem`. Smooth hover transition to `#423E39`.
- **Secondary / Ghost:** Outlined in 1px `#2D2A26` or `#EFECE6` with transparent background; text in `#2D2A26`. On hover, fills with `#F4EFEB`.
- **Tertiary Accent:** Reserved for conscious or editorial initiatives, utilizing `#6B7B6E` fill or text styling.

### Input Fields & Controls
- **Inputs:** Clean white background (`#FFFFFF`) with a 1px border of `#EFECE6`. Label set in `label-sm` above the field. Focused state shifts the border to `#9E8F7D` with zero harsh outer rings.
- **Checkboxes & Radios:** Minimalist square (`0.25rem` radius) or circular controls in `#FAF8F5` with `#9E8F7D` active fills and crisp white checks.

### Chips & Filters
- **Filter Chips:** Light champagne surface (`#F4EFEB`) with `#2D2A26` typography. Selected states take on an oatmeal wash (`#9E8F7D`) with white text and a clean dismiss icon.

### Product & Editorial Cards
- **Product Cards:** Crisp `#FFFFFF` surface with zero outer borders or an ultra-subtle `#EFECE6` hairline border. Imagery features soft warm padding. Price displays utilize `body-md` in semi-bold `#1A1817`.
- **Editorial Cards:** Asymmetrical typography overlay with `Playfair Display` headlines overlapping curated photography, set against oatmeal or champagne backdrop bands.

### Lists & Navigation
- **Navigation Menus:** Generous vertical padding (`space-md`) with bottom dividers in `#EFECE6`. Hover states highlight subtly with an underline or warm taupe dot.
- **Cart & Bag Drawers:** Clean white slide-overs with tactile summary rows, micro-shadow elevations, and direct primary CTA buttons.