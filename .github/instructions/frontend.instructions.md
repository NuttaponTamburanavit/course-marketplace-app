---
description: "Use when creating or editing React components, Next.js pages, layouts, Server Components, Client Components, or any UI code. Covers Atomic Design structure, Next.js App Router patterns, and performance."
applyTo: "apps/web/**/*.{ts,tsx}"
---

# Frontend Guidelines — Next.js + Atomic Design

## Atomic Design Structure

Organize all UI components under `components/`:

```
components/
  atoms/        # Smallest building blocks: Button, Input, Icon, Badge, Spinner
  molecules/    # Combinations of atoms: SearchBar, FormField, CourseCard
  organisms/    # Complex sections: Header, CourseGrid, CheckoutForm, Sidebar
  templates/    # Page layouts without real data: DashboardTemplate, AuthLayout
app/          # Next.js App Router components: pages, layouts, route handlers
hooks/        # Reusable React hooks: useAuth, useFetch, useForm
utils/        # UI utilities: cn(), formatDate(), calculateDiscount()
api/          # API client code: apiClient.ts, courseApi.ts, userApi.ts
reducers/      # UI state reducers: cartReducer.ts, filterReducer.ts
```

- Each component lives in its own folder: `atoms/Button/Button.tsx`, `atoms/Button/index.ts`
- Co-locate styles, tests, and stories in the same folder
- Atoms and molecules must be stateless and reusable — no business logic

## Next.js App Router Rules

- Use **App Router** (`app/` directory) — never Pages Router
- **Default to Server Components**; add `'use client'` only when the component requires:
  - Browser APIs (`window`, `localStorage`, event listeners)
  - React hooks (`useState`, `useEffect`, `useRef`)
  - Third-party libraries that require client context
- Co-locate page-specific components inside the route folder; shared components go in `components/`
- Always provide `loading.tsx`, `error.tsx`, and `not-found.tsx` for each route segment
- Use **Route Handlers** (`route.ts`) for API endpoints within the Next.js app

## Data Fetching

- Fetch data in **Server Components** using `async/await` directly — no `useEffect` for data
- Use `fetch` with Next.js cache options (`cache: 'force-cache'`, `next: { revalidate: n }`) for static or ISR data
- For mutations, use **Server Actions** (`'use server'`) rather than client-side API calls where possible

## State Management

- Prefer server state in Server Components over client state stores
- For shared client UI state, use **Zustand** with small, focused slices
- For local component state, use `useState` / `useReducer`
- Never fetch data client-side when it can be fetched server-side

## Styling

- Use **Tailwind CSS** utility classes for all styling
- Use `cn()` (clsx + tailwind-merge) for conditional and merged class names
- No inline `style` props unless for truly dynamic values (e.g., CSS variables)
- No CSS Modules unless intentionally isolated (e.g., third-party overrides)

## Barrel Style Usage

To keep imports clean, each component directory uses an index.ts file. This allows consumers to import from the folder level rather than deep-nesting into specific files.

### Example Folder Structure (scormPlayer):

```
src/components/organisms/scormPlayer/
├── scormPlayer.tsx             # Main component logic
├── scormPlayer.module.css      # Scoped styles
├── scormPlayer.stories.tsx     # Storybook documentation
├── scormPlayer.spec.tsx        # Unit/Integration tests
└── index.ts                    # Barrel export
```

### Implementation Example:
```
// 1. scormPlayer.tsx
import styles from './scormPlayer.module.css';
export const ScormPlayer = () => <div className={styles.container}>...</div>;

// 2. index.ts (Barrel)
export \* from './ScormPlayer';

// 3. Consumer usage (app/page.tsx)
import { ScormPlayer } from '@/components/organisms';
```

### Supporting Files:
- .stories.tsx: Used for isolated UI testing and documentation via Storybook.
- .spec.tsx or .test.tsx: Contains unit tests (Vitest/Jest) ensuring component reliability.
- .module.css: CSS Modules for local scoping, preventing class name collisions.

## Performance

- Use `next/image` for all images; set explicit `width` and `height`
- Use `next/link` for all internal navigation
- Use `next/dynamic` with `{ ssr: false }` for large client-only components
- Apply `React.memo`, `useMemo`, and `useCallback` only when profiling confirms a bottleneck — not preemptively
- Avoid unnecessary `'use client'` boundaries that push rendering to the browser
