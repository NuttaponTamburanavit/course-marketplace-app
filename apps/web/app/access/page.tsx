import { redirect } from 'next/navigation';
import { Spinner } from '@/components/atoms/Spinner';

interface Props {
  searchParams: { token?: string };
}

export default async function AccessPage({ searchParams }: Props) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-4xl">🔒</p>
        <h2 className="text-xl font-semibold text-gray-900">ลิงก์ไม่ถูกต้อง</h2>
        <p className="text-gray-600">กรุณาตรวจสอบลิงก์ในอีเมลอีกครั้ง</p>
      </div>
    );
  }

  // Verify token with backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${API_URL}/access?token=${token}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Invalid token');
    const data = (await res.json()) as { data: { courseUrl: string } };
    redirect(data.data.courseUrl);
  } catch {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-4xl">❌</p>
        <h2 className="text-xl font-semibold text-gray-900">ลิงก์หมดอายุหรือไม่ถูกต้อง</h2>
        <p className="text-gray-600">กรุณาติดต่อฝ่ายสนับสนุน หรือขอลิงก์ใหม่</p>
      </div>
    );
  }
}
