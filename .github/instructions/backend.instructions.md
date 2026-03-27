---
description: "Use when creating or editing NestJS modules, controllers, services, use cases, repositories, entities, DTOs, guards, or middleware. Covers Clean Architecture layer rules and domain boundaries."
applyTo: "apps/api/**/*.ts"
---

# Backend Guidelines — NestJS + Clean Architecture

## Tech Stack

| Concern       | Choice                          | Notes                                                                          |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| Framework     | NestJS                          | `nest new <app> --package-manager pnpm`                                        |
| Language      | TypeScript strict               | `strict: true`, zero `any`                                                     |
| ORM           | TypeORM + `pg`                  | PostgreSQL driver; typed `DataSource`                                          |
| Migrations    | TypeORM CLI                     | `data-source.ts` at project root; `pnpm migration:run`                         |
| Config        | `@nestjs/config`                | Typed `ConfigService`; all secrets from env                                    |
| Validation    | `zod` + `nestjs-zod`            | `ZodValidationPipe`; schemas defined as `z.object(...)` in `domain/` or `dto/` |
| API Docs      | Bruno                           | `.bru` collection files in `.bruno/`; no code annotations required             |
| Rate Limiting | `@nestjs/throttler` + `ioredis` | Redis-backed store; applied at route level                                     |
| Security      | `helmet`                        | Registered in `main.ts` before all routes                                      |
| Email         | `sendgrid`                      | Wrapped behind `EmailService` interface in domain                              |
| Testing       | Jest                            | Unit + integration; AAA pattern + when…expect naming                           |

**Global setup (registered in `main.ts`):**

- `ZodValidationPipe` (via `nestjs-zod`) — parses and validates all DTOs against Zod schemas
- `HttpExceptionFilter` — maps all exceptions to `{ statusCode, message }`
- `ResponseDto<T>` interceptor — wraps all success responses as `{ data, meta? }`
- `helmet()` + CORS restricted to `APP_URL` env var

## Layer Structure

Every domain feature must follow this four-layer structure:

```
src/
  <feature>/
    domain/                   # Pure business logic — zero framework dependencies
      entities/               # Domain models and value objects
      repositories/           # Repository interfaces (contracts only, no implementation)
      use-cases/              # Application use cases (one class per use case)
    infrastructure/           # External concerns: DB, third-party services, config
      repositories/           # Concrete TypeORM repository implementations
      adapters/               # Adapters for external services (payment, email, storage)
    presentation/             # HTTP layer: request in → response out
      controllers/
      dto/                    # Zod schemas used as request/response DTOs
      middleware/
      guards/
    application/              # NestJS DI wiring — no business logic here
      <feature>.module.ts
```

## Layer Rules (Dependency Direction)

- **Domain** must not import from infrastructure, presentation, or application
- **Use cases** depend only on domain interfaces — never on concrete implementations
- **Infrastructure** implements domain interfaces; imports ORMs, SDKs, and external libs
- **Presentation** handles HTTP only — delegates immediately to use cases; no business logic in controllers
- **Application** (module) wires providers; imports other modules; contains no logic

## Domain Layer

- Entities hold behavior and enforce invariants — don't make them anemic data bags
- Repository interfaces define the contract in domain terms (`CourseRepository`, not `TypeOrmCourseRepository`)
- Use cases are single-responsibility classes with an `execute(input): Promise<output>` method
- No NestJS decorators (`@Injectable`, `@Controller`) in `domain/`

## Presentation Layer

- Define request/response shapes as Zod schemas in `dto/`; infer TypeScript types with `z.infer<typeof Schema>`
- Use `ZodValidationPipe` (global) to parse incoming request bodies — invalid input throws a 400 automatically
- Return consistent HTTP responses using a shared `ResponseDto<T>` wrapper
- Handle errors in a global exception filter — controllers should not contain try/catch
- Use `@Roles()` guard for authorization — never check roles inside use cases or services
- Document API endpoints in Bruno (`.bruno/` collection); keep `.bru` files committed alongside source code

## Database Conventions

- Use migrations for all schema changes; never set `synchronize: true` in production
- Prefix migration filenames with a Unix timestamp: `1709000000000-AddCoursePriceColumn.ts`
- Use database transactions for multi-step write operations
- Define indexes on foreign key columns and any field used in `WHERE` or `ORDER BY` clauses
- Column names in `snake_case`; entity class names in `PascalCase`

## API Design

- Follow REST conventions: `GET /courses`, `POST /courses`, `PATCH /courses/:id`, `DELETE /courses/:id`
- Use plural nouns for resource endpoints
- Return `201 Created` for `POST`, `200 OK` for `GET`/`PATCH`, `204 No Content` for `DELETE`
- Paginate list endpoints; accept `page` and `limit` query params with sane defaults

## Security

- Validate and sanitize all user input at the presentation layer
- Never concatenate user input into SQL — use parameterized queries or ORM query builders
- Never expose stack traces, internal error messages, or sensitive data in API responses
- Store all secrets in environment variables; use a typed config service to access them
- Rate-limit authentication endpoints and any compute-heavy route
