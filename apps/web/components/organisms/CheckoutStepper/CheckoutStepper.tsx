import { cn } from '@/utils/cn';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'ข้อมูลลูกค้า' },
  { number: 2, label: 'ใบกำกับภาษี' },
  { number: 3, label: 'คูปอง' },
  { number: 4, label: 'สรุปยอด' },
  { number: 5, label: 'ชำระเงิน' },
  { number: 6, label: 'ยืนยัน' },
];

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav aria-label="ขั้นตอนการชำระเงิน" className="w-full">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          return (
            <li key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isCompleted && 'bg-brand-600 text-white',
                    isCurrent && 'bg-brand-600 text-white ring-4 ring-brand-100',
                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span
                  className={cn(
                    'hidden text-xs sm:block',
                    isCurrent ? 'text-brand-600 font-medium' : 'text-gray-500',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn('h-0.5 flex-1 mx-2', isCompleted ? 'bg-brand-600' : 'bg-gray-200')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
