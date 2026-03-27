---
output:
  pdf_document: default
  html_document: default
---
# Payment & Tax Invoice — Feature Specification
> Web ขายคอร์สเรียนออนไลน์ · Guest Mode Only · Omise Gateway
> Version 1.1 · 2026-03-05

---

## 1. Overview & Scope

ระบบรับชำระเงินสำหรับคอร์สเดี่ยว (single course) แบบ guest mode เท่านั้น ไม่มี user account
ลูกค้าจ่ายเงิน → ได้สิทธิ์เข้าเรียนทันที → รับ receipt ทาง email
ทุก order ต้องเก็บข้อมูลใบกำกับภาษีไว้ (admin จะออก PDF ส่งภายหลัง)

---

## 2. Payment Methods

| Method | Gateway | Flow |
|---|---|---|
| PromptPay | Omise (dynamic QR) | Generate QR → Polling → Confirm |
| Credit Card | Omise (Omise.js) | Tokenize → Charge → 3DS redirect → Confirm |

---

## 3. Full Checkout Flow

```
[หน้าคอร์ส]
    → กด "ซื้อคอร์ส"
    → Step 1: ข้อมูลลูกค้า (ชื่อ + email)
    → Step 2: ข้อมูลใบกำกับภาษี (required)
    → Step 3: คูปอง (optional apply)
    → Step 4: สรุปยอด + เลือกวิธีชำระเงิน
    → Step 5: ชำระเงิน
    → Step 6: หน้ายืนยัน + ส่ง email receipt
    → [เข้าเรียนได้ทันที]
```

---

## 4. Pricing & VAT

### 4.1 โครงสร้างราคา
- **ราคาที่แสดง = ราคารวม VAT 7% แล้ว (inclusive)**
- ต้องแสดง breakdown บนหน้า summary:

```
ราคาคอร์ส (list_price)          ฿3,000.00
ส่วนลดคูปอง (coupon_discount)   -฿300.00
────────────────────────────────────────
ราคาจ่ายจริง (paid_amount)       ฿2,700.00
  ├ ราคาก่อน VAT (amount_excl_vat)  ฿2,523.36
  └ VAT 7%       (vat_amount)         ฿176.64
```

### 4.2 Field Naming (Industry Standard)

| Field Name | ภาษาไทย | คำอธิบาย |
|---|---|---|
| `list_price` | ราคาเต็ม | ราคาคอร์สก่อนหักส่วนลด (รวม VAT แล้ว) |
| `coupon_discount` | มูลค่าส่วนลดคูปอง | จำนวนเงินที่ลด (0 ถ้าไม่มีคูปอง) |
| `paid_amount` | ราคาจ่ายจริง | `list_price − coupon_discount` (รวม VAT) |
| `amount_excl_vat` | ราคาก่อน VAT | `paid_amount × 100/107` |
| `vat_amount` | VAT 7% | `paid_amount × 7/107` |

> **DB Best Practice**: เก็บทุก amount เป็น **satang (integer)** เพื่อหลีกเลี่ยง floating-point error
> เช่น ฿2,700.00 → เก็บเป็น `270000` (satang)

### 4.3 การคำนวณเมื่อมีคูปอง
- ลด coupon ออกจาก **ราคารวม VAT** ก่อน แล้วค่อย back-calculate VAT จาก net
- สูตร: `vat_amount = paid_amount × 7/107`
- กรณียอดหลังหักคูปองเป็น 0 บาท → ไม่ต้องผ่าน payment gateway (auto-complete free order)

---

## 5. Coupon / Discount Code

### 5.1 ประเภท
| Type | Description |
|---|---|
| Percentage | ลด X% จากราคารวม VAT (เช่น 20% off) |
| Fixed Amount | ลดจำนวนเงินคงที่ (เช่น ฿100) |

### 5.2 Constraints
- `max_redemptions` — จำกัดจำนวนครั้งที่ใช้ได้ (null = ไม่จำกัด)
- `expires_at` — วันหมดอายุ (null = ไม่มีวันหมดอายุ)
- คูปองหนึ่งใบต่อ order (no stacking)
- Fixed amount ต้องไม่ทำให้ยอดชำระติดลบ → floor ที่ 0

