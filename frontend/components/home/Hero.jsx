"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gallery_hero_bg_1777459017637.png"
          alt="Modern Gallery"
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-gallery-bg" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-sm tracking-[0.4em] uppercase text-white mb-6 drop-shadow-md"
        >
          Gallery Entrance
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-6xl md:text-8xl font-light text-white leading-none mb-8 drop-shadow-xl"
        >
          Unveil the <br />
          <span className="italic text-gallery-accent">Unseen.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-white/90 max-w-xl mx-auto mb-12 leading-relaxed drop-shadow-md"
        >
          Step into a curated digital sanctuary where every brushstroke tells a story. Discover exclusive original artworks from the world's most visionary artists.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/products"
            className="flex items-center gap-2 px-12 py-4 bg-white text-gallery-primary text-sm tracking-widest uppercase rounded hover:bg-gallery-accent hover:text-white transition-all group shadow-2xl"
          >
            Explore Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-12 py-4 border border-white/40 text-white text-sm tracking-widest uppercase rounded backdrop-blur-md hover:bg-white/10 transition-all shadow-xl"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-white/30 origin-center"
      />
    </section>
  );
}
