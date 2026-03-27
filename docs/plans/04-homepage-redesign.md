---
title: Homepage Redesign — "The Armored Obsidian"
date: 2026-03-27
---

# Plan: Homepage Redesign — "The Armored Obsidian"

Redesign the homepage to implement the "Armored Obsidian" design system — dark-themed, premium layout with a shared header, bold hero section, searchable course grid, CTA banner, and global footer.

---

## Goal

A visitor lands on the homepage and immediately experiences a premium, dark-themed learning platform with the "Armored Obsidian" design language — completing with a sticky header, hero section with live stats, searchable course grid, marketing CTA banner, and a full global footer — without any authentication logic.

---

## User Flow

1. Visitor arrives at `/` — sees sticky dark navbar with logo and primary nav links
2. Hero section loads with bold headline, supporting subtext, and two stat badges (active courses + engineers)
3. Visitor scrolls to "Available Learning Paths" — sees course grid with search bar
4. Visitor types a keyword in the search bar — course grid filters client-side in real time
5. Visitor clicks a course card — navigates to the course detail page (`/courses/[courseId]`)
6. Visitor sees a full-width CTA banner below the grid with a prominent call-to-action button
7. Visitor reaches the footer — finds link columns (Tracks, Academy, Social), logo, tagline, and copyright

---

## Non-functional Requirements

- [ ] **Performance**: Fonts (Space Grotesk, Inter) loaded via `next/font` to avoid layout shift; course data fetched server-side via Server Component
- [ ] **Responsiveness**: Layout adapts from 1 → 2 → 3 columns across mobile / tablet / desktop breakpoints
- [ ] **Accessibility**: All interactive elements have accessible labels; search input is keyboard-navigable
- [ ] **TypeScript**: `strict: true` — no `any` types anywhere in new components
- [ ] **Security**: No auth logic introduced; no secrets exposed to client

---

## Scope

- [ ] `apps/web/` — Frontend only (Next.js 14 · App Router · Atomic Design)

> No backend changes. The homepage continues to consume the existing `/courses` endpoint.

---

## Architecture

### Design Token Update

Update `tailwind.config.ts` to replace the existing `brand` blue palette with the Armored Obsidian token set and register font families:

| Token                   | Value         |
| ----------------------- | ------------- |
| `surface`               | `#131317`     |
| `surface-container-low` | `#1b1b1f`     |
| `surface-bright`        | `#39393d`     |
| `primary`               | `#ffb3ae`     |
| `primary-container`     | `#d31027`     |
| `on-secondary`          | `#621009`     |
| Font: `display`         | Space Grotesk |
| Font: `body`            | Inter         |

### Component Map (Atomic Design)

```
components/
  atoms/
    StatBadge/            glass panel — large number + label
  molecules/
    CourseCard/           title, description, tags, level, duration, rating, thumbnail
    SearchBar/            dark input + search icon + filter icon button
  organisms/
    Header/               logo, nav links, right icon cluster — sticky, dark surface
    HeroSection/          chip label, display headline, subtext, StatBadge pair
    AvailableLearningPaths/  section title + SearchBar + responsive course grid
    CTABanner/            full-width marketing strip with headline + CTA button
    Footer/               three link columns + logo/tagline + copyright bar
```

### Route Changes

```
app/
  layout.tsx              ← add <Header /> and <Footer /> (server components)
  page.tsx                ← refactor: compose HeroSection → AvailableLearningPaths → CTABanner
  loading.tsx             ← skeleton placeholder (keep or update)
  error.tsx               ← keep existing
```

### API Endpoints Used

| Method | Path       | Auth | Description                             |
| ------ | ---------- | ---- | --------------------------------------- |
| GET    | `/courses` | None | Fetch all courses for the homepage grid |

### Schema Changes

None — no database migrations required.

---

## Tasks

### Phase 1 — Design Token & Font Setup

- [ ] Update `tailwind.config.ts`: replace `brand` blue palette with Armored Obsidian tokens (`surface`, `surface-container-low`, `surface-bright`, `primary`, `primary-container`, `on-secondary`)
- [ ] Add `display` (Space Grotesk) and `body` (Inter) font families via `next/font/google` in `app/layout.tsx`
- [ ] Verify no existing components break visually after token rename (update any hardcoded `brand-*` class usages)

### Phase 2 — Atoms

- [ ] `components/atoms/StatBadge/StatBadge.tsx` — props: `value: string | number`, `label: string`; glassmorphism panel (`backdrop-blur`, `bg-white/8`, "Armored Edge" inset shadow)
- [ ] `components/atoms/StatBadge/StatBadge.spec.tsx` — when value and label supplied, expect both rendered; when value is 0, expect "0" rendered
- [ ] `components/atoms/StatBadge/index.ts` — barrel export
- [ ] Update `components/atoms/index.ts` to include `StatBadge`

### Phase 3 — Molecules

