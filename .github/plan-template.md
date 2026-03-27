---
title: [feature name]
date: [YYYY-MM-DD]
---

# Plan: <feature>

[One sentence: what this feature does and why.]

## Goal

[What success looks like — the measurable outcome when this feature is complete. E.g., "A user can enroll in a course and receive a confirmation email."]

## User Flow

[Step-by-step happy path from the user's perspective.]

1. User does X
2. System responds with Y
3. User sees Z

## Non-functional Requirements

- [ ] Performance: [e.g., "Page loads in under 2 seconds on mobile."]
- [ ] Security: [e.g., "Only authenticated users can access this feature. No sensitive data is exposed."]

## Scope

- [ ] `apps/api/` — Backend (NestJS · Clean Architecture)
- [ ] `apps/web/` — Frontend (Next.js · Atomic Design)

## Architecture

**Backend** — layers touched (`domain` → `infrastructure` → `presentation` → `application`):

- **Domain**: entity, repository interface, use case (`execute(input): Promise<output>`)
- **Infrastructure**: repository impl, migration `<timestamp>-<Description>.ts`
- **Presentation**: DTO (`class-validator` + `@ApiProperty`), controller, guard if needed
- **Application**: register providers in `<feature>.module.ts`

**Frontend** — Atomic Design layers touched:

- Components: atom / molecule / organism as needed
- Route: `apps/web/app/<route>/page.tsx` (Server Component by default)
- Add `loading.tsx`, `error.tsx` alongside the route

**API endpoints:**

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
|        |      |      |             |

**Schema changes:** [entity fields / indexes / migration needed Y/N]

## Tasks

- [ ] Domain: entity + repository interface + use case
- [ ] Infrastructure: repository impl + migration
- [ ] Presentation: DTOs + controller
- [ ] Application: module wiring
- [ ] Frontend: components + route + Server Actions
- [ ] Tests: unit (use cases + components), integration (repository), e2e (happy path)

## Open Questions

1.
2.
