'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/atoms/Spinner';
import { orderApi } from '@/api/orderApi';
import { useCheckoutStore } from '@/store/checkoutStore';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = useCheckoutStore((s) => s.orderId);
  const setStep = useCheckoutStore((s) => s.setStep);

  useEffect(() => {
    const chargeId = searchParams.get('charge_id');
    if (!orderId || !chargeId) {
      router.replace('/');
      return;
    }

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const result = await orderApi.getOrderStatus(orderId);
        if (result.status === 'paid' || result.status === 'access_granted') {
          clearInterval(interval);
          setStep(6);
          router.replace('/checkout');
        } else if (result.status === 'failed' || result.status === 'cancelled') {
          clearInterval(interval);
          router.replace('/checkout');
        }
      } catch {
        // keep polling
      }
      if (attempts > 30) {
        clearInterval(interval);
        router.replace('/checkout');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, searchParams, router, setStep]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-gray-600">กำลังยืนยันการชำระเงิน...</p>
    </div>
  );
}
