---
title: Checkout & Payment — Backend
date: 2026-03-09
status: Not Started
---

# Plan: Checkout & Payment — Backend

Guest-mode checkout with PromptPay and Credit Card (Omise), coupon validation, tax-invoice capture, webhook processing, and JWT-based course access links.

---

## Goal

A guest user can create an order, apply an optional coupon, pay via PromptPay QR or Credit Card (3DS), receive a receipt email with a magic access link, and the system persists a complete tax-invoice record for admin processing.

---

## User Flow (System perspective)

1. Frontend `POST /api/orders` → system persists order at `created` + stores invoice info
2. Frontend `POST /api/coupons/validate` → system validates coupon and returns discount amount
3. Frontend `POST /api/orders/:id/pay/promptpay` → system creates Omise PromptPay charge, returns QR URI
4. Omise webhook `POST /webhooks/omise` → system updates order to `paid`, grants access, sends email
5. Frontend `GET /api/orders/:id/status` (polling every 3 s) → system returns current order status
6. Frontend `POST /api/orders/:id/pay/card` → system creates Omise Card charge, returns `authorize_uri` for 3DS
7. Omise redirects to `GET /payment/callback` after 3DS → system finalises order
8. Guest clicks access link `GET /access?token=<jwt>` → system verifies JWT, serves course access

---

## Non-functional Requirements

- [x] **Security**: Card data never passes through the server — Omise.js tokenises on the frontend only
- [ ] **Security**: Verify `X-Omise-Webhook-Signature` on every incoming webhook
- [ ] **Security**: National ID encrypted at rest; never logged
- [ ] **Security**: Idempotency key on every Omise charge creation
- [ ] **Integrity**: Coupon `redemption_count` incremented inside a DB transaction with pessimistic lock
- [x] **Integrity**: All monetary values stored as satang (integer), no floating-point arithmetic
- [ ] **Rate limiting**: `POST /api/orders` and `POST /api/coupons/validate` max 10 req/min/IP
- [ ] **Timestamps**: All timestamps stored in UTC; formatted as `DD/MM/YYYY HH:MM:SS (UTC+7)` in reports

---

## Scope

- [x] `apps/api/` — Backend (NestJS · Clean Architecture)

---

## Architecture

### Feature Modules

```
src/
  order/
    domain/
      entities/         order.entity.ts
      repositories/     order.repository.ts          ← interface
      use-cases/        create-order.use-case.ts
                        get-order-status.use-case.ts
                        pay-promptpay.use-case.ts
                        pay-card.use-case.ts
                        handle-webhook.use-case.ts
                        handle-3ds-callback.use-case.ts
                        grant-access.use-case.ts
                        resend-access-link.use-case.ts
    infrastructure/
      repositories/     typeorm-order.repository.ts
      adapters/         omise.adapter.ts
                        email.adapter.ts
      entities/         order.typeorm-entity.ts
                        invoice-info.typeorm-entity.ts
    presentation/
      controllers/      order.controller.ts
                        webhook.controller.ts
                        access.controller.ts
      dto/              create-order.dto.ts
                        pay-promptpay.dto.ts
                        pay-card.dto.ts
    application/
      order.module.ts

  coupon/
    domain/
      entities/         coupon.entity.ts
      repositories/     coupon.repository.ts         ← interface
      use-cases/        validate-coupon.use-case.ts
    infrastructure/
      repositories/     typeorm-coupon.repository.ts
      entities/         coupon.typeorm-entity.ts
    presentation/
      controllers/      coupon.controller.ts
      dto/              validate-coupon.dto.ts
    application/
      coupon.module.ts
```

---

### Domain Entities

#### Order (`order.entity.ts`)

```
id                UUID PK
course_id         UUID FK → courses
customer_name     string
customer_email    string
coupon_id         UUID FK → coupons | null
list_price        integer (satang)
coupon_discount   integer (satang)
paid_amount       integer (satang)
amount_excl_vat   integer (satang)
vat_amount        integer (satang)
status            OrderStatus enum
payment_method    'promptpay' | 'card' | null
omise_charge_id   string | null
card_retry_count  integer default 0
payment_datetime  timestamp UTC | null
access_token      string (signed JWT, stored hashed)
created_at        timestamp UTC
updated_at        timestamp UTC
```

**OrderStatus state machine:**

```
created → pending_payment (PromptPay) | processing_3ds (Card)
         → paid → access_granted
         → cancelled | failed
```

#### InvoiceInfo (`invoice-info.typeorm-entity.ts`)

