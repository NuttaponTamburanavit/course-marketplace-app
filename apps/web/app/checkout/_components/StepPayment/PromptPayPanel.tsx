'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { PromptPaySection } from '@/components/organisms/PromptPaySection';
import { useCheckoutStore } from '@/store/checkoutStore';
import { orderApi } from '@/api/orderApi';

interface PromptPayPanelProps {
  onSuccess: () => void;
}

export function PromptPayPanel({ onSuccess }: PromptPayPanelProps) {
  const orderId = useCheckoutStore((s) => s.orderId);
  const qrUri = useCheckoutStore((s) => s.qrUri);
  const setQrUri = useCheckoutStore((s) => s.setQrUri);
  const [loading, setLoading] = useState(!qrUri);
  const [error, setError] = useState<string | null>(null);

  async function requestQr() {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await orderApi.payPromptPay(orderId);
      setQrUri(result.qrUri);
    } catch {
      setError('ไม่สามารถสร้าง QR Code ได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!qrUri) requestQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!orderId || !qrUri) return null;

  return (
    <PromptPaySection
      orderId={orderId}
      qrUri={qrUri}
      onSuccess={onSuccess}
      onNewQr={requestQr}
    />
  );
}
