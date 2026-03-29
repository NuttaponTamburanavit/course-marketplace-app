import { PriceSummaryRow } from '@/components/molecules/PriceSummaryRow';

export interface PricingBreakdown {
  listPrice: number;
  couponDiscount: number;
  paidAmount: number;
  amountExclVat: number;
  vatAmount: number;
}

interface PriceSummaryTableProps {
  pricing: PricingBreakdown;
  courseName?: string;
}

export function PriceSummaryTable({ pricing, courseName }: PriceSummaryTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {courseName && <p className="mb-3 font-medium text-gray-900">{courseName}</p>}
      <div className="flex flex-col">
        <PriceSummaryRow label="ราคาคอร์ส" amount={pricing.listPrice} />
        {pricing.couponDiscount > 0 && (
          <PriceSummaryRow
            label="ส่วนลดคูปอง"
            amount={pricing.couponDiscount}
            variant="discount"
          />
        )}
        <PriceSummaryRow label="ราคาจ่ายจริง" amount={pricing.paidAmount} variant="total" />
        <PriceSummaryRow label="ราคาก่อน VAT" amount={pricing.amountExclVat} variant="sub" />
        <PriceSummaryRow label="VAT 7%" amount={pricing.vatAmount} variant="sub" />
      </div>
    </div>
  );
}
