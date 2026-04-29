"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedArtwork() {
  const featured = {
    title: "Golden Echoes of Silence",
    artist: "Elena Rodriguez",
    price: 4500,
    image: "/featured_artwork_1_1777459068644.png",
    id: "featured-1"
  };

  return (
    <section className="py-24 bg-gallery-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gallery-accent text-sm tracking-[0.3em] uppercase mb-4 font-medium">
                🧩 Featured Masterpiece
              </p>
              <h2 className="text-5xl md:text-6xl font-light text-gallery-text mb-8 leading-tight">
                Curated Pick of <br /> the Month
              </h2>
              <div className="space-y-6 mb-10">
                <div className="border-l-2 border-gallery-gold pl-6">
                  <h3 className="text-2xl font-light text-gallery-text">{featured.title}</h3>
                  <p className="text-gallery-muted italic">by {featured.artist}</p>
                </div>
                <p className="text-gallery-muted leading-relaxed max-w-md">
                  A revolutionary abstract piece that explores the intersection of silence and visual vibration. Using authentic 24k gold leaf and deep oceanic pigments.
                </p>
                <p className="text-3xl font-light text-gallery-text">${featured.price.toLocaleString()}</p>
              </div>
              
              <Link 
                href={`/products/${featured.id}`}
                className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-gallery-text border-b border-gallery-text pb-1 hover:text-gallery-accent hover:border-gallery-accent transition-all group"
              >
                View Details <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Image Container */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto group"
            >
              <div className="absolute inset-4 border border-white/20 z-10 pointer-events-none" />
              <Image 
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gallery-bg -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gallery-soft -z-10" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
