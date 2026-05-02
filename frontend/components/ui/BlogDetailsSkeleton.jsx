export default function BlogDetailsSkeleton() {
  return (
    <main className="bg-white min-h-screen pb-20 sm:pb-32 animate-pulse">
      {/* Back Button Placeholder */}
      <div className="container mx-auto px-6 pt-24 sm:pt-28">
        <div className="h-4 bg-gallery-soft rounded w-32" />
      </div>

      {/* Hero Header Placeholder */}
      <section className="pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="container mx-auto px-6">
          <div className="space-y-8">
            <div className="h-3 bg-gallery-soft rounded w-48" />
            <div className="h-16 bg-gallery-soft rounded w-full sm:w-3/4" />
            <div className="h-6 bg-gallery-soft rounded w-1/2" />

            <div className="flex items-center gap-6 border-y border-gallery-border py-8">
              <div className="w-12 h-12 bg-gallery-soft rounded-none" />
              <div className="space-y-2">
                <div className="h-3 bg-gallery-soft rounded w-24" />
                <div className="h-3 bg-gallery-soft rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Placeholder */}
      <section className="container mx-auto px-6 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video bg-gallery-soft border border-gallery-border" />
        </div>
      </section>

      {/* Content Placeholder */}
      <section className="container mx-auto px-6 ">
        <div className="space-y-8">
          <div className="h-4 bg-gallery-soft rounded w-full" />
          <div className="h-4 bg-gallery-soft rounded w-full" />
          <div className="h-4 bg-gallery-soft rounded w-5/6" />
          <div className="h-24 bg-gallery-soft/30 border-l-4 border-gallery-border rounded-r" />
          <div className="h-4 bg-gallery-soft rounded w-full" />
        </div>
      </section>
    </main>
  );
}
