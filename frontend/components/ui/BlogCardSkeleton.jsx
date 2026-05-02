export default function BlogCardSkeleton() {
  return (
    <div className="group space-y-6">
      {/* Image placeholder with Shimmer */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gallery-soft border border-gallery-border shadow-sm">
        <div className="absolute inset-0 shimmer-bg" />
      </div>
      
      {/* Text placeholders with varied pulse delays */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="h-3 bg-gallery-soft rounded w-24 animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="h-3 bg-gallery-soft rounded w-24 animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="h-8 bg-gallery-soft rounded w-full sm:w-3/4 animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="space-y-2">
          <div className="h-4 bg-gallery-soft rounded w-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="h-4 bg-gallery-soft rounded w-5/6 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="pt-2 sm:pt-4">
          <div className="h-4 bg-gallery-soft rounded w-28 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  );
}
