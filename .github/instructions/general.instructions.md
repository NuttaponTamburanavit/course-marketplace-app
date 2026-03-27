---
description: "Use when writing TypeScript code, installing packages, configuring linting, or following general project conventions in this pnpm monorepo."
applyTo: "**/*.{ts,tsx}"
---

# General Project Conventions

## Package Manager

- Always use `pnpm` (`pnpm add`, `pnpm install`, `pnpm run`)
- Never use `npm` or `yarn`
- Workspace packages are referenced as `workspace:*` in `package.json`

## TypeScript

- Enable `strict: true` in all `tsconfig.json` files
- Never use `any` — use `unknown` with type guards or define proper types
- Prefer `interface` for object shapes, `type` for unions, intersections, and mapped types
- Use explicit return types on all exported functions and class methods
- Use `readonly` for properties that should not be mutated after construction

## Linting & Formatting

- Use **Biome** for linting and formatting — never add ESLint or Prettier
- Run `pnpm biome check --write` to auto-fix; resolve all remaining errors before committing
- Biome config lives at the monorepo root `biome.json`

## Naming Conventions

| Kind               | Convention                 | Example                         |
| ------------------ | -------------------------- | ------------------------------- |
| Directories        | `kebab-case`               | `use-cases/`                    |
| Files              | `kebab-case`               | `apply-discount.ts`             |
| Components         | `PascalCase`               | `CourseCard.tsx`                |
| Hooks              | `camelCase` prefixed `use` | `useEnrollment.ts`              |
| Utilities          | `camelCase`                | `formatPrice.ts`                |
| Constants          | `SCREAMING_SNAKE_CASE`     | `MAX_ENROLLMENTS`               |
| Types & Interfaces | `PascalCase`               | `CourseEntity`, `EnrollmentDto` |

## Security Baseline

- Never hardcode secrets, tokens, or credentials — use environment variables
- Sanitize and validate all user input at system boundaries (HTTP layer, form handlers)
- Use parameterized queries — never concatenate user input into SQL or shell commands
- Never expose internal error details or stack traces to end users
