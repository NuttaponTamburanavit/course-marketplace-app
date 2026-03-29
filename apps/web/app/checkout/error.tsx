'use client';

import { Button } from '@/components/atoms/Button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold">เกิดข้อผิดพลาดในการชำระเงิน</h2>
      <Button onClick={reset}>ลองใหม่</Button>
    </div>
  );
}
