'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutStepper } from '@/components/organisms/CheckoutStepper';
import { useCheckoutStore } from '@/store/checkoutStore';
import { orderApi } from '@/api/orderApi';
import { StepCustomerInfo } from './_components/StepCustomerInfo';
import { StepTaxInvoice } from './_components/StepTaxInvoice';
import { StepCoupon } from './_components/StepCoupon';
import { StepSummary } from './_components/StepSummary';
import { StepPayment } from './_components/StepPayment/StepPayment';
import { StepConfirmation } from './_components/StepConfirmation';

export default function CheckoutPage() {
  const router = useRouter();
  const courseId = useCheckoutStore((s) => s.courseId);
  const currentStep = useCheckoutStore((s) => s.currentStep);
  const setStep = useCheckoutStore((s) => s.setStep);
  const setOrderId = useCheckoutStore((s) => s.setOrderId);
  const setPricing = useCheckoutStore((s) => s.setPricing);
  const customerInfo = useCheckoutStore((s) => s.customerInfo);
  const invoiceInfo = useCheckoutStore((s) => s.invoiceInfo);
  const coupon = useCheckoutStore((s) => s.coupon);

  useEffect(() => {
    if (!courseId) router.replace('/');
  }, [courseId, router]);

  async function handleStep2Next() {
    // After customer info + invoice info collected, create the order
    if (!courseId || !customerInfo || !invoiceInfo) return;
    try {
      const result = await orderApi.createOrder({
        courseId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        invoiceInfo,
        couponCode: coupon?.code,
      });
      setOrderId(result.orderId);
      setPricing(result.pricing);
      setStep(3);
    } catch {
      // Error is surfaced by the step component
    }
  }

  if (!courseId) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <CheckoutStepper currentStep={currentStep} />
        </div>
        <div className="rounded-xl bg-white shadow-sm p-6">
          {currentStep === 1 && <StepCustomerInfo onNext={() => setStep(2)} />}
          {currentStep === 2 && (
            <StepTaxInvoice onNext={handleStep2Next} onBack={() => setStep(1)} />
          )}
          {currentStep === 3 && <StepCoupon onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {currentStep === 4 && (
            <StepSummary onNext={() => setStep(5)} onBack={() => setStep(3)} />
          )}
          {currentStep === 5 && (
            <StepPayment onSuccess={() => setStep(6)} onBack={() => setStep(4)} />
          )}
          {currentStep === 6 && <StepConfirmation />}
        </div>
      </div>
    </main>
  );
}
