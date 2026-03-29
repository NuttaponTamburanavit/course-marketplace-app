'use client';

import { Button } from '@/components/atoms/Button';
import { CouponField } from '@/components/molecules/CouponField';
import { useCheckoutStore } from '@/store/checkoutStore';
import { couponApi } from '@/api/couponApi';

interface StepCouponProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepCoupon({ onNext, onBack }: StepCouponProps) {
  const courseId = useCheckoutStore((s) => s.courseId);
  const coupon = useCheckoutStore((s) => s.coupon);
  const setCoupon = useCheckoutStore((s) => s.setCoupon);

  async function handleApply(code: string) {
    try {
      const result = await couponApi.validateCoupon({ code, courseId: courseId ?? '' });
      if (result.valid) {
        setCoupon({ code: result.code, discount: result.discount });
        return { success: true, discount: result.discount };
      }
      return { success: false, error: result.error ?? 'ไม่สามารถใช้โค้ดนี้ได้' };
    } catch {
      return { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">โค้ดส่วนลด (ไม่บังคับ)</h2>
      <CouponField
        onApply={handleApply}
        onRemove={() => setCoupon(null)}
        appliedCode={coupon?.code}
        discount={coupon?.discount}
      />
      <div className="flex gap-3 mt-2">
        <Button variant="ghost" onClick={onBack} className="flex-1" type="button">
          ย้อนกลับ
        </Button>
        <Button onClick={onNext} className="flex-1" type="button">
          {coupon ? 'ถัดไป' : 'ข้าม'}
        </Button>
      </div>
    </div>
  );
}