```
id              UUID PK
order_id        UUID FK → orders
type            'individual' | 'company'
full_name       string | null          (individual)
national_id     string (encrypted)     (individual — 13 digits)
address         string | null          (individual)
invoice_email   string | null          (individual)
company_name    string | null          (company)
tax_id          string | null          (company — 13 digits)
company_address string | null          (company)
contact_name    string | null          (company)
contact_email   string | null          (company)
issued_at       timestamp UTC | null   (admin marks when PDF sent)
```

#### Coupon (`coupon.entity.ts`)

```
id                 UUID PK
code               string UNIQUE
type               'percentage' | 'fixed'
value              integer (satang for fixed; basis points for percentage e.g. 2000 = 20%)
max_redemptions    integer | null
redemption_count   integer default 0
expires_at         timestamp UTC | null
is_active          boolean default true
created_at         timestamp UTC
```

---

### Pricing Calculation (Pure function — domain layer)

```
paid_amount     = list_price − coupon_discount        (floor 0)
amount_excl_vat = Math.round(paid_amount × 100 / 107)
vat_amount      = paid_amount − amount_excl_vat
```

All values in satang (integer). Implemented as a pure function in `domain/` — zero NestJS imports.

---

### API Endpoints

| Method | Path                            | Rate Limit | Description                                                       |
| ------ | ------------------------------- | ---------- | ----------------------------------------------------------------- |
| `POST` | `/api/orders`                   | 10/min/IP  | Create order + invoice info                                       |
| `GET`  | `/api/orders/:id/status`        | —          | Poll order status (returns `status`, `qr_uri?`, `authorize_uri?`) |
| `POST` | `/api/coupons/validate`         | 10/min/IP  | Validate coupon code, return discount                             |
| `POST` | `/api/orders/:id/pay/promptpay` | —          | Create PromptPay Omise charge                                     |
| `POST` | `/api/orders/:id/pay/card`      | —          | Create Card Omise charge (send `omise_token`)                     |
| `GET`  | `/payment/callback`             | —          | 3DS return URL — receives `charge_id` from Omise                  |
| `POST` | `/webhooks/omise`               | —          | Omise webhook — verifies signature, processes event               |
| `GET`  | `/access`                       | —          | Verify JWT access token, redirect to course                       |
| `POST` | `/api/access/resend`            | —          | Resend access link (email + order number)                         |

---

### Migrations

Prefix all filenames with Unix timestamp.

| #   | Filename suffix           | Description                                                                       |
| --- | ------------------------- | --------------------------------------------------------------------------------- |
| 1   | `CreateCoursesTable`      | Stub courses table (id, title, list_price)                                        |
| 2   | `CreateCouponsTable`      | Coupons with index on `code`                                                      |
| 3   | `CreateOrdersTable`       | Orders with FK → courses, coupons; indexes on `customer_email`, `omise_charge_id` |
| 4   | `CreateInvoiceInfosTable` | Invoice info with FK → orders; national_id encrypted column                       |

---

## Tasks

### Phase 1 — Coupon Domain

- [ ] `coupon/domain/entities/coupon.entity.ts` — domain model with `validate()` method enforcing all 5.3 rules
- [ ] `coupon/domain/repositories/coupon.repository.ts` — interface: `findByCode`, `incrementRedemption (tx)`, `decrementRedemption (tx)`
- [ ] `coupon/domain/use-cases/validate-coupon.use-case.ts` — pure validation, returns `{ valid, type, value, couponId }` or throws domain error
- [ ] `coupon/infrastructure/entities/coupon.typeorm-entity.ts`
- [ ] `coupon/infrastructure/repositories/typeorm-coupon.repository.ts` — pessimistic lock on `incrementRedemption`
- [ ] Migration: `CreateCouponsTable`
- [ ] `coupon/presentation/dto/validate-coupon.dto.ts` — Zod schema `{ code: z.string() }`
- [ ] `coupon/presentation/controllers/coupon.controller.ts` — `POST /api/coupons/validate`
- [ ] `coupon/application/coupon.module.ts`
- [ ] Tests: `validate-coupon.use-case.spec.ts` — when expired, when exhausted, when disabled, when valid

### Phase 2 — Order Domain (Create + Pricing)

