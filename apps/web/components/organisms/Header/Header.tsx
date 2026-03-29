import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-sm font-bold uppercase tracking-widest text-white"
        >
          Course Marketplace
        </Link>

        {/* Primary nav */}
        <nav aria-label="Primary navigation" className="ml-12 flex items-center gap-8">
          <Link
            href="/"
            className="border-b-2 border-primary pb-0.5 text-sm text-white/90 transition-colors hover:text-white"
          >
            Explore
          </Link>
          <Link href="/access" className="text-sm text-white/60 transition-colors hover:text-white">
            My Learning
          </Link>
          <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
            Mentors
          </Link>
          <Link href="#" className="text-sm text-white/60 transition-colors hover:text-white">
            Resources
          </Link>
        </nav>

        {/* Right icon cluster */}
        <div className="ml-auto flex items-center gap-5 text-white/50">
          {/* Cart */}
          <button type="button" aria-label="Cart" className="transition-colors hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          {/* Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Avatar */}
          <div
            aria-label="User menu"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-bright text-xs font-semibold text-white"
          >
            U
          </div>
        </div>
      </div>
    </header>
  );
}
