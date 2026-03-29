'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface CouponFieldProps {
  onApply: (code: string) => Promise<{ success: boolean; discount?: number; error?: string }>;
  onRemove: () => void;
  appliedCode?: string;
  discount?: number;
}

export function CouponField({ onApply, onRemove, appliedCode, discount }: CouponFieldProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError(undefined);
    const result = await onApply(code.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'ไม่สามารถใช้โค้ดนี้ได้');
    } else {
      setCode('');
    }
  }

  if (appliedCode && discount !== undefined) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-green-700">โค้ด: {appliedCode}</p>
          <p className="text-xs text-green-600">
            ส่วนลด{' '}
            {(discount / 100).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
          </p>
        </div>
        <button onClick={onRemove} className="text-sm text-red-500 hover:underline" type="button">
          ลบส่วนลด
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="กรอกโค้ดส่วนลด"
          error={error}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApply();
          }}
        />
        <Button
          onClick={handleApply}
          loading={loading}
          variant="secondary"
          className="shrink-0"
          type="button"
        >
          ใช้โค้ด
        </Button>
      </div>
    </div>
  );
}
