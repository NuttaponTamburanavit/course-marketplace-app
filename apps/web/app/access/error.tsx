'use client';

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-4xl">❌</p>
      <h2 className="text-xl font-semibold text-gray-900">ไม่สามารถเข้าถึงคอร์สได้</h2>
      <Link href="/">
        <Button>กลับหน้าหลัก</Button>
      </Link>
    </div>
  );
}
