"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MoveUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-48 bg-gallery-primary relative overflow-hidden group">
      {/* Dynamic Background: Blooming Gradient */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-radial-gradient from-gallery-gold/30 via-transparent to-transparent pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center mb-10">
            <div className="w-px h-24 bg-gradient-to-b from-gallery-gold/0 via-gallery-gold to-gallery-gold/0" />
          </div>

          <p className="text-gallery-gold text-sm tracking-[0.6em] uppercase mb-10">
            📦 The Journey Awaits
          </p>
          
          <h2 className="text-6xl md:text-8xl font-light text-white mb-16 leading-[1.1]">
            Find the Piece That <br />
            <span className="italic relative">
              Resonates With You
              <motion.div 
                className="absolute -bottom-4 left-0 w-0 h-[1px] bg-gallery-gold transition-all duration-1000 group-hover:w-full"
              />
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            <Link
              href="/products"
              className="relative group/link px-16 py-6 bg-white text-gallery-primary text-xs tracking-[0.4em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Explore the Void <MoveUpRight size={18} strokeWidth={1.5} />
              </span>
              <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover/link:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <Link
              href="/register"
              className="group/link flex items-center gap-4 text-white text-[11px] tracking-[0.5em] uppercase hover:text-gallery-gold transition-colors"
            >
              Start Your Collection
              <div className="w-10 h-[1px] bg-white group-hover/link:bg-gallery-gold group-hover/link:w-16 transition-all duration-500" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Subtle Corner Accents */}
      <div className="absolute top-10 left-10 text-[10px] text-white/10 tracking-[0.5em] uppercase vertical-text hidden lg:block">
        Est. 2026 — Artifact
      </div>
    </section>
  );
}
