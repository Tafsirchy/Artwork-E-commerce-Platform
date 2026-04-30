"use client";

import Hero from "@/components/home/Hero";
import FeaturedArtwork from "@/components/home/FeaturedArtwork";
import ArtShelfSection from "@/components/home/shelf/ArtShelfSection";
import MainGallery from "@/components/home/MainGallery";
import ArtistStory from "@/components/home/ArtistStory";
import ValueSection from "@/components/home/ValueSection";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gallery-bg">
      {/* 🖼️ 1. Hero Section — “Gallery Entrance” */}
      <Hero />

      {/* 🧩 2. Featured Artwork (Curated Picks) */}
      <FeaturedArtwork />

      {/* 🌳 3. Artistic Shelf — "Explore the Collection" */}
      <ArtShelfSection />

      {/* 🖼️ 4. Main Gallery Grid (Core Section) + 🎭 Style Filter */}
      <MainGallery />

      {/* 👩🎨 5. Artist Story Section (Very Important) */}
      <ArtistStory />

      {/* 💎 6. Why Choose Us (Value Section) */}
      <ValueSection />

      {/* ⭐ 7. Testimonials / Reviews */}
      <Testimonials />

      {/* 📦 8. Call-To-Action (CTA Section) */}
      <CTA />

      {/* 📩 9. Newsletter / Contact */}
      <Newsletter />
    </div>
  );
}
