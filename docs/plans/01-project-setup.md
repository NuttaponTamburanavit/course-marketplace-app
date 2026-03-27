# Plan: Initial Project Setup

> Status: In Progress  
> Target: Monorepo root · Frontend (`apps/web`) · Backend (`apps/api`)

---

## Overview

Bootstrap the full-stack course-marketplace monorepo so that both apps can be developed, tested, and run locally in a consistent, reproducible environment.

---

## Phase 1 — Monorepo Root

### 1.1 pnpm Workspace

- [x] Create `pnpm-workspace.yaml` declaring `apps/*` and `packages/*`
- [x] Create root `package.json` with:
  - `"private": true`
  - `engines.node` pinned to LTS (≥ 20)
  - `engines.pnpm` pinned (≥ 9)
  - Workspace scripts: `dev`, `build`, `test`, `lint`, `format`
- [x] Create `.npmrc` with `shamefully-hoist=false` and `strict-peer-dependencies=false`
- [x] Run `pnpm install` to generate `pnpm-lock.yaml`

### 1.2 TypeScript Root Config

- [x] Create root `tsconfig.base.json`:
  - `"strict": true`
  - `"target": "ES2022"`
  - `"moduleResolution": "bundler"`
  - `"noUncheckedIndexedAccess": true`
  - Path alias `@/*` — defined per-app (each app overrides individually ✓)

### 1.3 Biome (Linter + Formatter)

- [x] `pnpm add -D -w @biomejs/biome`
- [x] Create root `biome.json`:
  - Formatter: tab width 2, single quotes, trailing commas `"all"`
  - Linter: recommended rules enabled; `noExplicitAny` set to `"error"`
  - Organise imports enabled
- [x] Add `.editorconfig` for editor parity

### 1.4 Git Hygiene

- [x] Create `.gitignore`:
  - `node_modules/`, `.next/`, `dist/`, `build/`
  - `.env`, `.env.local`, `.env.*.local`
  - `*.log`, `.DS_Store`
- [x] Add root `.env.example` documenting every required variable (no real values)

### 1.5 Docker Compose (Local Dev)

- [x] Create `docker-compose.yml` with services:
  - `postgres` — `postgres:16-alpine`, port `5432`, named volume
  - `redis` — `redis:7-alpine`, port `6379`
- [x] Create `docker-compose.override.yml.example` for developer-specific overrides

---

## Phase 2 — Backend (`apps/api`)

### 2.1 NestJS Scaffold

- [x] `pnpm dlx @nestjs/cli new api --package-manager pnpm --directory apps/api --skip-git`
- [x] Remove default `apps/api/.eslintrc.js` and `apps/api/.prettierrc`
- [x] Extend root `tsconfig.base.json` from `apps/api/tsconfig.json`

### 2.2 Core Dependencies

```
pnpm add --filter api \
  @nestjs/config @nestjs/throttler \
  typeorm @nestjs/typeorm pg \
  nestjs-zod zod \
  helmet ioredis \
  @sendgrid/mail
```

```
pnpm add -D --filter api \
  @types/pg @types/node \
  @nestjs/testing jest ts-jest @types/jest
```

### 2.3 `main.ts` Global Setup

- [x] Register `ZodValidationPipe` globally
- [x] Register `HttpExceptionFilter` globally
- [x] Register `ResponseInterceptor<T>` wrapping responses as `{ data, meta? }`
- [x] Apply `helmet()` before all routes
- [x] Configure CORS restricted to `APP_URL` env variable

### 2.4 Config & Environment

- [x] Create `apps/api/src/config/` module with typed `ConfigService` wrappers
- [x] Define env schema via Zod in `apps/api/src/config/env.schema.ts`
- [x] Create `apps/api/.env.example` — document all required variables:
  - `DATABASE_URL`, `REDIS_URL`, `APP_URL`, `PORT`
  - `OMISE_PUBLIC_KEY`, `OMISE_SECRET_KEY`
  - `SENDGRID_API_KEY`, `EMAIL_FROM`

### 2.5 Database Setup

- [x] Configure TypeORM `DataSource` in `apps/api/data-source.ts` (used by CLI)
- [x] Add `apps/api/src/database/` module that imports TypeORM async with `ConfigService`
- [x] Add `migration:generate`, `migration:run`, `migration:revert` scripts to `apps/api/package.json`
- [x] Ensure `synchronize: false` is set in all environments

### 2.6 Clean Architecture Skeleton

Create placeholder feature scaffolding to enforce the four-layer pattern:

```
apps/api/src/
  <feature>/
    domain/
      entities/
      repositories/      ← interfaces only
      use-cases/
    infrastructure/
      repositories/      ← TypeORM implementations
      adapters/
    presentation/
      controllers/
      dto/
      guards/
      middleware/
    application/
      <feature>.module.ts
```

- [x] Create `apps/api/src/health/` module as the first concrete example

### 2.7 Rate Limiting

