'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { PriceSummaryTable } from '@/components/organisms/PriceSummaryTable';
import { PaymentMethodSelector } from '@/components/molecules/PaymentMethodSelector';
import { useCheckoutStore } from '@/store/checkoutStore';

interface StepSummaryProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepSummary({ onNext, onBack }: StepSummaryProps) {
  const pricing = useCheckoutStore((s) => s.pricing);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const [error, setError] = useState<string | undefined>();

  function handleNext() {
    if (!paymentMethod) {
      setError('กรุณาเลือกวิธีชำระเงิน');
      return;
    }
    setError(undefined);
    onNext();
  }

  if (!pricing) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">สรุปยอดและวิธีชำระเงิน</h2>
      <PriceSummaryTable pricing={pricing} />
      <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1" type="button">
          ย้อนกลับ
        </Button>
        <Button onClick={handleNext} className="flex-1" type="button">
          ถัดไป
        </Button>
      </div>
    </div>
  );
}
