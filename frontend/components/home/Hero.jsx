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
  "https://images.unsplash.com/photo-1598770220477-cec551a23f53?q=80&w=1171&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?q=80&w=880&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=687&auto=format&fit=crop"
];

function ShatterFrame({ imageSrc, isMounted, aspect = "aspect-[4/5]" }) {
  if (!isMounted || !imageSrc) return <div className={`relative ${aspect} w-full rounded-3xl bg-gallery-soft/30 animate-pulse`} />;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
              <div className="absolute w-[300%] h-[300%]" style={{ left: `-${(i % 3) * 100}%`, top: `-${Math.floor(i / 3) * 100}%`, backgroundImage: `url(${imageSrc})`, backgroundSize: '300% 300%', backgroundPosition: 'center' }} />
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

  useEffect(() => {
    setIsMounted(true);
    const shuffled = [...galleryImages].sort(() => Math.random() - 0.5);
    setCurrentImages(shuffled.slice(0, 3));
    const t1 = setInterval(() => updateSlot(0), 2500);
    const t2 = setInterval(() => updateSlot(1), 3200);
    const t3 = setInterval(() => updateSlot(2), 4000);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); };
  }, [updateSlot]);

  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[420px]">
      {/* FRAME 1: TOP RIGHT (Back Layer) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 right-0 w-[55%] z-10"
      >
        <ShatterFrame imageSrc={currentImages[0]} isMounted={isMounted} aspect="aspect-[3/4]" />
      </motion.div>

      {/* FRAME 2: MIDDLE LEFT (Middle Layer) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-[20%] left-0 w-[58%] z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      >
        <ShatterFrame imageSrc={currentImages[1]} isMounted={isMounted} aspect="aspect-square" />
      </motion.div>

      {/* FRAME 3: BOTTOM RIGHT (Front Layer) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 right-[-8%] w-[82%] z-30 shadow-2xl"
      >
        <ShatterFrame imageSrc={currentImages[2]} isMounted={isMounted} aspect="aspect-[3/2]" />
      </motion.div>
    </div>
  );
}

class FluidInk {
  constructor(x, y, hue) {
    this.x = x; this.y = y; this.hue = hue;
    this.vx = (Math.random() - 0.5) * 4; this.vy = (Math.random() - 0.5) * 4;
    this.radius = Math.random() * 25 + 15; this.alpha = 0.4; this.decay = 0.004;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.99; this.vy *= 0.99; this.alpha -= this.decay; this.radius += 0.3; }
  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `hsla(${this.hue}, 90%, 70%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 90%, 70%, 0)`);
    ctx.globalCompositeOperation = "screen"; ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
  }
}

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const inks = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isHovered && mouse.current.x > 0) {
        if (Math.random() > 0.4) { inks.current.push(new FluidInk(mouse.current.x, mouse.current.y, (Date.now() / 20) % 360)); }
      }
      inks.current = inks.current.filter(ink => ink.alpha > 0);
      inks.current.forEach(ink => { ink.update(); ink.draw(ctx); });
      animationId = requestAnimationFrame(render);
    };
    window.addEventListener("resize", resize);
    resize(); render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationId); };
  }, [isHovered]);

  return (
    <section 
      ref={containerRef}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[85vh] bg-[#F5F1EB] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(201,171,110,0.1),transparent_40%)]" />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply" />
      <div className="relative z-20 max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-4">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            <div className="mb-4 inline-flex items-center gap-4 px-5 py-2 border border-gallery-gold/30 rounded-full bg-white/40 backdrop-blur-md">
              <Sparkles size={16} className="text-gallery-gold animate-pulse" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-text">A Pastel Veil for Living Art</span>
            </div>
            <h1 className="text-5xl md:text-[5.2rem] font-light text-gallery-text leading-[0.9] mb-4">Where Souls <br /><span className="italic text-gallery-accent">Conspire.</span></h1>
            <p className="text-gallery-muted text-lg font-light leading-relaxed mb-8 max-w-lg">A soft painterly field covers the artwork, then opens only where your cursor moves. The reveal feels like brushing light back onto the canvas.</p>
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