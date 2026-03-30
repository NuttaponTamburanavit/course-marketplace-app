# PRD: Homepage Redesign — "The Armored Obsidian"

## Problem Statement

The current homepage of the Course Marketplace provides no visual identity, no branding, and no meaningful user experience beyond a raw list of courses. It uses an inline header that is not shared across routes, has no footer, no hero section, and no marketing content to communicate the platform's value. The color palette (plain blue) and layout (white card grid on grey background) feel generic and do not reflect the premium, high-tech design system defined in `docs/DESIGN.md`. As a result, the platform fails to make a strong first impression, establish trust, or guide visitors toward enrollment.

## Solution

Redesign the homepage to fully implement the **"Armored Obsidian"** design system described in `docs/design/DESIGN.md` and `docs/design/screen.png`. The new homepage will include a dark-themed, premium layout with:

- A shared global navigation header with the platform logo and primary nav links.
- A bold hero section with a headline, subtext, and live stats badges.
- A "Available Learning Paths" section with a course grid and inline search.
- A full-bleed marketing CTA banner encouraging subscription.
- A global footer with navigation columns and social links.

The redesign applies the design token palette (obsidian surfaces, surgical red accents, glassmorphism panels) and typography system (Space Grotesk + Inter) specified in `docs/design/DESIGN.md` and `docs/design/screen.png`. No authentication logic is in scope for this phase.

## User Stories

1. As a visitor, I want to see a visually striking homepage, so that I immediately understand this is a premium learning platform.
2. As a visitor, I want to see the platform logo and name prominently in the navigation bar, so that I know which platform I am on.
3. As a visitor, I want to navigate to key sections (Explore, My Learning, Mentors, Resources) from the top navbar, so that I can quickly find what I need.
4. As a visitor, I want to see a compelling headline in the hero section, so that I understand the platform's value proposition at a glance.
5. As a visitor, I want to see supporting subtext below the headline, so that I get more detail about what the platform offers.
6. As a visitor, I want to see stats badges (e.g., number of active courses and total engineers) in the hero section, so that I feel confident in the platform's scale and credibility.
7. As a visitor, I want to see a section titled "Available Learning Paths", so that I know where to find courses.
8. As a visitor, I want to search for courses by keyword from the learning paths section, so that I can quickly find a course relevant to my interests.
9. As a visitor, I want to filter course results, so that I can narrow down options by relevant criteria.
10. As a visitor, I want to see course cards with a thumbnail image, so that I can visually identify each course.
11. As a visitor, I want to see category/tag badges on course cards (e.g., "NEW", "BACKEND", "TYPE-SAFETY"), so that I can understand what type of content each course covers.
12. As a visitor, I want to see the course title and a short description on each card, so that I can quickly assess whether a course is relevant.
13. As a visitor, I want to see the course level or duration on each card, so that I can assess the time and skill commitment required.
14. As a visitor, I want to see a course rating on each card where available, so that I can judge course quality.
15. As a visitor, I want to click on a course card to go to the course detail page, so that I can read more and decide whether to enroll.
16. As a visitor, I want to see a full-width CTA banner below the course grid, so that I am invited to explore a subscription or premium membership.
17. As a visitor, I want the CTA banner to display a headline and a short description of the offer, so that I understand the value before clicking.
18. As a visitor, I want to see a prominent CTA button in the banner, so that I can take action immediately.
19. As a visitor, I want to see a site-wide footer with organized link columns (Tracks, Academy, Social), so that I can navigate to secondary pages from any point on the page.
20. As a visitor, I want to see the platform logo and tagline in the footer, so that the brand identity is reinforced.
21. As a visitor, I want to see social media links in the footer, so that I can follow the platform on external channels.
22. As a visitor, I want to see a copyright notice at the bottom of the footer, so that I know the content is owned and maintained.
23. As a visitor, I want the entire page to use the dark obsidian color palette with red accents, so that the premium brand feel is consistent throughout.
24. As a visitor, I want the typography to use Space Grotesk for headlines and Inter for body text, so that the page has a precise, high-tech editorial tone.
25. As a visitor, I want course card category tags to use the "Data Badge" accent style from the design system, so that they look like status indicators consistent with the brand.
26. As a visitor using a mobile device, I want the layout to be responsive, so that I can comfortably browse on any screen size.
27. As a visitor, I want the navbar to be sticky or accessible at the top of the page as I scroll, so that I can always navigate without scrolling back up.

## Implementation Decisions

### Design Tokens — Tailwind Config Update

