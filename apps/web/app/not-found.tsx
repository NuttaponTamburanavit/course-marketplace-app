import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h2 className="text-xl font-semibold text-gray-900">ไม่พบหน้าที่คุณต้องการ</h2>
      <Link href="/">
        <Button>กลับหน้าหลัก</Button>
      </Link>
    </div>
  );
}
