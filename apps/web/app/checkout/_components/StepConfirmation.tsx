'use client';

import { useCheckoutStore } from '@/store/checkoutStore';

export function StepConfirmation() {
  const orderId = useCheckoutStore((s) => s.orderId);
  const customerInfo = useCheckoutStore((s) => s.customerInfo);

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <span className="text-3xl">✅</span>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">ชำระเงินสำเร็จ!</h2>
        <p className="text-gray-600 mt-1">ขอบคุณสำหรับการสั่งซื้อ</p>
      </div>
      {orderId && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 w-full">
          <p className="text-sm text-gray-500">หมายเลขคำสั่งซื้อ</p>
          <p className="font-mono font-semibold text-gray-900">{orderId}</p>
        </div>
      )}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 w-full text-left">
        <p className="text-sm text-blue-700 font-medium">ขั้นตอนถัดไป</p>
        <ul className="mt-2 text-sm text-blue-600 list-disc list-inside space-y-1">
          <li>เราจะส่งลิงก์เข้าเรียนไปที่ {customerInfo?.email ?? 'อีเมลของคุณ'}</li>
          <li>ใบกำกับภาษีจะถูกออกภายใน 7 วันทำการ</li>
          <li>สามารถเข้าเรียนได้ทันทีผ่านลิงก์ในอีเมล</li>
        </ul>
      </div>
    </div>
  );
}
