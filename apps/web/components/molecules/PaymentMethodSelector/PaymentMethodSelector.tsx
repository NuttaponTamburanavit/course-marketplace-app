'use client';

import { cn } from '@/utils/cn';

type PaymentMethod = 'promptpay' | 'card';

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

const methods: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    value: 'promptpay',
    label: 'PromptPay',
    description: 'สแกน QR Code ด้วยแอปธนาคาร',
    icon: '📱',
  },
  { value: 'card', label: 'บัตรเครดิต/เดบิต', description: 'Visa, Mastercard, JCB', icon: '💳' },
];

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">เลือกวิธีชำระเงิน</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {methods.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange(method.value)}
            className={cn(
              'flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors',
              value === method.value
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300 bg-white',
            )}
            aria-pressed={value === method.value}
          >
            <span className="text-2xl">{method.icon}</span>
            <div>
              <p className="font-medium text-gray-900">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
