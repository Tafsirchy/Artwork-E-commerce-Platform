export default function FeaturedSkeleton() {
  return (
    <section className="py-28 bg-gallery-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
          <div className="space-y-6 w-full md:w-1/2">
            <div className="h-4 bg-gallery-soft rounded w-32 animate-pulse" />
            <div className="h-12 bg-gallery-soft rounded w-3/4 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="h-12 bg-gallery-soft rounded w-1/2 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="space-y-4 w-full md:w-1/3">
            <div className="h-4 bg-gallery-soft rounded w-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="h-4 bg-gallery-soft rounded w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="h-4 bg-gallery-soft rounded w-1/2 mt-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        <div className="bg-gallery-soft/30 py-12 px-6 md:px-12 lg:px-24 rounded-sm grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Col */}
          <div className="flex flex-col gap-8">
            <div className="aspect-[4/3] bg-gallery-soft rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 shimmer-bg" />
            </div>
            <div className="aspect-[3/2] bg-gallery-soft rounded-sm overflow-hidden relative">
               <div className="absolute inset-0 shimmer-bg" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
          {/* Middle Col */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4 text-center py-6">
              <div className="h-6 bg-gallery-soft rounded w-3/4 mx-auto animate-pulse" style={{ animationDelay: '0.6s' }} />
              <div className="h-4 bg-gallery-soft rounded w-full animate-pulse" style={{ animationDelay: '0.7s' }} />
              <div className="h-4 bg-gallery-soft rounded w-2/3 mx-auto animate-pulse" style={{ animationDelay: '0.8s' }} />
            </div>
            <div className="aspect-[3/2] bg-gallery-soft rounded-sm overflow-hidden relative">
               <div className="absolute inset-0 shimmer-bg" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
          {/* Right Col */}
          <div className="aspect-[3/4] lg:h-full bg-gallery-soft rounded-sm overflow-hidden relative">
             <div className="absolute inset-0 shimmer-bg" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
