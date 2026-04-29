"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Layers } from "lucide-react";
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
  "https://images.unsplash.com/photo-1590005354167-6da97870c91d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1688672407398-69ba645c2aff?q=80&w=918&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598770220477-cec551a23f53?q=80&w=1171&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=1190&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=880&auto=format&fit=crop"
];

// REFINED REFERENCE GRID (Zero Overlap, Mathematical Precision)
const gridLayout = [
  // COLUMN 1 (Sidebar - 5 units)
  { id: 1, top: "10%", left: "8%", w: "13%", aspect: "aspect-[16/10]" },
  { id: 2, top: "28%", left: "8%", w: "13%", aspect: "aspect-[16/10]" },
  { id: 3, top: "46%", left: "8%", w: "13%", aspect: "aspect-[16/10]" },
  { id: 4, top: "64%", left: "8%", w: "13%", aspect: "aspect-[16/10]" },
  { id: 5, top: "82%", left: "8%", w: "13%", aspect: "aspect-[16/10]" },

  // COLUMN 2 (Main Left)
  { id: 6, top: "25%", left: "27%", w: "18%", aspect: "aspect-[3/4]" },
  { id: 7, top: "72%", left: "27%", w: "24%", aspect: "aspect-[3/2]" },

  // COLUMN 3 (Main Right)
  { id: 8, top: "25%", left: "52%", w: "22%", aspect: "aspect-square" },
  { id: 9, top: "72%", left: "53%", w: "18%", aspect: "aspect-[3/4]" },

  // COLUMN 4 (Far Right)
  { id: 10, top: "25%", left: "78%", w: "20%", aspect: "aspect-square" },
  { id: 11, top: "58%", left: "78%", w: "15%", aspect: "aspect-square" },
  { id: 12, top: "82%", left: "78%", w: "15%", aspect: "aspect-square" },

  // CENTER CIRCLE (The Hub)
  { id: 13, top: "50%", left: "41.5%", w: "18%", aspect: "aspect-square", isCircle: true, z: 100 },
];

function ShatterFrame({ imageSrc, isMounted, aspect, isCircle }) {
  if (!isMounted || !imageSrc) return <div className={`relative ${aspect} w-full bg-gray-100 rounded-sm shadow-inner animate-pulse`} />;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05, zIndex: 120 }}
      transition={{ layout: { type: "spring", stiffness: 350, damping: 25 } }}
      className={`relative ${aspect} w-full bg-white shadow-[10px_10px_30px_rgba(0,0,0,0.1),-10px_-10px_30px_rgba(255,255,255,1)] overflow-hidden group transition-all duration-500 ${isCircle ? "rounded-full border-[6px] border-white ring-4 ring-black/5" : "rounded-sm"}`}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ delay: 0.4, duration: 0.4 }} className="absolute inset-0 bg-white z-30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function PrecisionGrid({ isOpen }) {
  const [currentImages, setCurrentImages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentImages([...galleryImages, ...galleryImages].sort(() => Math.random() - 0.5).slice(0, 13));

    const interval = setInterval(() => {
      if (!isOpen) return;
      setCurrentImages(prev => {
        const next = [...prev];
        next[Math.floor(Math.random() * next.length)] = galleryImages[Math.floor(Math.random() * galleryImages.length)];
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <motion.div 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[85vh] max-w-[1550px] mx-auto"
    >
      {gridLayout.map((slot, index) => (
        <div
          key={slot.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            top: slot.top, 
            left: slot.left, 
            width: slot.w,
            zIndex: slot.z || 10
          }}
        >
          <ShatterFrame
            imageSrc={currentImages[index]}
            isMounted={isMounted}
            aspect={slot.aspect}
            isCircle={slot.isCircle}
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative h-screen min-h-[900px] bg-gray-200 flex items-center justify-center overflow-hidden">
      {/* THE TRIPTYCH DOOR (Curtain) */}
      <div className="absolute inset-0 z-50 flex pointer-events-none">
        <motion.div 
          animate={isOpen ? { x: "-100%", opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.85, 0, 0.15, 1] }}
          className="relative w-1/3 h-full bg-gray-200 border-r border-black/5"
        />
        <motion.div 
          animate={isOpen ? { opacity: 0, scale: 1.1, filter: "blur(20px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="relative w-1/3 h-full bg-gray-200"
        />
        <motion.div 
          animate={isOpen ? { x: "100%", opacity: 0 } : { x: 0, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.85, 0, 0.15, 1] }}
          className="relative w-1/3 h-full bg-gray-200 border-l border-black/5"
        />
      </div>

      {/* TEXT CONTENT & TRIGGER */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="absolute inset-0 z-[60] flex flex-col items-center justify-center px-10 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 inline-flex items-center gap-4 px-8 py-3 border border-black/5 rounded-full bg-white/40 backdrop-blur-xl"
            >
              <Sparkles size={16} className="text-gallery-gold animate-pulse" />
              <span className="text-[11px] tracking-[0.7em] uppercase text-gray-800 font-bold">Curated Grid Exhibition</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-[9rem] font-light text-gray-900 leading-[0.8] mb-10 tracking-tighter">
              Where Souls <br />
              <span className="italic text-gallery-accent block mt-6">Conspire.</span>
            </h1>

            <p className="text-gray-600 text-2xl font-light leading-relaxed max-w-3xl mb-24 opacity-80">
              Immerse yourself in a mathematically precise sanctuary. <br className="hidden md:block" />
              Unlock the vault to explore a collection where traditional art meets digital innovation.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-16 pointer-events-auto">
              <button 
                onClick={() => setIsOpen(true)}
                className="group relative px-24 py-9 bg-black text-white text-[11px] tracking-[0.7em] uppercase overflow-hidden rounded-full transition-all hover:-translate-y-2 shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-4 font-black">
                  Enter The Grid <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
              </button>
              <Link href="/about" className="text-[11px] tracking-[0.6em] uppercase text-gray-500 border-b-2 border-gray-400 pb-2 hover:text-black hover:border-black transition-all font-bold">
                The Architect
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRECISION GRID GALLERY */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-10 flex flex-col items-center justify-center">
        <PrecisionGrid isOpen={isOpen} />
        
        {/* ACTION CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 2.8, duration: 1.5 }}
          className="mt-12 text-center"
        >
          <Link href="/products" className="group inline-flex items-center gap-8 text-[11px] tracking-[0.9em] uppercase text-gray-800 hover:text-black transition-all font-black border-b-2 border-black/5 pb-4">
            <Layers size={16} className="text-gray-400" />
            Discover Full Collection
          </Link>
        </motion.div>
      </div>

      {/* BRANDING ACCENTS */}
      <motion.div 
        animate={isOpen ? { opacity: 0.6 } : { opacity: 0 }}
        className="absolute bottom-12 left-12 text-[10px] tracking-[1.2em] uppercase text-black/40 rotate-90 origin-left font-black"
      >
        EXHIBITION 2024-D
      </motion.div>
    </section>
  );
}