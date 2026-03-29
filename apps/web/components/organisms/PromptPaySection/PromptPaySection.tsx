'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Countdown } from '@/components/atoms/Countdown';
import { Spinner } from '@/components/atoms/Spinner';
import { QrCode } from '@/components/molecules/QrCode';
import { usePromptPayPolling } from '@/hooks/usePromptPayPolling';

interface PromptPaySectionProps {
  orderId: string;
  qrUri: string;
  onSuccess: () => void;
  onNewQr: () => void;
}

export function PromptPaySection({ orderId, qrUri, onSuccess, onNewQr }: PromptPaySectionProps) {
  const { error, isPolling } = usePromptPayPolling({ orderId, onSuccess });
  const [expired, setExpired] = useState(false);

  if (expired) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-gray-600">QR Code หมดอายุแล้ว</p>
        <Button onClick={onNewQr}>สร้าง QR ใหม่</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <QrCode downloadUri={qrUri} size={200} />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">หมดอายุใน:</span>
        <Countdown seconds={600} onExpire={() => setExpired(true)} />
      </div>
      {error && <p className="text-sm text-gray-500">กำลังตรวจสอบ...</p>}
      {isPolling && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" />
          <span>กำลังรอการยืนยัน...</span>
        </div>
      )}
    </div>
  );
}