- [ ] `components/molecules/CourseCard/CourseCard.tsx` — props: `title`, `description`, `tags: string[]`, `href: string`, optional `level`, `duration`, `rating`, `thumbnailUrl`; `xl` border-radius; `surface-container-low` bg; tags as `Badge` atoms; gradient thumbnail fallback
- [ ] `components/molecules/CourseCard/CourseCard.spec.tsx` — when all props provided, expect title/description/tags/rating rendered; when optional props omitted, expect no crash; when href set, expect link points to correct URL
- [ ] `components/molecules/CourseCard/index.ts`
- [ ] `components/molecules/SearchBar/SearchBar.tsx` — props: `value: string`, `onChange: (v: string) => void`, `onFilter?: () => void`; dark-styled input with search icon; red inner-glow on focus; filter icon button
- [ ] `components/molecules/SearchBar/SearchBar.spec.tsx` — when user types, expect onChange called with value; when filter button clicked, expect onFilter called
- [ ] `components/molecules/SearchBar/index.ts`
- [ ] Update `components/molecules/index.ts`

### Phase 4 — Organisms

- [ ] `components/organisms/Header/Header.tsx` — logo text/SVG, nav links (Explore, My Learning, Mentors, Resources), right icon cluster (cart, notifications, avatar — static placeholders); sticky; dark `surface` bg; no border-bottom ("No-Line Rule")
- [ ] `components/organisms/Header/Header.spec.tsx` — when rendered, expect all nav link labels present; when rendered, expect logo text visible
- [ ] `components/organisms/Header/index.ts`
- [ ] `components/organisms/HeroSection/HeroSection.tsx` — category chip, `display-lg` two-line headline (Space Grotesk), subtext, two `StatBadge` components; radial gradient ambient glow from `primary-container` to `surface`; props: `activeCourseCount: number`, `engineerCount: number`
- [ ] `components/organisms/HeroSection/HeroSection.spec.tsx` — when counts provided, expect stat values rendered; when rendered, expect headline text present
- [ ] `components/organisms/HeroSection/index.ts`
- [ ] `components/organisms/AvailableLearningPaths/AvailableLearningPaths.tsx` — `'use client'`; props: `courses: CourseCardProps[]`; section title + `SearchBar` + responsive 1→2→3-col grid; client-side keyword filter by title/tag
- [ ] `components/organisms/AvailableLearningPaths/AvailableLearningPaths.spec.tsx` — when courses prop provided, expect all cards rendered; when search query matches title, expect only matching cards shown; when search query matches nothing, expect empty state shown
- [ ] `components/organisms/AvailableLearningPaths/index.ts`
- [ ] `components/organisms/CTABanner/CTABanner.tsx` — full-width strip; headline, body text, gradient CTA button (45° `primary-container` → `on-secondary`); deep red tonal bg; purely presentational
- [ ] `components/organisms/CTABanner/CTABanner.spec.tsx` — when rendered, expect headline, body text, and CTA button label present
- [ ] `components/organisms/CTABanner/index.ts`
- [ ] `components/organisms/Footer/Footer.tsx` — three link columns (Tracks, Academy, Social); left column with logo + tagline; bottom bar with copyright + Privacy Policy + Terms of Service links
- [ ] `components/organisms/Footer/Footer.spec.tsx` — when rendered, expect all column link labels present; when rendered, expect copyright text present
- [ ] `components/organisms/Footer/index.ts`
- [ ] Update `components/organisms/index.ts`

### Phase 5 — Page Composition & Layout

- [ ] Update `app/layout.tsx`: import and render `<Header />` above and `<Footer />` below `{children}`; add `next/font` font variables to `<html>` className
- [ ] Refactor `app/page.tsx` (Server Component): fetch courses from `/courses` API server-side; pass data to `<AvailableLearningPaths>`; compose `<HeroSection>` → `<AvailableLearningPaths>` → `<CTABanner>`; remove old inline header and raw course loop
- [ ] Update `app/loading.tsx` with a skeleton that matches the new layout (hero skeleton + grid skeletons)
- [ ] Verify `app/error.tsx` still renders correctly within the new layout

### Phase 6 — Stats Data Wiring

- [ ] Fetch real course count from `/courses` API in `app/page.tsx` and pass to `HeroSection` as `activeCourseCount`
- [ ] Add `NEXT_PUBLIC_ENGINEER_COUNT` env variable (fallback `0`) for the engineer stat badge; document in `.env.example`

---

## Open Questions

1. Should the `Header` nav links be active-state aware (highlight current route) in this phase, or plain links only?
2. Should the empty-state in `AvailableLearningPaths` show a specific illustration/icon, or just a text message?
3. What exact copy should be used for the CTA banner headline and body text — "Course Marketplace" brand equivalent of the "Aether Academy" design screenshot?
4. Should stat badges show loading skeletons while the server fetches the course count, or is a static fallback (`0`) acceptable?
