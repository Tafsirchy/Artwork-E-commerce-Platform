// Skeleton that mirrors the exact layout of CustomerDashboard.
// Renders immediately on mount — no loading spinner, no blank flash.
export default function DashboardSkeleton() {
  return (
    <section className="bg-gallery-bg min-h-screen py-24 animate-pulse">
      <div className="container mx-auto px-6 max-w-[1600px] flex flex-col lg:flex-row gap-12">

        {/* Sidebar skeleton */}
        <aside className="lg:w-72 shrink-0 space-y-6">
          <div className="bg-white border border-gallery-border p-8 space-y-6">
            <div className="w-20 h-20 rounded-full bg-gallery-soft mx-auto" />
            <div className="space-y-3">
              <div className="h-5 bg-gallery-soft rounded w-3/4 mx-auto" />
              <div className="h-3 bg-gallery-soft rounded w-1/2 mx-auto" />
            </div>
            <div className="space-y-2 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gallery-soft rounded" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main area skeleton */}
        <div className="flex-1 space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="h-10 bg-gallery-soft rounded w-64" />
            <div className="h-4 bg-gallery-soft rounded w-80" />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-10 bg-white border border-gallery-border space-y-4">
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-gallery-soft rounded" />
                  <div className="h-8 w-12 bg-gallery-soft rounded" />
                </div>
                <div className="h-3 bg-gallery-soft rounded w-1/2" />
              </div>
            ))}
          </div>

          {/* Orders */}
          <div className="space-y-4">
            <div className="h-4 bg-gallery-soft rounded w-40 mb-6" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white border border-gallery-border flex justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gallery-soft rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gallery-soft rounded w-32" />
                    <div className="h-3 bg-gallery-soft rounded w-20" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-5 bg-gallery-soft rounded w-20 ml-auto" />
                  <div className="h-6 bg-gallery-soft rounded w-16 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
