'use client';

import { useRef } from 'react';
import Script from 'next/script';
import { Button } from '@/components/atoms/Button';

interface OmiseCardFormProps {
  publicKey: string;
  onToken: (token: string) => Promise<void>;
  loading?: boolean;
}

declare global {
  interface Window {
    Omise?: {
      setPublicKey: (key: string) => void;
      createToken: (
        type: string,
        card: Record<string, string>,
        callback: (statusCode: number, response: { id?: string; message?: string }) => void,
      ) => void;
    };
  }
}

export function OmiseCardForm({ publicKey, onToken, loading = false }: OmiseCardFormProps) {
  const numberRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const expiryMonthRef = useRef<HTMLInputElement>(null);
  const expiryYearRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!window.Omise) return;
    window.Omise.setPublicKey(publicKey);
    window.Omise.createToken(
      'card',
      {
        number: numberRef.current?.value ?? '',
        name: nameRef.current?.value ?? '',
        expiration_month: expiryMonthRef.current?.value ?? '',
        expiration_year: expiryYearRef.current?.value ?? '',
        security_code: cvvRef.current?.value ?? '',
      },
      async (statusCode, response) => {
        if (statusCode === 200 && response.id) {
          await onToken(response.id);
        }
      },
    );
  }

  return (
    <>
      <Script src="https://cdn.omise.co/omise.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">หมายเลขบัตร</label>
          <input
            ref={numberRef}
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">ชื่อบนบัตร</label>
          <input
            ref={nameRef}
            type="text"
            placeholder="ชื่อ นามสกุล (ภาษาอังกฤษ)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700">เดือนหมดอายุ</label>
            <input
              ref={expiryMonthRef}
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700">ปีหมดอายุ</label>
            <input
              ref={expiryYearRef}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="YYYY"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-gray-700">CVV</label>
            <input
              ref={cvvRef}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="CVV"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <Button type="submit" loading={loading} size="lg" className="w-full">
          ชำระเงิน
        </Button>
      </form>
    </>
  );
}
