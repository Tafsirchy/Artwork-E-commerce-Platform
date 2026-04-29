"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const shards = [
  { top: "0%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 0, 101% 0, 101% 101%, 0 101%)" },
  { top: "0%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% 0, 101% 0, 101% 101%, -1% 101%)" },
  { top: "0%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% 0, 100% 0, 100% 101%, -1% 101%)" },
  { top: "33.333%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 -1%, 101% -1%, 101% 101%, 0 101%)" },
  { top: "33.333%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)" },
  { top: "33.333%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 100% -1%, 100% 101%, -1% 101%)" },
  { top: "66.666%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 -1%, 101% -1%, 101% 100%, 0 100%)" },
  { top: "66.666%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 101% -1%, 101% 100%, -1% 100%)" },
  { top: "66.666%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 100% -1%, 100% 100%, -1% 100%)" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1705711714839-cf327143c4a0?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop"
];

const layoutSlots = [
  { id: "A", class: "absolute top-0 right-0 w-[50%]", aspect: "aspect-[3/4]", z: "z-10" },
  { id: "B", class: "absolute top-[15%] left-0 w-[55%]", aspect: "aspect-square", z: "z-20" },
  { id: "C", class: "absolute bottom-0 right-[-10%] w-[75%]", aspect: "aspect-[3/2]", z: "z-30" },
  { id: "D", class: "absolute top-[10%] right-[15%] w-[45%]", aspect: "aspect-[4/5]", z: "z-15" },
  { id: "E", class: "absolute bottom-[10%] left-[5%] w-[60%]", aspect: "aspect-square", z: "z-25" },
];

function ShatterFrame({ imageSrc, isMounted, aspect = "aspect-[4/5]" }) {
  if (!isMounted || !imageSrc) return <div className={`relative ${aspect} w-full rounded-3xl bg-gallery-soft/30 animate-pulse`} />;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      transition={{ layout: { type: "spring", stiffness: 400, damping: 25 }, default: { type: "spring", stiffness: 300, damping: 20 } }}
      className={`relative ${aspect} w-full rounded-3xl overflow-hidden shadow-xl bg-[#FAF8F5] border border-white/40 group transition-all duration-500`}
    >
      <AnimatePresence mode="wait">
        <motion.div key={imageSrc} className="absolute inset-0">
          {shards.map((shard, i) => (
            <motion.div
              key={i}
              initial={{ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, rotate: (Math.random() - 0.5) * 45, opacity: 0, scale: 0.5 }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: i * 0.008 }}
              className="absolute overflow-hidden"
              style={{ top: shard.top, left: shard.left, width: shard.width, height: shard.height, clipPath: shard.clip, zIndex: 10 }}
            >
              <div className="absolute w-[300%] h-[300%]" style={{ left: `-${(i % 3) * 100}%`, top: `-${Math.floor(i / 3) * 100}%` }}>
                <img src={imageSrc} alt="Artwork" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ delay: 0.4, duration: 0.4 }} className="absolute inset-0 bg-white z-30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function TripleCluster() {
  const [currentImages, setCurrentImages] = useState([]);
  const [slotIndices, setSlotIndices] = useState([0, 1, 2]);
  const [isMounted, setIsMounted] = useState(false);

  const updateSlot = useCallback((slotIndex) => {
    setCurrentImages((prev) => {
      const nextImages = [...prev];
      const usedUrls = prev.filter((_, i) => i !== slotIndex);
      const available = galleryImages.filter(url => !usedUrls.includes(url));
      const nextUrl = available[Math.floor(Math.random() * available.length)];
      nextImages[slotIndex] = nextUrl;
      return nextImages;
    });
  }, []);

  const shuffleLayout = useCallback(() => {
    const allIndices = [0, 1, 2, 3, 4];
    const picked = allIndices.sort(() => Math.random() - 0.5).slice(0, 3);
    setSlotIndices(picked);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    setCurrentImages(shuffled.slice(0, 3));

    const t1 = setInterval(() => updateSlot(0), 2000);
    const t2 = setInterval(() => updateSlot(1), 2600);
    const t3 = setInterval(() => updateSlot(2), 3200);
    const layoutTimer = setInterval(shuffleLayout, 1500);

    return () => {
      clearInterval(t1); clearInterval(t2); clearInterval(t3);
      clearInterval(layoutTimer);
    };
  }, [updateSlot, shuffleLayout]);

  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[420px]">
      {[0, 1, 2].map((cardIndex) => {
        const currentSlotIndex = slotIndices[cardIndex];
        const slot = layoutSlots[currentSlotIndex];
        return (
          <motion.div
            key={cardIndex}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${slot.class} ${slot.z}`}
            transition={{ layout: { type: "spring", stiffness: 400, damping: 25 } }}
          >
            <ShatterFrame
              imageSrc={currentImages[cardIndex]}
              isMounted={isMounted}
              aspect={slot.aspect}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative h-[85vh] bg-[#F5F1EB] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black/5" />

      <div className="relative z-20 max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-4">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            <div className="mb-4 inline-flex items-center gap-4 px-5 py-2 border border-gallery-gold/30 rounded-full bg-white/40 backdrop-blur-md">
              <Sparkles size={16} className="text-gallery-gold animate-pulse" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-text">A Sanctuary for Modern Masterpieces</span>
            </div>
            <h1 className="text-5xl md:text-[5.2rem] font-light text-gallery-text leading-[0.9] mb-4">Where Souls <br /><span className="italic text-gallery-accent">Conspire.</span></h1>
            <p className="text-gallery-muted text-lg font-light leading-relaxed mb-8 max-w-lg">Discover a curated collection of contemporary art that bridges the gap between traditional craftsmanship and digital innovation.</p>
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <Link href="/products" className="group relative px-14 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden rounded-full transition-transform hover:-translate-y-1">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link href="/about" className="text-[10px] tracking-[0.4em] uppercase text-gallery-text border-b border-gallery-border pb-1 hover:text-gallery-accent hover:border-gallery-accent transition-all font-medium">The Artist's Story</Link>
            </div>
          </motion.div>
        </div>
        <div className="relative"><TripleCluster /></div>
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/brushed-alum.png')" }} />
    </section>
  );
}