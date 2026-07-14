---
name: Tierra y Canela
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#56423d'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#89726c'
  outline-variant: '#dcc0ba'
  surface-tint: '#9d422b'
  primary: '#9a4028'
  on-primary: '#ffffff'
  primary-container: '#b9573e'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a2'
  secondary: '#006972'
  on-secondary: '#ffffff'
  secondary-container: '#9ff0fb'
  on-secondary-container: '#066f79'
  tertiary: '#8b4c11'
  on-tertiary: '#ffffff'
  tertiary-container: '#a96428'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#7e2b16'
  secondary-fixed: '#9ff0fb'
  secondary-fixed-dim: '#82d3de'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#004f56'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system embodies a cultural bridge between Colombia and the Levant, evoking a sense of warmth, hospitality, and generational wisdom. The brand personality is "The Global Matriarch"—authoritative yet nurturing, traditional but vibrant.

The aesthetic fuses **Modern Minimalism** with **Organic Tactility**. We avoid sterile digital surfaces in favor of subtle grain, soft shadows, and rhythmic patterns. The UI should feel like a well-loved cookbook: tactile, organized, and rich with sensory detail. Visual interest is driven by the tension between structured geometric patterns (Arabic influence) and fluid, hand-drawn organic shapes (Colombian influence).

**Emotional Response:** Inspired, hungry, welcomed, and grounded.

## Colors
The palette is a dialogue between the desert and the coast. 

- **Primary (Earthy Terracotta):** Used for key actions and branding. It represents the clay pots common to both cultures.
- **Secondary (Deep Turquoise):** Represents the Caribbean Sea and Mediterranean accents. Used for secondary actions and high-contrast emphasis.
- **Tertiary (Saffron Yellow):** Used for highlights, rating stars, and interactive states to bring energy.
- **Neutral (Suero Cream):** The foundational canvas. Never use pure white (#FFFFFF); use this warm, creamy neutral to soften the visual impact and provide a premium feel.
- **Text:** A deep charcoal-teal provides high readability without the harshness of pure black.

## Typography
Typography is the primary storyteller. **Libre Caslon Text** is used for all headlines to provide a sense of history and editorial sophistication. Its classic serifs echo traditional printing and calligraphy.

**Plus Jakarta Sans** provides a modern, soft counter-balance for functional text. Its open counters and rounded terminals maintain the approachable "friendly" vibe of the brand while ensuring high legibility for ingredient lists and cooking instructions.

- Use **display-lg** for recipe titles.
- Use **label-bold** for meta-data like "Prep Time" or "Difficulty Level."
- Maintain generous line heights for body text to improve readability in kitchen environments.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is centered on "The Breathing Canvas"—large margins and generous gutters that allow high-quality food photography to take center stage.

**Spacing Rhythm:**
- Use the **8px base unit** for all spatial relationships.
- **Section Spacing:** Use 64px or 80px between major content blocks to prevent visual clutter.
- **Content Grouping:** Use "stack-md" (16px) for related items like ingredients in a list, and "stack-lg" (32px) between instructions.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than heavy shadows. We use subtle shifts in background color (Suero Cream vs. a slightly darker shade) to define hierarchy.

**Shadow Strategy:** 
When elevation is required (e.g., for floating action buttons or recipe cards), use **Ambient Shadows**. These are low-opacity (8-12%), highly diffused shadows with a slight Terracotta (#C25E44) tint to maintain warmth. Avoid cold, gray shadows.

**Layering:**
- **Level 0 (Base):** Creamy White (#FDFCF8) background.
- **Level 1 (Cards):** Surface with a 1px soft Terracotta border (10% opacity) or a very subtle 4px blur shadow.
- **Level 2 (Overlays):** Modals use a backdrop blur (12px) to keep the user grounded in the "kitchen" context while focusing on the specific task.

## Shapes
The shape language is "Rounded-Organic." We avoid harsh 90-degree angles to maintain a soft, welcoming feel.

**Specific Applications:**
- **Standard UI Elements:** Use the `rounded` (0.5rem) token for input fields and small buttons.
- **Recipe Cards:** Use `rounded-lg` (1rem) to create a distinct, friendly container.
- **Hero Images:** Apply `rounded-xl` (1.5rem) or use asymmetrical organic masks (blob-like shapes) to mimic handmade ceramics.
- **Icons:** Icons should have rounded caps and corners, never sharp points.

## Components
Consistent styling across components reinforces the "Tierra y Canela" aesthetic.

- **Buttons:** Primary buttons are Solid Terracotta with Cream text. Secondary buttons are Deep Turquoise outlines. Always use `rounded-lg` for a more "clickable" and modern feel.
- **Cards:** Recipe cards should feature a full-bleed image at the top with a `rounded-lg` clipping mask. The text area below uses a subtle 1px border in a lightened version of the primary color.
- **Chips:** Used for dietary labels (e.g., "Vegan," "Spicy"). Use the Saffron color with a 10% opacity background and solid text for a "sun-drenched" look.
- **Input Fields:** Use a 1px border in Terracotta. On focus, the border thickens to 2px and gains a soft glow. The background remains the neutral Suero Cream.
- **Lists:** Ingredient lists should use custom bullet points—either a small geometric star (Arabic) or a stylized weave pattern (Sombrero Vueltiao).
- **Patterns:** Apply a subtle, low-opacity (3-5%) repeating geometric pattern to the main page background or as a header decorative element to evoke a sense of craft and heritage.