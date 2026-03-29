import { cn } from '@/utils/cn';

type RowVariant = 'normal' | 'discount' | 'total' | 'sub';

interface PriceSummaryRowProps {
  label: string;
  amount: number;
  variant?: RowVariant;
}

const variantClasses: Record<RowVariant, string> = {
  normal: 'text-gray-700',
  discount: 'text-green-600',
  total: 'text-gray-900 font-semibold text-base border-t pt-2',
  sub: 'text-gray-500 text-sm pl-4',
};

export function PriceSummaryRow({ label, amount, variant = 'normal' }: PriceSummaryRowProps) {
  const formatted = `${variant === 'discount' ? '-' : ''}฿${(Math.abs(amount) / 100).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <div className={cn('flex items-center justify-between py-1', variantClasses[variant])}>
      <span>{label}</span>
      <span>{formatted}</span>
    </div>
  );
}
