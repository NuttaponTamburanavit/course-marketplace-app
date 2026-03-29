import Link from 'next/link';

const TRACKS = ['Front-end', 'Distributed Systems', 'AI & ML'] as const;
const ACADEMY = ['Pricing', 'Enterprise', 'Hall of Fame'] as const;
const SOCIAL = ['X (Twitter)', 'GitHub', 'YouTube'] as const;

export function Footer() {
  return (
    <footer className="bg-surface pb-8 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Course Marketplace
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Precision-engineered education for the next generation of software architects and
              systems designers.
            </p>
          </div>

          {/* Tracks */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Tracks</p>
            <ul className="mt-4 space-y-3">
              {TRACKS.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Academy</p>
            <ul className="mt-4 space-y-3">
              {ACADEMY.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Social</p>
            <ul className="mt-4 space-y-3">
              {SOCIAL.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-white/30 sm:flex-row">
          <p>© 2026 Course Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-white/60">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white/60">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
