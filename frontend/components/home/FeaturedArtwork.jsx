"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";

const featuredItems = [
  {
    title: "Celestial Bloom",
    artist: "Elias Vance",
    price: "$2,400",
    image: "/featured_artwork_1_1777459068644.png",
    category: "Abstract"
  },
  {
    title: "The Silent Canvas",
    artist: "Sarah Thorne",
    price: "$1,850",
    image: "/gallery_hero_bg_1777459017637.png",
    category: "Minimalism"
  }
];

export default function FeaturedArtwork() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-gallery-accent text-sm tracking-[0.5em] uppercase mb-6">
              🧩 The Curator's Eye
            </p>
            <h2 className="text-6xl font-light text-gallery-text leading-tight">
              Opening the Doors <br /> to <span className="italic">Hidden Beauty</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-right"
          >
            <p className="text-gallery-muted max-w-sm ml-auto mb-8 text-lg font-light leading-relaxed">
              Hand-picked masterpieces that don't just occupy space—they transform it. Hover to witness the bloom.
            </p>
            <Link href="/products" className="text-xs tracking-[0.3em] uppercase text-gallery-gold hover:text-gallery-text transition-colors border-b border-gallery-gold/30 pb-2">
              View All Masterpieces
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {featuredItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="relative group cursor-none"
            >
              {/* The "Opening Door" Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gallery-soft">
                {/* Main Image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* The Shutter/Door Effect (Overlay) */}
                <div className="absolute inset-0 flex flex-col pointer-events-none">
                  <motion.div 
                    className="flex-1 bg-gallery-primary/95 transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:-translate-y-full"
                  />
                  <motion.div 
                    className="flex-1 bg-gallery-primary/95 transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:translate-y-full"
                  />
                </div>

                {/* Centered Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Eye className="text-white" size={32} strokeWidth={1} />
                  </div>
                </div>

                {/* Category Label */}
                <div className="absolute top-8 left-8 z-20">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] tracking-[0.3em] uppercase border border-white/20">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Text Content (Appears as if Blooming below) */}
              <div className="mt-10 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-light text-gallery-text tracking-wider uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gallery-muted text-sm tracking-widest uppercase italic">
                    By {item.artist}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-gallery-gold mb-4">{item.price}</p>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gallery-soft flex items-center justify-center rounded-full hover:bg-gallery-primary hover:text-white transition-colors"
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
