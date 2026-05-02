import BlogCardSkeleton from "@/components/ui/BlogCardSkeleton";

export default function Loading() {
  return (
    <main className="bg-gallery-bg min-h-screen py-16 sm:py-32">
      <div className="container mx-auto px-6">
        {/* Mirror the Blog Page Header */}
        <div className="text-center mb-16 sm:mb-24">
           <div className="h-3 bg-gallery-soft rounded w-32 mx-auto mb-6 animate-pulse" />
           <div className="h-16 bg-gallery-soft rounded w-3/4 mx-auto mb-8 animate-pulse" />
           <div className="h-4 bg-gallery-soft rounded w-1/2 mx-auto animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>
    </main>
  );
}
