import { StatBadge } from '@/components/atoms/StatBadge';

interface HeroSectionProps {
  activeCourseCount: number;
  engineerCount: number;
}

export function HeroSection({ activeCourseCount, engineerCount }: HeroSectionProps) {
  const engineerDisplay = engineerCount > 0 ? `${engineerCount}k` : '0';

  return (
    <section className="relative overflow-hidden bg-surface px-6 pb-24 pt-20">
      {/* Ambient red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 70% at 0% 50%, rgba(211, 16, 39, 0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Category chip */}
        <span className="inline-flex items-center rounded-full border border-primary-container/40 bg-primary-container/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
          Academy Catalog
        </span>

        {/* Headline */}
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1.1] text-white md:text-6xl">
          Master the
          <br />
          <span className="text-primary">Professional</span> Skill.
        </h1>

        {/* Subtext */}
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
          Elevate your engineering craft with surgical-grade curriculum designed for the modern web
          frontier.
        </p>

        {/* Stat badges */}
        <div className="mt-10 flex flex-wrap gap-4">
          <StatBadge value={activeCourseCount} label="Active Courses" />
          <StatBadge value={engineerDisplay} label="Engineers" />
        </div>
      </div>
    </section>
  );
}
