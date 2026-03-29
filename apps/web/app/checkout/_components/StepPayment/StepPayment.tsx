'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { PromptPayPanel } from './PromptPayPanel';
import { CardPanel } from './CardPanel';
import { useCheckoutStore } from '@/store/checkoutStore';

interface StepPaymentProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function StepPayment({ onSuccess, onBack }: StepPaymentProps) {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const router = useRouter();

  function handleRedirect(uri: string) {
    router.push(uri);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">ชำระเงิน</h2>
      {paymentMethod === 'promptpay' && <PromptPayPanel onSuccess={onSuccess} />}
      {paymentMethod === 'card' && (
        <CardPanel onSuccess={onSuccess} onRedirect={handleRedirect} />
      )}
      <Button variant="ghost" onClick={onBack} className="w-full" type="button">
        ย้อนกลับ
      </Button>
    </div>
  );
}
