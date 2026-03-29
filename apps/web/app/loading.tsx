export default function Loading() {
  return (
    <div className="bg-surface">
      {/* Hero skeleton */}
      <div className="px-6 pb-24 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 h-5 w-28 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="mb-2 h-14 w-2/3 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mb-5 h-14 w-1/2 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="mb-2 h-4 w-80 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="mb-10 h-4 w-64 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="flex gap-4">
            <div className="h-20 w-40 animate-pulse rounded-xl bg-white/[0.06]" />
            <div className="h-20 w-40 animate-pulse rounded-xl bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Course grid skeleton */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-7 w-56 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-[1.5rem] bg-surface-container-low">
                <div className="aspect-video animate-pulse bg-white/[0.06]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
