"use client";
import { motion } from "framer-motion";

export default function ArtShelfSkeleton() {
  return (
    <section className="relative py-20 md:py-28 bg-[#f8f6f2] overflow-hidden">
      <div className="w-11/12 mx-auto text-center mb-6 relative z-10">
        <div className="h-3 w-32 bg-gray-200 mx-auto mb-3 animate-pulse rounded" />
        <div className="h-12 w-64 bg-gray-200 mx-auto mb-4 animate-pulse rounded" />
      </div>

      <div className="relative mx-auto flex flex-col items-center justify-center" style={{ width: "min(680px, 95%)", height: "640px" }}>
        {/* Tree Trunk Placeholder */}
        <div className="w-8 h-full bg-gray-100 rounded-full animate-pulse relative">
           {/* Branches Placeholders */}
           <div className="absolute top-[20%] -left-24 w-24 h-4 bg-gray-50 rounded-full" />
           <div className="absolute top-[20%] -right-24 w-24 h-4 bg-gray-50 rounded-full" />
           <div className="absolute top-[40%] -left-32 w-32 h-5 bg-gray-50 rounded-full" />
           <div className="absolute top-[40%] -right-32 w-32 h-5 bg-gray-50 rounded-full" />
           <div className="absolute top-[60%] left-0 w-8 h-8 bg-gray-50 rounded-full" />
        </div>
        
        <div className="mt-12 h-3 w-48 bg-gray-100 rounded animate-pulse" />
      </div>
    </section>
  );
}
