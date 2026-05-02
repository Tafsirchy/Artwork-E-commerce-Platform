"use client";

export default function TestimonialsSkeleton() {
  return (
    <section className="py-20 sm:py-28 bg-gallery-soft/30 relative overflow-hidden min-h-[600px]">
      <div className="text-center mb-12 sm:mb-20 container mx-auto px-6 flex flex-col items-center">
        <div className="w-32 h-6 bg-gray-200/50 rounded-full mb-8 animate-pulse" />
        <div className="w-64 h-12 bg-gray-200/50 rounded mb-4 animate-pulse" />
        <div className="w-48 h-12 bg-gray-200/50 rounded animate-pulse" />
      </div>

      <div className="flex gap-6 px-6 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-[300px] sm:w-[450px] h-[220px] bg-white/40 border border-black/5 animate-pulse" />
        ))}
      </div>
      
      <div className="mt-12 w-px h-20 bg-gray-200/50 mx-auto animate-pulse" />
    </section>
  );
}