### 5.3 Validation Rules
| Condition | Error Message |
|---|---|
| ไม่พบ code ในระบบ | "ไม่พบโค้ดส่วนลดนี้" |
| หมดอายุแล้ว | "โค้ดส่วนลดนี้หมดอายุแล้ว" |
| ใช้ครบ max_redemptions | "โค้ดส่วนลดนี้ถูกใช้ครบแล้ว" |
| Code ถูก disable | "โค้ดส่วนลดนี้ไม่สามารถใช้งานได้" |

### 5.4 Edge Cases
- **Race condition**: ตรวจ max_redemptions ด้วย DB transaction / pessimistic lock เพื่อป้องกันการ redeem เกิน
- **Coupon + payment failed**: หาก charge ล้มเหลว ต้อง decrement กลับ (rollback redemption count)
- **Coupon apply แล้วเปลี่ยนใจ**: ต้องมีปุ่ม "ลบส่วนลด" และ release redemption count

---

## 6. PromptPay (Dynamic QR)

### 6.1 Flow
1. สร้าง Omise Charge ด้วย `source[type]=promptpay`
2. ได้ QR image / `scannable_code.image.download_uri` จาก Omise
3. แสดง QR พร้อม countdown timer 10 นาที
4. **Polling** ทุก 3 วินาที ไปที่ backend endpoint `/api/orders/:id/status`
5. Backend ถาม Omise API `GET /charges/:id` → ตรวจ `status`
6. เมื่อ `status = "successful"` → หยุด polling → redirect ไปหน้า success

### 6.2 QR Timeout (10 นาที)
| เหตุการณ์ | Action |
|---|---|
| countdown ถึง 0 | หยุด polling, แสดงปุ่ม "สร้าง QR ใหม่" |
| กด "สร้าง QR ใหม่" | สร้าง Charge ใหม่ (Charge เดิม expire ไปแล้ว) |
| QR หมดอายุแต่ลูกค้าจ่ายไปแล้ว | Omise จะ reject ฝั่งธนาคาร → เงินไม่ถูกตัด หรือ refund อัตโนมัติโดย Omise |

### 6.3 Edge Cases
| Scenario | Handling |
|---|---|
| ลูกค้าปิด tab ระหว่างรอ QR | Order อยู่ใน `pending` → ถ้า webhook มาทีหลัง ให้ process ต่อ |
| User กลับมาเปิด URL order เดิม | ตรวจสอบ order status ก่อน แสดงผลตามสถานะปัจจุบัน |
| Webhook มาก่อน polling detect | Webhook เป็น source of truth, อัปเดต order DB ก่อน |
| ลูกค้าสแกนจ่าย 2 ครั้ง | Omise จัดการให้ (dynamic QR = single-use) |
| Polling ล้มเหลว (network error) | แสดง "กำลังตรวจสอบ..." ไม่หยุดทันที retry polling |

### 6.4 Polling Spec
```
interval: 3 วินาที
max attempts: 200 ครั้ง (= ~10 นาที)
backoff: ไม่ต้องใช้ exponential (ใช้ fixed interval เพราะ UX ต้องการ real-time feel)
stop conditions: status = successful | failed | expired | ปิด timer
```

---

## 7. Credit Card (3DS)

### 7.1 Flow
1. ใช้ **Omise.js** tokenize card บน frontend — card data ไม่ผ่าน server เลย
2. ส่ง `omise_token` ไปที่ backend
3. Backend สร้าง Omise Charge `return_uri = /payment/callback`
4. ถ้า charge `status = "pending"` และมี `authorize_uri` → redirect ไปหน้า 3DS OTP
5. หลัง OTP: Omise redirect กลับมาที่ `return_uri` พร้อม `charge_id`
6. Backend ตรวจ charge status → อัปเดต order

### 7.2 Retry Policy
- Retry สูงสุด **3 ครั้ง** ต่อ order
- นับ retry ฝั่ง backend (ไม่เชื่อ frontend)
- ครั้งที่ 3 ล้มเหลว → order status = `cancelled` → แสดงปุ่ม "เริ่มใหม่" (start new order)

