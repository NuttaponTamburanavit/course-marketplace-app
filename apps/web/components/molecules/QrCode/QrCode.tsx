'use client';

import Image from 'next/image';

interface QrCodeProps {
  downloadUri: string;
  size?: number;
}

export function QrCode({ downloadUri, size = 200 }: QrCodeProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
      <Image
        src={downloadUri}
        alt="QR Code สำหรับชำระเงิน PromptPay"
        width={size}
        height={size}
        unoptimized
      />
    </div>
  );
}
