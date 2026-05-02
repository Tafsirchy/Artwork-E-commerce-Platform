export default function AdminTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search/Filter bar placeholder */}
      <div className="flex justify-between items-center mb-10">
        <div className="h-10 bg-gallery-soft rounded w-64" />
        <div className="h-12 bg-gallery-soft rounded w-40" />
      </div>

      {/* Grid placeholder for mobile */}
      <div className="grid grid-cols-1 md:hidden gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gallery-border p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gallery-soft rounded" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gallery-soft rounded w-3/4" />
                <div className="h-3 bg-gallery-soft rounded w-1/2" />
              </div>
            </div>
            <div className="h-8 bg-gallery-soft rounded w-full" />
          </div>
        ))}
      </div>

      {/* Table placeholder for desktop */}
      <div className="hidden md:block bg-white border border-gallery-border overflow-hidden">
        <div className="h-14 bg-gallery-soft border-b border-gallery-border" />
        <div className="divide-y divide-gallery-border">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center px-6 py-4 gap-8">
              <div className="w-12 h-12 bg-gallery-soft shrink-0" />
              <div className="h-4 bg-gallery-soft rounded w-1/4" />
              <div className="h-4 bg-gallery-soft rounded w-16" />
              <div className="h-4 bg-gallery-soft rounded w-16" />
              <div className="h-4 bg-gallery-soft rounded w-24" />
              <div className="flex gap-2 ml-auto">
                <div className="w-10 h-10 bg-gallery-soft rounded" />
                <div className="w-10 h-10 bg-gallery-soft rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
