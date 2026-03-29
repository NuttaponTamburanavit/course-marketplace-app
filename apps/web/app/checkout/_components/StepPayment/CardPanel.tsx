'use client';

import { useState } from 'react';
import { OmiseCardForm } from '@/components/organisms/OmiseCardForm';
import { useCheckoutStore } from '@/store/checkoutStore';
import { orderApi } from '@/api/orderApi';

const MAX_RETRIES = 3;

const OMISE_ERROR_MAP: Record<string, string> = {
  insufficient_fund: 'ยอดเงินในบัตรไม่เพียงพอ',
  stolen_or_lost_card: 'บัตรถูกแจ้งหาย',
  failed_processing: 'การชำระเงินล้มเหลว กรุณาลองใหม่',
  invalid_card_token: 'ข้อมูลบัตรไม่ถูกต้อง',
  card_declined: 'บัตรถูกปฏิเสธ กรุณาติดต่อธนาคาร',
};

interface CardPanelProps {
  onSuccess: () => void;
  onRedirect: (uri: string) => void;
}

export function CardPanel({ onSuccess, onRedirect }: CardPanelProps) {
  const orderId = useCheckoutStore((s) => s.orderId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);

  async function handleToken(token: string) {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await orderApi.payCard(orderId, { omiseToken: token });
      if (result.authorizeUri) {
        onRedirect(result.authorizeUri);
      } else if (result.status === 'successful') {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'failed_processing';
      const thaiError = OMISE_ERROR_MAP[message] ?? 'การชำระเงินล้มเหลว กรุณาลองใหม่';
      const next = retries + 1;
      setRetries(next);
      if (next >= MAX_RETRIES) {
        setError(
          `${thaiError} (ลองใหม่ได้ ${MAX_RETRIES - next} ครั้ง — กรุณาติดต่อธนาคาร)`,
        );
      } else {
        setError(thaiError);
      }
    } finally {
      setLoading(false);
    }
  }

  const publicKey = process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY ?? '';

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
          {retries > 0 && (
            <p className="text-xs text-red-500 mt-1">
              ครั้งที่ {retries}/{MAX_RETRIES}
            </p>
          )}
        </div>
      )}
      {retries < MAX_RETRIES ? (
        <OmiseCardForm publicKey={publicKey} onToken={handleToken} loading={loading} />
      ) : (
        <p className="text-center text-gray-600">
          ลองใหม่ครบจำนวนแล้ว กรุณาติดต่อธนาคารหรือเลือกวิธีชำระเงินอื่น
        </p>
      )}
    </div>
  );
}
