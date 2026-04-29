export default function ProductCardSkeleton() {
  return (
    <div className="bg-gallery-surface border border-gallery-border overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/5] w-full bg-gallery-soft" />
      {/* Text placeholders */}
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gallery-soft rounded w-3/4" />
        <div className="h-4 bg-gallery-soft rounded w-1/2" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-5 bg-gallery-soft rounded w-1/4" />
          <div className="h-10 w-10 bg-gallery-soft rounded-full" />
        </div>
      </div>
    </div>
  );
}
