export default function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gallery-bg p-6 sm:p-8 pt-12 sm:pt-20 animate-pulse">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
        
        {/* Sidebar Profile Placeholder */}
        <div className="w-full lg:w-72 bg-white border border-gallery-border p-8 shrink-0">
          <div className="w-20 h-20 rounded-full bg-gallery-soft mx-auto mb-6" />
          <div className="space-y-3 mb-8">
            <div className="h-5 bg-gallery-soft rounded w-3/4 mx-auto" />
            <div className="h-3 bg-gallery-soft rounded w-1/2 mx-auto" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gallery-soft rounded w-full" />
            ))}
          </div>
        </div>

        {/* Main Content Area Placeholder */}
        <div className="flex-1 w-full space-y-12">
          <div className="space-y-3">
            <div className="h-10 bg-gallery-soft rounded w-64" />
            <div className="h-4 bg-gallery-soft rounded w-80" />
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white border border-gallery-border p-8 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-gallery-soft shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-gallery-soft rounded w-1/2" />
                  <div className="h-6 bg-gallery-soft rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>

          {/* Action grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white border border-gallery-border p-10 space-y-4">
                <div className="h-6 bg-gallery-soft rounded w-3/4" />
                <div className="h-16 bg-gallery-soft rounded w-full" />
              </div>
            ))}
          </div>

          {/* Promotion box */}
          <div className="h-64 bg-white border border-gallery-border p-10 space-y-8">
             <div className="h-4 bg-gallery-soft rounded w-48 border-b border-gallery-border pb-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="h-24 bg-gallery-soft rounded" />
                <div className="h-24 bg-gallery-soft rounded" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
