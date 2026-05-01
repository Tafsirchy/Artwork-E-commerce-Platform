// Skeleton that mirrors the exact layout of UserOrdersPage.
// Shown immediately on mount before auth hydration or API response.
export default function OrdersSkeleton() {
  return (
    <main className="bg-gallery-bg min-h-screen py-20 pb-32 animate-pulse">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="mb-16 space-y-3">
          <div className="h-3 bg-gallery-soft rounded w-32" />
          <div className="h-10 bg-gallery-soft rounded w-56" />
          <div className="h-4 bg-gallery-soft rounded w-72" />
        </div>

        {/* Filter bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gallery-border pb-6">
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 bg-gallery-soft rounded w-16" />
            ))}
          </div>
          <div className="hidden md:block h-9 bg-gallery-soft rounded w-64" />
        </div>

        {/* Order cards */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-gallery-border p-8 flex flex-col md:flex-row justify-between gap-8"
            >
              {/* Order info */}
              <div className="space-y-3 md:w-1/3">
                <div className="h-3 bg-gallery-soft rounded w-24" />
                <div className="h-5 bg-gallery-soft rounded w-48" />
                <div className="h-3 bg-gallery-soft rounded w-24" />
                <div className="h-4 bg-gallery-soft rounded w-36" />
              </div>

              {/* Image strip */}
              <div className="md:w-1/3 flex items-center gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-16 h-16 bg-gallery-soft border-2 border-white" />
                ))}
                <div className="ml-6 space-y-2">
                  <div className="h-3 bg-gallery-soft rounded w-20" />
                  <div className="h-3 bg-gallery-soft rounded w-28" />
                </div>
              </div>

              {/* Status + actions */}
              <div className="md:w-1/3 flex flex-col items-end justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gallery-soft" />
                  <div className="h-3 bg-gallery-soft rounded w-32" />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="flex-1 md:flex-none h-10 w-24 bg-gallery-soft rounded" />
                  <div className="flex-1 md:flex-none h-10 w-24 bg-gallery-soft rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
