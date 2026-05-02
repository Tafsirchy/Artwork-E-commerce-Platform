export default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gallery-bg pb-12 md:py-12 px-0 sm:px-4 md:px-6 flex flex-col items-center">
      <div className="w-full bg-gallery-surface md:border md:border-gallery-border shadow-sm flex flex-col md:flex-row overflow-hidden relative">
        
        {/* 🖼️ Visual Column Placeholder */}
        <div className="w-full md:w-1/2 bg-gallery-soft md:border-r border-gallery-border/50 flex flex-col items-center relative">
          <div className="relative w-full aspect-[4/5] sm:aspect-square bg-gallery-soft overflow-hidden">
             <div className="absolute inset-0 shimmer-bg" />
          </div>
          <div className="w-full px-8 py-10 space-y-6">
            <div className="h-3 bg-gallery-soft rounded w-24 animate-pulse" />
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full bg-gallery-soft animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* 🖋️ Details Section Placeholder */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="h-3 bg-gallery-soft rounded w-20 hidden md:block animate-pulse" />
            <div className="h-12 bg-gallery-soft rounded w-3/4 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-6 bg-gallery-soft rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>

          <div className="space-y-4 pt-10 border-t border-gallery-border/30">
            <div className="h-3 bg-gallery-soft rounded w-32 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="space-y-2">
              <div className="h-4 bg-gallery-soft rounded w-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="h-4 bg-gallery-soft rounded w-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="h-4 bg-gallery-soft rounded w-2/3 animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>

          <div className="hidden md:flex pt-10 border-t border-gallery-border/50 mt-auto items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gallery-soft rounded w-24 animate-pulse" style={{ animationDelay: '0.7s' }} />
              <div className="h-3 bg-gallery-soft rounded w-32 animate-pulse" style={{ animationDelay: '0.8s' }} />
            </div>
            <div className="h-16 bg-gallery-soft rounded w-1/2 animate-pulse" style={{ animationDelay: '0.9s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
