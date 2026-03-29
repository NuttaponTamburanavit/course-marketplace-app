'use client';

import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onFilter,
  placeholder = 'Search courses...',
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      {onFilter && (
        <button
          type="button"
          onClick={onFilter}
          aria-label="Filter courses"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            'bg-surface-container-low text-white/60 transition-colors hover:text-white',
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search courses"
          className={cn(
            'h-10 w-64 rounded-lg bg-surface-container-low',
            'pl-4 pr-10 text-sm text-white placeholder:text-white/30',
            'transition-shadow focus:outline-none',
            'focus:shadow-[inset_0_-2px_0_0_#d31027]',
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
    </div>
  );
}
