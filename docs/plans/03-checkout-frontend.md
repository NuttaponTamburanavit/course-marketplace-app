---
title: Checkout & Payment — Frontend
date: 2026-03-09
---

# Plan: Checkout & Payment — Frontend

Multi-step checkout UI for guest users — customer info, tax invoice, coupon, order summary with VAT breakdown, PromptPay QR (with polling) and Credit Card (Omise.js + 3DS), and a JWT-gated course access page.

---

## Goal

A guest user can navigate a 6-step checkout on the web app, pay via PromptPay or Credit Card, land on a confirmation page, and later use the magic access link to view the course — without ever creating an account.

---

## User Flow

1. User visits course page → clicks **"ซื้อคอร์ส"**
2. **Step 1** — fills in name + email
3. **Step 2** — picks invoice type (Individual / Company) and fills required fields; Thai ID checksum validated inline
4. **Step 3** — optionally enters coupon code; sees real-time discount applied
5. **Step 4** — reviews order summary (list_price, coupon_discount, paid_amount, amount_excl_vat, vat_amount); selects payment method
6. **Step 5a (PromptPay)** — PromptPay QR shown with 10-minute countdown; polling every 3 s; auto-advances on success
7. **Step 5b (Credit Card)** — Omise.js card form, tokenise then submit; redirected to 3DS if needed; max 3 retries shown
8. **Step 6** — Order confirmation page: order number, receipt info, access link button
9. User opens magic link email → `/access?token=<jwt>` → arrives directly at course player

---

## Non-functional Requirements

- [ ] **Security**: Omise.js loaded directly from Omise CDN; card data tokenised client-side — no card numbers sent to our server
- [ ] **Accessibility**: All form fields labelled; error messages readable by screen readers
- [ ] **Performance**: PromptPay polling is `setInterval` in a Client Component; all other steps use Server Components where possible
- [ ] **Resilience**: Polling network errors display "กำลังตรวจสอบ..." without stopping the interval

---

## Scope

- [x] `apps/web/` — Frontend (Next.js 14 App Router · Atomic Design)

---

## Architecture

### Route Structure

```
app/
  courses/
    [courseId]/
      page.tsx             ← Course detail (Server Component) — Buy button
      loading.tsx
      error.tsx
  checkout/
    page.tsx               ← Multi-step checkout shell (Client Component — drives step state)
    loading.tsx
    error.tsx
    not-found.tsx
    _components/           ← page-scoped components (not in /components/)
      StepCustomerInfo.tsx
      StepTaxInvoice.tsx
      StepCoupon.tsx
      StepSummary.tsx
      StepPayment/
        StepPayment.tsx
        PromptPayPanel.tsx  ← QR + countdown + polling (Client Component)
        CardPanel.tsx       ← Omise.js form (Client Component)
      StepConfirmation.tsx
  access/
    page.tsx               ← JWT access gate — Server Component, redirects to course
    loading.tsx
    error.tsx
  payment/
    callback/
      page.tsx             ← 3DS return page — reads search params, shows spinner
```

### Component Map (Atomic Design)

```
components/
  atoms/
    Button/               primary, secondary, ghost variants
    Input/                with inline error state
    Spinner/
    Badge/                order status badge
    Countdown/            (Client Component — `'use client'`)
  molecules/
    FormField/            label + Input + error message
    CouponField/          input + "ใช้โค้ด" button + success/error display
    PriceSummaryRow/      single row of the VAT breakdown table
    QrCode/               renders QR image from URI (Client Component)
    PaymentMethodSelector/ PromptPay | Credit Card radio cards
  organisms/
    CheckoutStepper/      step indicator (1–6)
    PriceSummaryTable/    full breakdown: list_price → vat_amount
    OmiseCardForm/        Omise.js card fields wrapper (Client Component)
    PromptPaySection/     QrCode + Countdown + polling logic
```

### State Management

