import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        id={id}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
          error
            ? 'border-red-500 focus:ring-red-500 bg-red-50'
            : 'border-gray-300 focus:border-brand-500 bg-white',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={id ? `${id}-error` : undefined} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