### 7.3 Edge Cases
| Scenario | Handling |
|---|---|
| ลูกค้าปิด popup 3DS | Charge ยัง pending → polling 30 วินาที ถ้าไม่มีผล → mark failed → retry |
| 3DS succeed แต่ callback หาย | backend ต้อง webhook จาก Omise เป็น fallback |
| บัตรถูก decline | แสดง error จาก Omise เช่น "บัตรถูกปฏิเสธ กรุณาตรวจสอบกับธนาคาร" |
| บัตร expire | Omise.js validate ก่อน tokenize, แสดง inline error ทันที |
| ลูกค้าใช้บัตรต่างประเทศ | Omise รองรับ, ไม่ต้องทำอะไรเพิ่ม |
| Double submit (กดชำระ 2 ครั้ง) | Disable submit button หลังกดครั้งแรก + idempotency key บน backend |

### 7.4 Error Messages (TH)
| Omise Code | แสดงให้ลูกค้า |
|---|---|
| `failed_fraud_check` | "ธุรกรรมนี้ถูกระงับ กรุณาติดต่อธนาคาร" |
| `insufficient_fund` | "วงเงินในบัตรไม่เพียงพอ" |
| `stolen_or_lost_card` | "ไม่สามารถใช้บัตรนี้ได้ กรุณาติดต่อธนาคาร" |
| `failed_processing` | "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" |
| อื่นๆ | "การชำระเงินไม่สำเร็จ กรุณาลองใหม่หรือเปลี่ยนวิธีชำระ" |

---

## 8. Tax Invoice (ใบกำกับภาษี)

### 8.1 Overview
- **Required** สำหรับทุก order — ถามในหน้า checkout ก่อนเลือก payment method
- Admin จัดการ manually แล้วส่งทาง email ภายหลัง (ระบบเก็บข้อมูลไว้ใน DB เท่านั้น)
- แจ้งเตือน admin เมื่อมี order ใหม่ (แยก field ระหว่าง receipt email กับ invoice email)

### 8.2 ประเภทใบกำกับภาษี

#### บุคคลธรรมดา (Individual)
| Field | Required | Validation |
|---|---|---|
| ชื่อ-นามสกุล | ✅ | ไม่ว่าง |
| เลขประจำตัวประชาชน | ✅ | 13 หลัก, ตัวเลขเท่านั้น, checksum ผ่าน Luhn-like Thai ID algorithm |
| ที่อยู่ตามทะเบียนบ้าน | ✅ | ไม่ว่าง (เก็บเป็น free-text) |
| Email รับใบกำกับภาษี | ✅ | valid email format |

#### นิติบุคคล (Company)
| Field | Required | Validation |
|---|---|---|
| ชื่อบริษัท | ✅ | ไม่ว่าง |
| เลขประจำตัวผู้เสียภาษี | ✅ | 13 หลัก, ตัวเลขเท่านั้น |
| ที่อยู่สำนักงาน/สาขา | ✅ | ไม่ว่าง (รวมรหัสสาขา เช่น "สำนักงานใหญ่ 00000") |
| ชื่อผู้ติดต่อ | ✅ | ไม่ว่าง |
| Email ผู้ติดต่อ | ✅ | valid email format |

### 8.3 Edge Cases
| Scenario | Handling |
|---|---|
| ลูกค้ากรอกข้อมูลผิด (typo) | ให้ลูกค้า email หา support เพื่อแก้ไขก่อน admin ออกใบ |
| Tax ID ไม่ผ่าน checksum | แสดง error inline ทันที ไม่รอ submit |
| บริษัทมีหลายสาขา | เก็บ branch name/number ใน field ที่อยู่ ไม่แยก field |
| ลูกค้า email ต่างจาก invoice email | เก็บทั้งสองแยกกันใน DB |
| Admin ต้องการ export ข้อมูล | ต้องมี admin dashboard แสดงรายการ pending invoice requests |

### 8.4 Data Model (Invoice Info)
```json
{
  "type": "individual | company",
  "individual": {
    "full_name": "string",
    "national_id": "string (13 digits)",
    "address": "string",
    "invoice_email": "string"
  },
  "company": {
    "company_name": "string",
    "tax_id": "string (13 digits)",
    "address": "string",
    "contact_name": "string",
    "contact_email": "string"
  }
}
```

---

## 9. Order State Machine

```
[created]
    │
    ├─(PromptPay)──► [pending_payment] ──(QR expired/3 failed)──► [cancelled]
    │                      │
    │               (webhook/polling)
    │                      │
    ├─(CreditCard)──► [processing_3ds] ──(3DS failed x3)──► [cancelled]
    │                      │
    │               (charge successful)
    │                      │
    └──────────────────────▼
                      [paid] ──► [access_granted]
```

