import { cn } from '@/utils/cn';

type OrderStatus =
  | 'created'
  | 'pending_payment'
  | 'processing_3ds'
  | 'paid'
  | 'access_granted'
  | 'cancelled'
  | 'failed';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  created: { label: 'สร้างแล้ว', className: 'bg-gray-100 text-gray-700' },
  pending_payment: { label: 'รอชำระเงิน', className: 'bg-yellow-100 text-yellow-700' },
  processing_3ds: { label: 'กำลังยืนยัน', className: 'bg-blue-100 text-blue-700' },
  paid: { label: 'ชำระแล้ว', className: 'bg-green-100 text-green-700' },
  access_granted: { label: 'เข้าเรียนได้', className: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'ยกเลิก', className: 'bg-gray-100 text-gray-500' },
  failed: { label: 'ล้มเหลว', className: 'bg-red-100 text-red-700' },
};

type StatusBadgeProps = {
  variant?: 'status';
  status: OrderStatus;
};

type TagBadgeProps = {
  variant: 'tag';
  children: string;
};

type BadgeProps = StatusBadgeProps | TagBadgeProps;

export function Badge(props: BadgeProps) {
  if (props.variant === 'tag') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5',
          'text-[0.65rem] font-medium uppercase tracking-wider',
          'bg-surface-bright text-white/80',
        )}
      >
        {props.children}
      </span>
    );
  }

  const config = statusConfig[props.status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
