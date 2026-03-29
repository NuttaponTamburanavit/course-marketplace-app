import { create } from 'zustand';
import type { InvoiceInfo, PricingBreakdown } from '@/api/types';

type PaymentMethod = 'promptpay' | 'card';
type CheckoutStep = 1 | 2 | 3 | 4 | 5 | 6;

interface CustomerInfo {
  name: string;
  email: string;
}

interface CouponState {
  code: string;
  discount: number;
}

interface CheckoutState {
  courseId: string | null;
  orderId: string | null;
  currentStep: CheckoutStep;
  customerInfo: CustomerInfo | null;
  invoiceInfo: InvoiceInfo | null;
  coupon: CouponState | null;
  pricing: PricingBreakdown | null;
  paymentMethod: PaymentMethod | null;
  qrUri: string | null;

  setCourseId: (id: string) => void;
  setOrderId: (id: string) => void;
  setStep: (step: number) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setInvoiceInfo: (info: InvoiceInfo) => void;
  setCoupon: (coupon: CouponState | null) => void;
  setPricing: (pricing: PricingBreakdown) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setQrUri: (uri: string) => void;
  reset: () => void;
}

const initialState = {
  courseId: null,
  orderId: null,
  currentStep: 1 as CheckoutStep,
  customerInfo: null,
  invoiceInfo: null,
  coupon: null,
  pricing: null,
  paymentMethod: null,
  qrUri: null,
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...initialState,
  setCourseId: (courseId) => set({ courseId }),
  setOrderId: (orderId) => set({ orderId }),
  setStep: (step) =>
    set({ currentStep: Math.min(Math.max(step, 1), 6) as CheckoutStep }),
  setCustomerInfo: (customerInfo) => set({ customerInfo }),
  setInvoiceInfo: (invoiceInfo) => set({ invoiceInfo }),
  setCoupon: (coupon) => set({ coupon }),
  setPricing: (pricing) => set({ pricing }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setQrUri: (qrUri) => set({ qrUri }),
  reset: () => set(initialState),
}));