- `checkoutStore` (Zustand) — extended to hold:
  - `orderId`, `courseId`
  - `customerInfo: { name, email }`
  - `invoiceInfo: InvoiceInfo`
  - `coupon: { code, discount } | null`
  - `pricing: PricingBreakdown`
  - `paymentMethod: 'promptpay' | 'card' | null`
  - `currentStep: CheckoutStep`

### API Client additions (`api/`)

```
api/
  orderApi.ts      createOrder, getOrderStatus, payPromptPay, payCard, resendAccessLink
  couponApi.ts     validateCoupon
```

### Hooks

```
hooks/
  usePromptPayPolling.ts   ← polls /api/orders/:id/status every 3 s; stops on terminal status
  useCheckoutStep.ts       ← thin wrapper over checkoutStore step navigation
  useTaxIdValidation.ts    ← Luhn-like Thai national ID checksum (pure, client-side)
```

### Utilities

```
utils/
  formatSatang.ts          ← (satang: number) => "฿X,XXX.XX"
  thaiNationalId.ts        ← validateThaiNationalId(id: string): boolean
  formatDateThai.ts        ← (utcIso: string) => "DD/MM/YYYY HH:MM:SS"
```

---

## Tasks

### Phase 1 — Atoms & Utilities

- [x] `components/atoms/Button/` — variants: `primary`, `secondary`, `ghost`, `destructive`; `loading` prop disables + shows spinner
- [x] `components/atoms/Input/` — controlled; `error` prop shows red border + message
- [x] `components/atoms/Spinner/`
- [x] `components/atoms/Countdown/` — `'use client'`; props: `seconds: number`, `onExpire: () => void`
- [x] `components/atoms/Badge/` — `status: OrderStatus` → colour-coded label
- [x] Update `components/atoms/index.ts` barrel exports
- [x] `utils/formatSatang.ts` + unit test
- [x] `utils/thaiNationalId.ts` + unit test (valid ID, invalid checksum, non-numeric, wrong length)
- [x] `utils/formatDateThai.ts` + unit test

### Phase 2 — Molecules

- [x] `components/molecules/FormField/` — wraps `Input` with label + error; accessible `htmlFor`/`aria-describedby`
- [x] `components/molecules/CouponField/` — text input + "ใช้โค้ด" button; displays discount or error; "ลบส่วนลด" to clear
- [x] `components/molecules/PriceSummaryRow/` — label + amount; `variant: 'normal' | 'discount' | 'total' | 'sub'` for styling
- [x] `components/molecules/QrCode/` — renders `<img>` from `downloadUri`; `'use client'` for re-render on URI change
- [x] `components/molecules/PaymentMethodSelector/` — radio cards for PromptPay / Credit Card
- [x] Update `components/molecules/index.ts`

### Phase 3 — Organisms

- [x] `components/organisms/CheckoutStepper/` — shows 6 steps; highlights current; completed steps show tick
- [x] `components/organisms/PriceSummaryTable/` — renders all 5 pricing rows using `PriceSummaryRow`; accepts `PricingBreakdown` prop
- [x] `components/organisms/OmiseCardForm/` — loads Omise.js from CDN via `next/script`; exposes `createToken(): Promise<string>`; `'use client'`
- [x] `components/organisms/PromptPaySection/` — `QrCode` + `Countdown` + polling via `usePromptPayPolling`; shows "สร้าง QR ใหม่" on expire; `'use client'`
- [x] Update `components/organisms/index.ts`

### Phase 4 — Hooks & API Client

- [x] `hooks/useTaxIdValidation.ts` — validates Thai national ID inline on blur
- [x] `hooks/usePromptPayPolling.ts` — `setInterval` every 3 s; max 200 attempts; stops on `successful | failed | expired`; returns `{ status, error }`
- [x] `hooks/useCheckoutStep.ts`
- [x] `api/orderApi.ts` — `createOrder`, `getOrderStatus`, `payPromptPay`, `payCard`, `resendAccessLink` _(mock implementation — wire to real backend when API is ready)_
- [x] `api/couponApi.ts` — `validateCoupon` _(mock implementation — wire to real backend when API is ready)_
- [x] Update `store/checkoutStore.ts` with full checkout state fields

