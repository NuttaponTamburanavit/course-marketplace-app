import { Spinner } from '@/components/atoms/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
