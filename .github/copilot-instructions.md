# Course Marketplace — Copilot Workspace Instructions

This is a **pnpm monorepo** containing a course marketplace platform.

## Apps

| App      | Path        | Stack                                                         |
| -------- | ----------- | ------------------------------------------------------------- |
| Frontend | `apps/web/` | Next.js 14 · App Router · TypeScript · Tailwind CSS · Zustand |
| Backend  | `apps/api/` | NestJS · TypeScript · Clean Architecture                      |

## Detailed Instructions

Detailed, file-specific rules are in `.github/instructions/`. They are auto-loaded for matching files.

| File                       | Applies To                   | Covers                                                                     |
| -------------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| `general.instructions.md`  | All `*.ts`, `*.tsx`          | pnpm, TypeScript strict mode, Biome, naming conventions, security          |
| `frontend.instructions.md` | `apps/web/**`                | Atomic Design, App Router, Server/Client Components, Tailwind, performance |
| `backend.instructions.md`  | `apps/api/**`                | Clean Architecture layers, NestJS conventions, REST design, migrations     |
| `testing.instructions.md`  | `**/*.spec.*`, `**/*.test.*` | AAA pattern, when…expect naming, factory functions, mocking                |

## Non-Negotiable Rules

- **Package manager**: `pnpm` only — never `npm` or `yarn`
- **Linter/formatter**: Biome only — never ESLint or Prettier
- **TypeScript**: `strict: true`, never use `any`
- **Tests**: every exported function and component must have a test; AAA + when…expect naming
- **Frontend**: default to Server Components; `'use client'` only when strictly necessary
- **Backend**: domain layer must have zero framework dependencies; no business logic in controllers
- **Security**: no hardcoded secrets; validate all user input at system boundaries; parameterized queries only
- **Performance**: prefer server-side data fetching; use Tailwind for styling; avoid unnecessary client state and re-renders
