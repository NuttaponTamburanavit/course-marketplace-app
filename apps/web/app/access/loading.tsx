import { Spinner } from '@/components/atoms/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Spinner size="lg" />
      <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
    </div>
  );
}
