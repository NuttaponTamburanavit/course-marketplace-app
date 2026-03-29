'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { useCheckoutStore } from '@/store/checkoutStore';

interface BuyButtonProps {
  courseId: string;
}

export function BuyButton({ courseId }: BuyButtonProps) {
  const router = useRouter();
  const setCourseId = useCheckoutStore((s) => s.setCourseId);
  const reset = useCheckoutStore((s) => s.reset);

  function handleBuy() {
    reset();
    setCourseId(courseId);
    router.push('/checkout');
  }

  return (
    <Button size="lg" onClick={handleBuy}>
      ซื้อคอร์ส
    </Button>
  );
}
