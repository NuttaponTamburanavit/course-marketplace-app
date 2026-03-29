# Design System Strategy: High-Tech Glassmorphism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Armored Obsidian."** 

This system moves away from the generic "web-template" aesthetic by embracing a high-tech, premium feeling inspired by tactical interfaces and luxury automotive HUDs. It leverages the contrast between deep, monochromatic obsidian surfaces and vibrant, high-energy reds. Instead of a flat grid, we use intentional asymmetry and overlapping glass layers to create a sense of mechanical depth. The UI should feel like a piece of finely engineered equipment—solid, precise, and sophisticated.

## 2. Colors
Our palette is rooted in a deep-sea obsidian base with surgical red accents.

*   **Primary Roles:** Use `primary` (#ffb3ae) and `primary_container` (#d31027) for high-impact interactions. These should feel like "active" glowing states.
*   **Surface Hierarchy:** Our "Deep Red" and "Grey" palette is expressed through `surface` (#131317) up to `surface_bright` (#39393d).
*   **The "No-Line" Rule:** Sectioning must never use 1px solid borders. Differentiate content by nesting a `surface_container_low` (#1b1b1f) element inside a `surface` (#131317) background. The transition of tone is the boundary.
*   **The "Glass & Gradient" Rule:** Floating panels must use Glassmorphism. Apply `backdrop-filter: blur(15px)` with a background of `on_surface` (#e4e1e7) at 5-10% opacity. 
*   **Signature Textures:** For primary CTAs, use a linear gradient from `primary_container` (#d31027) to `on_secondary` (#621009) at a 45-degree angle to create a "specular" metallic sheen.

## 3. Typography
The typography strategy creates a high-contrast editorial feel, blending the technical precision of **Space Grotesk** with the clean readability of **Inter**.

*   **Display & Headlines (Space Grotesk):** Use `display-lg` (3.5rem) and `headline-md` (1.75rem) for major anchors. Space Grotesk's geometric quirks provide the "high-tech" soul of the system.
*   **Body & Labels (Inter):** Use `body-md` (0.875rem) for all functional text. The neutral nature of Inter ensures that the UI remains legible even when placed over complex glass textures.
*   **Hierarchy:** Maintain a wide gap between headline and body sizes. Large, light-weight headlines (`headline-lg`) paired with small, tracked-out uppercase labels (`label-md`) create an authoritative, premium editorial rhythm.

## 4. Elevation & Depth
In this design system, depth is "armored"—it feels physical and layered.

*   **The Layering Principle:** Stack `surface-container` tiers to build importance. A `surface_container_highest` card sitting on a `surface_dim` background provides enough tonal contrast to eliminate the need for shadows in standard layouts.
*   **Ambient Shadows:** For high-priority floating elements, use a "Tinted Ambient Shadow." Instead of black, use `on_secondary_fixed_variant` (#81271c) at 8% opacity with a `40px` blur. This creates a subtle red "glow" beneath the glass, suggesting an internal power source.
*   **The "Armored" Edge:** To achieve the armored effect, use a `1px` inner glow (box-shadow: inset) using `outline_variant` (#5d3f3d) at 30% opacity. This mimics a beveled edge on a glass screen.
*   **The Ghost Border Fallback:** If containment is required for accessibility, use `outline` (#ad8885) at 15% opacity. Never use solid, high-contrast strokes.

## 5. Components

### Buttons
*   **Primary:** Solid gradient (`primary_container` to `secondary_container`) with white text. Border radius set to `md` (0.75rem).
*   **Secondary:** Glass-filled. Background `on_surface` at 10% opacity, `backdrop-filter: blur(15px)`.
*   **Tertiary:** Text-only using `primary` (#ffb3ae) with an uppercase `label-md` font style.

### Input Fields
*   **Styling:** Use `surface_container_low` as the base color. 
*   **States:** On focus, transition the background to `surface_container_high` and apply a `primary` (red) inner glow on the bottom edge only.

### Cards & Lists
*   **Construction:** Use `xl` (1.5rem) roundedness for large glass cards. 
*   **Spacing:** Use `spacing.8` (2.75rem) between cards to allow the background obsidian tones to breathe. 
*   **Dividers:** Strictly prohibited. Use a `spacing.4` (1.4rem) vertical gap or a subtle shift from `surface_container_low` to `surface_container_highest`.

### High-Tech Accents (Signature Component)
*   **Data Badges:** Small, `full` rounded chips using `on_error_container` background with `error` text. These should look like warning lights or status indicators on a cockpit display.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Let a headline sit 25% off-center to create a bespoke, custom-built feel.
*   **Do** use the Spacing Scale strictly. Premium design is defined by the intentionality of white space.
*   **Do** experiment with overlapping glass panels. The intersection of two blurred layers creates a beautiful, complex "frosted" depth.

### Don't:
*   **Don't** use 100% black (#000000). Always use the `surface` token (#131317) to maintain tonal richness.
*   **Don't** use standard drop shadows. They look "cheap" in a high-tech glass environment. Use tonal shifts or tinted glows instead.
*   **Don't** crowd the interface. If a screen feels "busy," increase the spacing between containers using `spacing.12` or `16`.