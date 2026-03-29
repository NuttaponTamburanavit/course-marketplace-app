'use client';

import { Button } from '@/components/atoms/Button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold text-gray-900">เกิดข้อผิดพลาด</h2>
      <p className="text-gray-600">กรุณาลองใหม่อีกครั้ง</p>
      <Button onClick={reset}>ลองใหม่</Button>
    </div>
  );
}