- [ ] `order/domain/entities/order.entity.ts` — state machine, `calculatePricing()` pure method
- [ ] `order/domain/repositories/order.repository.ts` — interface: `save`, `findById`, `findByIdAndEmail`
- [ ] `order/domain/use-cases/create-order.use-case.ts` — creates order, calls pricing calc, conditionally applies coupon
- [ ] `order/infrastructure/entities/order.typeorm-entity.ts`
- [ ] `order/infrastructure/entities/invoice-info.typeorm-entity.ts` — encrypted `national_id`, `tax_id`
- [ ] `order/infrastructure/repositories/typeorm-order.repository.ts`
- [ ] Migrations: `CreateCoursesTable`, `CreateOrdersTable`, `CreateInvoiceInfosTable`
- [ ] `order/presentation/dto/create-order.dto.ts` — Zod schema covering both individual and company invoice types
- [ ] Tests: `create-order.use-case.spec.ts` — pricing calculations, coupon application, free-order path

### Phase 3 — Payment (PromptPay)

- [ ] `order/infrastructure/adapters/omise.adapter.ts` — wrapper: `createPromptPayCharge`, `createCardCharge`, `retrieveCharge`, `verifyWebhookSignature`
- [ ] `order/domain/use-cases/pay-promptpay.use-case.ts` — creates Omise charge, updates order to `pending_payment`, returns QR URI
- [ ] `order/presentation/dto/pay-promptpay.dto.ts`
- [ ] `order/presentation/controllers/order.controller.ts` — adds `POST /api/orders/:id/pay/promptpay`
- [ ] `GET /api/orders/:id/status` endpoint — returns status + QR URI for polling
- [ ] Tests: `pay-promptpay.use-case.spec.ts` — mocked Omise adapter

### Phase 4 — Payment (Credit Card + 3DS)

- [ ] `order/domain/use-cases/pay-card.use-case.ts` — tokenise charge, idempotency key, returns `authorize_uri` if 3DS needed; enforces 3-retry limit
- [ ] `order/domain/use-cases/handle-3ds-callback.use-case.ts` — fetches charge from Omise, updates order state
- [ ] `order/presentation/dto/pay-card.dto.ts` — Zod schema `{ omise_token: z.string() }`
- [ ] `order/presentation/controllers/order.controller.ts` — adds `POST /api/orders/:id/pay/card`
- [ ] `order/presentation/controllers/webhook.controller.ts` — `GET /payment/callback`
- [ ] Tests: `pay-card.use-case.spec.ts` — 3DS pending, charge success, retry limit enforced

### Phase 5 — Webhook + Access

- [ ] `order/domain/use-cases/handle-webhook.use-case.ts` — verifies signature, updates order to `paid`, triggers `GrantAccessUseCase`
- [ ] `order/domain/use-cases/grant-access.use-case.ts` — signs JWT `{ order_id, course_id, exp: +1yr }`, stores hash, calls `EmailAdapter.sendReceipt`
- [ ] `order/domain/use-cases/resend-access-link.use-case.ts` — looks up by `order_id + email`, re-signs token, resends email
- [ ] `order/infrastructure/adapters/email.adapter.ts` — SendGrid: `sendReceipt`, `sendAdminInvoiceNotification`
- [ ] `order/presentation/controllers/webhook.controller.ts` — `POST /webhooks/omise`
- [ ] `order/presentation/controllers/access.controller.ts` — `GET /access`, `POST /api/access/resend`
- [ ] Tests: `handle-webhook.use-case.spec.ts`, `grant-access.use-case.spec.ts`

### Phase 6 — Module Wiring + Rate Limiting

- [ ] `order/application/order.module.ts` — register all use cases, adapters, repositories
- [ ] `coupon/application/coupon.module.ts`
- [ ] Apply `@Throttle({ limit: 10, ttl: 60_000 })` on `POST /api/orders` and `POST /api/coupons/validate`
- [ ] Register `OrderModule` and `CouponModule` in `AppModule`

### Phase 7 — Integration & Smoke Tests

- [ ] E2E: create order → validate coupon → pay promptpay → simulate webhook → verify order `access_granted`
- [ ] E2E: create free order (coupon covers full price) → verify auto-complete without Omise charge

---

## Open Questions (from SPEC §16)

| #   | Question                                                      | Impact                                                        |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Coupon per-course or global?                                  | Adds `applicable_course_ids[]` to coupon entity if per-course |
| 2   | Duplicate purchase (same email + course)?                     | Block / resend link / allow                                   |
| 3   | Access JWT expiry: 1 year or lifetime?                        | Security vs UX                                                |
| 4   | Refund flow required?                                         | Full Omise reverse charge if yes                              |
| 5   | PromptPay QR timeout: Omise default (10 min) or configurable? | Config env var `PROMPTPAY_QR_TTL_SECONDS`                     |
| 6   | Tax invoice SLA (how many business days)?                     | Shown in receipt email copy                                   |