| Status | Description |
|---|---|
| `created` | Order สร้างแล้ว ยังไม่เลือก payment |
| `pending_payment` | รอ PromptPay scan |
| `processing_3ds` | รอ 3DS OTP |
| `paid` | ชำระสำเร็จ |
| `access_granted` | Enroll คอร์สแล้ว (final state) |
| `cancelled` | ยกเลิก (retry หมด / QR expire / user cancel) |
| `failed` | เกิดข้อผิดพลาด (internal error) |

---

## 10. Order Data Model (Key Fields)

### 10.1 Timestamp

| Field | Type | คำอธิบาย |
|---|---|---|
| `payment_datetime` | TIMESTAMP (UTC) | วันเวลาที่ชำระเงินสำเร็จ (webhook confirm) |
| `created_at` | TIMESTAMP (UTC) | วันเวลาที่สร้าง order |
| `updated_at` | TIMESTAMP (UTC) | วันเวลาที่อัปเดตล่าสุด |

- **เก็บ UTC เสมอ** ใน DB — แปลงเป็น UTC+7 (Asia/Bangkok) ตอนแสดงผลบน UI/Report เท่านั้น
- รูปแบบที่แสดงใน Report Admin: `DD/MM/YYYY HH:MM:SS` (UTC+7)
- `payment_datetime` จะเป็น `NULL` สำหรับ order ที่ยัง pending/cancelled/failed

### 10.2 Amount Fields (satang)

| Field | Type | ตัวอย่าง (฿2,700) |
|---|---|---|
| `list_price` | INTEGER (satang) | 300000 |
| `coupon_discount` | INTEGER (satang) | 30000 |
| `paid_amount` | INTEGER (satang) | 270000 |
| `amount_excl_vat` | INTEGER (satang) | 252336 |
| `vat_amount` | INTEGER (satang) | 17664 |

> หมายเหตุ: ค่าที่แสดงใน UI/Report ให้หาร 100 แล้ว format เป็น 2 ทศนิยม

---

## 11. Guest Mode — Course Access

เนื่องจากไม่มี user account:

- หลังจ่ายเงินสำเร็จ ระบบส่ง **magic access link** ไปที่ email ที่ลูกค้ากรอกใน checkout
- Link รูปแบบ: `https://yourdomain.com/access?token=<signed_jwt>`
- JWT payload: `{ order_id, course_id, exp: 1_year }` — sign ด้วย secret key
- ลูกค้าเข้า link → ได้ดู course ได้ทันที (ไม่ต้อง login)

### 11.1 Edge Cases
| Scenario | Handling |
|---|---|
| กรอก email ผิด | ให้ email หา support + แนะนำให้ตรวจสอบ spam folder |
| Link หมดอายุ (1 ปี) | แสดงหน้า "link หมดอายุ" พร้อมปุ่ม "ขอ link ใหม่" (กรอก email + order number) |
| ลูกค้าต้องการดูในอุปกรณ์อื่น | เปิด link จาก email ในอุปกรณ์ใหม่ได้เลย |
| ลูกค้าต้องการรู้ order number | แสดงใน receipt email + หน้า success |

---

## 12. Email Notifications

### 12.1 Emails ที่ระบบส่ง

| Trigger | ส่งถึง | Subject | เนื้อหา |
|---|---|---|---|
| Payment success | ลูกค้า | "ชำระเงินสำเร็จ – [ชื่อคอร์ส]" | Order summary, access link, order number |
| Payment success (มี invoice request) | Admin | "Invoice Request #[order_id]" | ข้อมูลใบกำกับภาษีครบถ้วน |

### 12.2 Receipt Email Content
```
หัวข้อ: ยืนยันการสั่งซื้อ #[ORDER_NUMBER]

ขอบคุณที่ซื้อคอร์ส [COURSE_NAME]

Order Number: #12345
วันที่: DD/MM/YYYY
ราคา: ฿X,XXX (รวม VAT 7%)
วิธีชำระ: PromptPay / Credit Card

[ปุ่ม: เข้าเรียนคอร์ส]
(หรือ copy link: https://...)

หากต้องการใบกำกับภาษี ทีมงานจะจัดส่งภายใน X วันทำการ
สอบถามเพิ่มเติม: support@yourdomain.com
```

