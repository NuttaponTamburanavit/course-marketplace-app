export interface StatBadgeProps {
  value: string | number;
  label: string;
}

export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div
      className="rounded-xl px-6 py-4 backdrop-blur-md"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 0 0 1px rgba(93, 63, 61, 0.3)',
      }}
    >
      <p className="font-display text-4xl font-semibold leading-none text-white">{value}</p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-widest text-white/50">{label}</p>
    </div>
  );
}
