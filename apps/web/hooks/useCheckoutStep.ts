import { useCheckoutStore } from '@/store/checkoutStore';

export function useCheckoutStep() {
  const currentStep = useCheckoutStore((s) => s.currentStep);
  const setStep = useCheckoutStore((s) => s.setStep);
  const nextStep = () => setStep(Math.min(currentStep + 1, 6));
  const prevStep = () => setStep(Math.max(currentStep - 1, 1));
  return { currentStep, nextStep, prevStep, setStep };
}