---

## 13. Security Requirements

| Area | Requirement |
|---|---|
| Card data | ใช้ Omise.js tokenize บน frontend เท่านั้น — ไม่ผ่าน server เด็ดขาด |
| Omise Webhook | Verify signature ทุก request (`X-Omise-Webhook-Signature`) |
| CSRF | ใช้ CSRF token สำหรับทุก POST form |
| Idempotency | ส่ง `Idempotency-Key` header ทุกครั้งที่ create Omise charge |
| Tax ID | ไม่ log ลงใน application logs (PII) |
| National ID | เก็บใน DB แบบ encrypted at rest |
| Order access | Guest ดู order status ได้ผ่าน `order_id + email` เท่านั้น |
| Rate limiting | POST `/api/orders` และ `/api/coupons/validate` max 10 req/min/IP |

---

## 14. API Endpoints (สรุป)

```
POST   /api/orders                    → สร้าง order ใหม่ (พร้อมข้อมูล invoice)
GET    /api/orders/:id/status         → ดู order status (สำหรับ polling)
POST   /api/orders/:id/pay/promptpay  → สร้าง PromptPay charge
POST   /api/orders/:id/pay/card       → สร้าง Credit Card charge (ส่ง omise_token)
POST   /api/coupons/validate          → ตรวจสอบ coupon code
GET    /payment/callback              → 3DS return URL (GET params จาก Omise)
POST   /webhooks/omise                → รับ webhook จาก Omise
GET    /access                        → Verify JWT access token → redirect ไปหน้าคอร์ส
POST   /api/access/resend             → ขอ access link ใหม่ (email + order number)
```

---

## 15. Admin Requirements

| Feature | Description |
|---|---|
| Invoice Queue | ดูรายการ orders ที่รอออกใบกำกับภาษี (filter: pending, issued) |
| Invoice Detail | ดูข้อมูลครบถ้วนต่อ order (type, fields, order amount) |
| Mark as Issued | อัปเดต status เมื่อส่ง PDF แล้ว |
| Export | Export เป็น CSV สำหรับทำบัญชี |
| Email notification | รับ email เมื่อมี invoice request ใหม่ |

---

## 16. Open Questions (ยังต้องตัดสินใจ)

| # | คำถาม | Impact |
|---|---|---|
| 1 | Coupon ใช้ได้กับทุกคอร์ส หรือ per-course เท่านั้น? | ถ้า per-course ต้องเพิ่ม `applicable_course_ids` ใน coupon table |
| 2 | หากลูกค้าซื้อคอร์สเดิมซ้ำ (same email + same course) จะทำอะไร? | Block? Resend link? Allow duplicate? |
| 3 | Access link JWT expiry — 1 ปีเหมาะหรือไม่? หรือตลอดชีวิต? | UX vs security |
| 4 | Refund policy — มีหรือไม่? ถ้ามี ต้องทำ reverse charge บน Omise | ถ้าไม่มี ไม่ต้อง implement |
| 5 | ระบบต้องรองรับ multi-language (EN/TH) หรือ TH only? | ขนาด scope |
| 6 | PromptPay QR timeout ที่ Omise กำหนดคือ 10 นาทีอยู่แล้ว ให้ใช้ค่า default นั้น หรือต้องการ config เอง? | ถ้า config เอง ต้องระวังว่าต้องตรงกับ Omise |
| 7 | ใบกำกับภาษี — ต้องการออกภายในกี่วันทำการ? (ควรแจ้งลูกค้าไว้ใน email) | SLA ของ admin |

---

## 17. Out of Scope (สิ่งที่ไม่ทำในงานนี้)

- User accounts / login system
- Subscription / recurring payment
- Multi-course cart
- Installment payment (ผ่อนชำระ)
- Auto-generate PDF ใบกำกับภาษี (admin ทำ manual)
- Refund flow
- Course content delivery system (แค่ส่ง access link)

---

*ผู้จัดทำ spec: Claude (Cowork) · สรุปจาก interview session · 2026-03-05*
*v1.1 update: เพิ่ม field naming (list_price / coupon_discount / paid_amount), satang storage, payment_datetime spec*