- Replace the existing `brand` color palette (blue) with the obsidian/red token set from DESIGN.md.
- Add tokens for: `surface` (#131317), `surface-container-low` (#1b1b1f), `surface-bright` (#39393d), `primary` (#ffb3ae), `primary-container` (#d31027), `on-secondary` (#621009).
- Add Space Grotesk and Inter as font families in the Tailwind config.

### Shared Header Component (Organism)

- New reusable `Header` organism component, registered in `app/layout.tsx` so it appears on all pages.
- Contains: logo (text or SVG), primary nav links (Explore, My Learning, Mentors, Resources), right-side icon cluster (cart, notifications, avatar — rendered as static/placeholder icons in this phase; no auth logic).
- Sticky positioning; dark surface background with the "no-line" rule (tonal separation, no border-bottom).

### Hero Section Component (Organism)

- A new `HeroSection` organism for the homepage only.
- Contains: a small category chip label, a large two-line display headline using `display-lg` (Space Grotesk), supporting subtext, and two stat badges using the "Data Badge" component pattern.
- Background uses a deep radial gradient from `primary-container` (#d31027) fading to `surface` (#131317) as a subtle ambient glow on the left side.

### StatBadge Component (Atom)

- Small glass panel showing a large number and a label (e.g., "42 / ACTIVE COURSES").
- Uses glassmorphism: `backdrop-filter: blur(15px)`, `on_surface` at 8% opacity background, and the "Armored Edge" inset box-shadow.

### CourseCard Component (Molecule)

- Extracted from inline homepage code into a reusable molecule `CourseCard`.
- Props: `title`, `description`, `tags: string[]`, `level?: string`, `duration?: string`, `rating?: number`, `thumbnailUrl?: string`, `href: string`.
- Uses `xl` border radius (1.5rem), `surface-container-low` background, tinted ambient shadow.
- Tags rendered as `Badge` atoms with the Data Badge variant.
- Thumbnail area is an `aspect-video` block; falls back to a gradient placeholder if no image is provided.

### SearchBar Component (Molecule)

- New molecule: a dark-styled text input with a search icon and an adjacent filter icon button.
- Uses `surface-container-low` background; on focus, applies red inner glow on the bottom edge (per Input Field spec in DESIGN.md).
- Accepts `value`, `onChange`, and `onFilter` callback props.

### AvailableLearningPaths Section (Organism)

- Wraps the section title, SearchBar, and a responsive course grid (1 → 2 → 3 columns).
- Client Component (`'use client'`) only for the search input state; the course grid data is passed as server-fetched props.
- Filtering/search is client-side for this phase (filters the prop array by title/tag keyword).

### CTABanner Component (Organism)

- Full-width marketing strip with: headline, body text, and a primary CTA button.
- Uses the gradient CTA button style (linear-gradient from `primary-container` to `on-secondary` at 45°).
- Static/presentational — no subscription logic wired in this phase.
- Background uses a deep red tonal variant to contrast with the page's obsidian base.

### Footer Component (Organism)

- New `Footer` organism added to `app/layout.tsx`.
- Three link columns: Tracks (Front-end, Distributed Systems, AI & ML), Academy (Pricing, Enterprise, Hall of Fame), Social (X/Twitter, GitHub, YouTube).
- Left column: logo + tagline text.
- Bottom bar: copyright line + Privacy Policy and Terms of Service links (static).

### Homepage Page (`app/page.tsx`) Refactor

- Replace the inline header and inline course card loop with the new shared components.
- Compose: `HeroSection` → `AvailableLearningPaths` → `CTABanner`.
- Server Component at the page level; only `AvailableLearningPaths` contains a Client boundary for search state.

### Barrel Exports

- Each new component follows the existing folder convention: `ComponentName/ComponentName.tsx` + `index.ts`.

## Testing Decisions

**What makes a good test:** Tests should verify external behavior visible to the user or consumer — rendered output, prop-driven rendering, interaction callbacks — not internal implementation details like CSS class names or internal state variable names.

### Modules to be tested:

- **`CourseCard`** — unit test: renders title, description, tags, duration, rating when all props provided; renders without crashing when optional props are omitted; href points to the correct course URL.
- **`StatBadge`** — unit test: renders the number and label correctly.
- **`SearchBar`** — unit test: calls `onChange` with the typed value; calls `onFilter` when filter button is clicked.
- **`AvailableLearningPaths`** — unit test: renders all passed courses; filters the list when a search query matches a course title; shows no results state when nothing matches.
- **`CTABanner`** — unit test: renders headline, body text, and the CTA button label.
- **`Footer`** — unit test: renders all link columns with expected link labels; renders the copyright text.
- **`Header`** — unit test: renders all navigation link labels; renders the logo text.

Prior art for tests: the existing atomic components (`Button`, `Badge`, `Input`) in `components/atoms/` follow the same Jest + React Testing Library pattern and serve as reference implementations.

## Out of Scope

- User authentication, login/logout, or session-aware navbar states.
- Subscription or membership purchase flow from the CTA banner.
- Course filtering beyond keyword search (e.g., category filter dropdowns, price range, level filter).
- Dark/light mode toggle (the design system is dark-only for this phase).
- Animations or scroll-triggered effects beyond standard CSS transitions.
- Storybook stories for new components.
- Any changes to the checkout flow, course detail page, or payment components.
- Backend API changes; the homepage continues to consume the existing `/courses` endpoint.

## Further Notes

- The design screenshot uses "Aether Academy" branding. For this project, all copy should use the existing "Course Marketplace" brand identity (name, tagline, and stats should reflect real data from the platform).
- The stats badges (e.g., "42 Active Courses", "12k Engineers") should be driven by real API data where possible, or configurable via environment variables as a fallback for static deployment.
- The "No-Line Rule" from DESIGN.md is critical: section separators must use tonal surface shifts, never 1px borders.
- Font loading: Space Grotesk and Inter should be loaded via `next/font` (Google Fonts integration) to avoid layout shift.
- All new components must be authored with `strict: true` TypeScript — no `any` types.