- [ ] Configure `@nestjs/throttler` with Redis store via `ioredis` ⚠️ currently uses in-memory store — Redis store not wired
- [x] Apply throttler guard globally in `AppModule`

### 2.8 API Documentation

- [x] Create `.bruno/` directory at monorepo root
- [x] Add a `Course Marketplace.bru` collection file
- [x] Commit `.bru` files alongside source — no Swagger/OpenAPI annotations required

---

## Phase 3 — Frontend (`apps/web`)

### 3.1 Next.js Scaffold

- [x] `pnpm dlx create-next-app@14 apps/web --typescript --tailwind --app --no-eslint --no-src-dir --import-alias "@/*"`
- [x] Remove `apps/web/.eslintrc.json` if generated
- [x] Extend root `tsconfig.base.json` from `apps/web/tsconfig.json`

### 3.2 Core Dependencies

```
pnpm add --filter web \
  zustand \
  clsx tailwind-merge \
  @omise/omise-js
```

```
pnpm add -D --filter web \
  vitest @vitejs/plugin-react \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  jsdom
```

### 3.3 Tailwind Configuration

- [x] Configure `tailwind.config.ts`:
  - Content paths: `./app/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`
  - Extend theme with brand colors and typography scale

### 3.4 Atomic Design Directory Structure

```
apps/web/
  app/                      ← Next.js App Router
    layout.tsx
    page.tsx                ← Home / course listing
    loading.tsx
    error.tsx
    not-found.tsx
  components/
    atoms/
    molecules/
    organisms/
    templates/
  hooks/
  utils/
    cn.ts                   ← clsx + tailwind-merge helper
  api/
    apiClient.ts
  reducers/
```

- [x] Create `cn.ts` utility: `export function cn(...inputs) { return twMerge(clsx(inputs)); }`
- [x] Create barrel `index.ts` for each component tier
- [x] Add `loading.tsx`, `error.tsx`, `not-found.tsx` at the root route segment

### 3.5 State Management

- [x] Create `apps/web/store/` with initial Zustand slice stubs:
  - `cartStore.ts` — selected course, coupon state
  - `checkoutStore.ts` — multi-step checkout step tracking

### 3.6 API Client

- [x] Create `apps/web/api/apiClient.ts` — typed `fetch` wrapper that reads `NEXT_PUBLIC_API_URL`
- [x] Add `NEXT_PUBLIC_API_URL` to `apps/web/.env.local.example`

### 3.7 Next.js Configuration

- [x] Configure `next.config.mjs`:
  - `images.remotePatterns` for CDN domain
  - Strict mode enabled

---

## Phase 4 — Testing Infrastructure

### 4.1 Backend (Jest)

- [ ] Configure `apps/api/jest.config.ts` with `ts-jest` preset ❌ missing
- [ ] Add `jest.setup.ts` for global test setup ❌ missing
- [ ] Write smoke test: `GET /health` returns `200` with `{ data: { status: "ok" } }` ❌ existing e2e test hits `GET /` not `GET /health`

### 4.2 Frontend (Vitest)

- [x] Create `apps/web/vitest.config.ts` with `jsdom` environment and `@vitejs/plugin-react`
- [x] Add `apps/web/vitest.setup.ts` importing `@testing-library/jest-dom`
- [x] Write smoke test: render root `page.tsx` without throwing

---

## Phase 5 — CI Pipeline

- [x] Create `.github/workflows/ci.yml`:
  - Trigger: `push` and `pull_request` to `main`
  - Job `lint`: `pnpm biome check`
  - Job `test-api`: `pnpm --filter api test`
  - Job `test-web`: `pnpm --filter web test`
  - Job `build-api`: `pnpm --filter api build`
  - Job `build-web`: `pnpm --filter web build`
  - Cache `~/.pnpm-store` between runs
  - Node 20 + pnpm 9

---

## Acceptance Criteria

| Check                     | Command                           | Expected                               |
| ------------------------- | --------------------------------- | -------------------------------------- |
| Monorepo installs cleanly | `pnpm install`                    | Zero errors                            |
| Linter passes             | `pnpm biome check`                | No lint / format violations            |
| API starts                | `pnpm --filter api start:dev`     | Listening on configured port           |
| Frontend starts           | `pnpm --filter web dev`           | Next.js dev server at `localhost:3000` |
| API tests pass            | `pnpm --filter api test`          | All green                              |
| Frontend tests pass       | `pnpm --filter web test`          | All green                              |
| DB migrates               | `pnpm --filter api migration:run` | No errors                              |
| Docker Compose up         | `docker compose up -d`            | Postgres + Redis healthy               |

---

## Notes & Decisions

- **No `npm` / `yarn`** anywhere — `pnpm` only.
- **No ESLint / Prettier** — Biome handles both linting and formatting.
- **`synchronize: false`** in TypeORM — all schema changes via numbered migrations.
- **`'use client'`** only when browser APIs or React hooks are needed.
- **Domain layer** in `apps/api` must have zero NestJS imports.
- All monetary values stored as **satang (integer)** to avoid floating-point errors.