### Phase 5 — Checkout Steps (Page-scoped Components)

- [x] `app/checkout/_components/StepCustomerInfo.tsx` — name + email fields; validation on submit
- [x] `app/checkout/_components/StepTaxInvoice.tsx` — Individual / Company tabs; conditional fields; Thai ID checksum inline
- [x] `app/checkout/_components/StepCoupon.tsx` — renders `CouponField`; calls `couponApi.validateCoupon`; supports skip
- [x] `app/checkout/_components/StepSummary.tsx` — renders `PriceSummaryTable`; renders `PaymentMethodSelector`
- [x] `app/checkout/_components/StepPayment/PromptPayPanel.tsx` — renders `PromptPaySection`; calls `payPromptPay` on mount
- [x] `app/checkout/_components/StepPayment/CardPanel.tsx` — renders `OmiseCardForm`; on submit, gets token → calls `payCard`; shows retry count (max 3); shows Thai error messages mapped from Omise codes
- [x] `app/checkout/_components/StepPayment/StepPayment.tsx` — switches between `PromptPayPanel` / `CardPanel` based on `paymentMethod`
- [x] `app/checkout/_components/StepConfirmation.tsx` — order number, course name, date, access link button, next-step instructions

### Phase 6 — Routes

- [x] `app/courses/[courseId]/page.tsx` — Server Component; fetches course data; renders Buy button → navigates to checkout with `courseId`
- [x] `app/courses/[courseId]/loading.tsx` + `error.tsx`
- [x] `app/checkout/page.tsx` — Client Component; renders `CheckoutStepper` + current step component; persists `orderId` in state after `createOrder`
- [ ] `app/checkout/loading.tsx` + `error.tsx` + `not-found.tsx` — ⚠️ `loading.tsx` + `error.tsx` exist; `not-found.tsx` is missing
- [x] `app/access/page.tsx` — Server Component; reads `token` search param; calls `/access` backend for verification; redirects to course or shows error
- [x] `app/access/loading.tsx` + `error.tsx`
- [x] `app/payment/callback/page.tsx` — Client Component; reads `charge_id` search param; shows spinner while backend processes; polls order status then redirects

### Phase 7 — Tests

- [x] `utils/formatSatang.spec.ts` — when 270000, expect "฿2,700.00"; when 0, expect "฿0.00"
- [x] `utils/thaiNationalId.spec.ts` — when valid ID, expect true; when bad checksum, expect false; when non-numeric, expect false
- [x] `components/atoms/Button/Button.spec.tsx` — when loading prop, expect disabled; when onClick, expect handler called
- [x] `components/atoms/Countdown/Countdown.spec.tsx` — when seconds=0, expect onExpire called; when seconds>0, expect countdown renders
- [ ] `components/molecules/CouponField/CouponField.spec.tsx` — when valid coupon entered, expect discount shown; when invalid, expect error message
- [ ] `components/organisms/PriceSummaryTable/PriceSummaryTable.spec.tsx` — when pricing prop supplied, expect all 5 rows rendered with correct values
- [x] `hooks/usePromptPayPolling.spec.tsx` — when status=successful returned, expect polling stops; when max attempts reached, expect polling stops
- [x] `app/checkout/page.spec.tsx` — when rendered, expect stepper visible and step 1 shown

---

## Open Questions

| #   | Question                                                                                       | Impact                                          |
| --- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | Should checkout state survive a browser refresh? (localStorage persist via Zustand middleware) | UX vs complexity                                |
| 2   | PromptPay QR: show actual QR SVG generated client-side or use Omise's download URI directly?   | Depends on Omise response format                |
| 3   | 3DS redirect flow: full-page redirect or `<iframe>` popup?                                     | Full-page is simpler; popup needs `postMessage` |
| 4   | Omise.js version — pin to specific CDN version?                                                | `cdn.omise.co/omise.js` vs versioned URL        |
| 5   | Thai language only or add English toggle?                                                      | i18n scope                                      |
