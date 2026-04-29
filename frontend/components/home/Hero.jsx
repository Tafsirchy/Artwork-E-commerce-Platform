"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- SHARD DATA FOR THE BROKEN IMAGE EFFECT ---
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
  "https://images.unsplash.com/photo-1705711714839-cf327143c4a0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1598770220477-cec551a23f53?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

function ShatterGallery() {
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % galleryImages.length);
    }, 2000); // Super fast cycle for high energy
    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return <div className="relative aspect-[4/5] w-full max-w-[380px] mx-auto rounded-[2.5rem] bg-[#FAF8F5]/50 animate-pulse" />;

  return (
    <div className="relative aspect-[4/5] w-full max-w-[380px] mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.18)] bg-[#FAF8F5] border border-white/60">
      <AnimatePresence mode="wait">
        <motion.div key={index} className="absolute inset-0">
          {shards.map((shard, i) => (
            <motion.div
              key={i}
              initial={{
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 800,
                rotate: (Math.random() - 0.5) * 180,
                opacity: 0,
                scale: 0.2
              }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.2,
                filter: "blur(10px)",
                transition: { duration: 0.3 }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: i * 0.012 // Ultra-fast stagger
              }}
              className="absolute overflow-hidden"
              style={{
                top: shard.top,
                left: shard.left,
                width: shard.width,
                height: shard.height,
                clipPath: shard.clip,
                zIndex: 10
              }}
            >
              <div 
                className="absolute w-[300%] h-[300%]" 
                style={{ 
                  left: `-${(i % 3) * 100}%`, 
                  top: `-${Math.floor(i / 3) * 100}%`,
                  backgroundImage: `url(${galleryImages[index]})`,
                  backgroundSize: '300% 300%', // Crucial for perfect alignment
                  backgroundPosition: 'center'
                }}
              />
            </motion.div>
          ))}
          {/* Flash Effect on Completion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute inset-0 bg-white z-30 pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>

      {/* Glossy Overlay Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 pointer-events-none" />

      {/* Floating Card Content */}
      <div className="absolute bottom-8 left-8 right-8 z-30 p-8 bg-white/40 backdrop-blur-2xl rounded-[1.8rem] border border-white/40 shadow-xl">
        <p className="text-[9px] tracking-[0.6em] uppercase text-gallery-muted mb-3 font-medium">Broken to Whole / Continuous</p>
        <h3 className="text-2xl font-light text-gallery-text tracking-wide italic">The Reassembling Soul</h3>
      </div>
    </div>
  );
}

// --- FLUID INK SYSTEM FOR BACKGROUND MIXING ---
class FluidInk {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.radius = Math.random() * 25 + 15;
    this.alpha = 0.4;
    this.decay = 0.004;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.alpha -= this.decay;
    this.radius += 0.3;
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `hsla(${this.hue}, 90%, 70%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 90%, 70%, 0)`);
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isHovered && mouse.current.x > 0) {
        if (Math.random() > 0.4) {
          inks.current.push(new FluidInk(mouse.current.x, mouse.current.y, (Date.now() / 20) % 360));
        }
      }
      inks.current = inks.current.filter(ink => ink.alpha > 0);
      inks.current.forEach(ink => {
        ink.update();
        ink.draw(ctx);
      });
      animationId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
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
      className="relative h-[80vh] bg-[#F5F1EB] flex items-center overflow-hidden"
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,1),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(201,171,110,0.1),transparent_40%)]" />
      </div>

      {/* INTERACTIVE FLUID LAYER */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply" />

      <div className="relative z-20 max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-4">

        {/* LEFT CONTENT */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="mb-4 inline-flex items-center gap-4 px-5 py-2 border border-gallery-gold/30 rounded-full bg-white/40 backdrop-blur-md">
              <Sparkles size={16} className="text-gallery-gold animate-pulse" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-text">A Pastel Veil for Living Art</span>
            </div>

            <h1 className="text-5xl md:text-[4.8rem] font-light text-gallery-text leading-[0.9] mb-4">
              Where Souls <br />
              <span className="italic text-gallery-accent">Conspire.</span>
            </h1>

            <p className="text-gallery-muted text-lg font-light leading-relaxed mb-8 max-w-lg">
              A soft painterly field covers the artwork, then opens only where your cursor moves. The reveal feels like brushing light back onto the canvas.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-12">
              <Link
                href="/products"
                className="group relative px-14 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden rounded-full transition-transform hover:-translate-y-1"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link
                href="/about"
                className="text-[10px] tracking-[0.5em] uppercase text-gallery-text border-b border-gallery-border pb-1 hover:text-gallery-accent hover:border-gallery-accent transition-all"
              >
                The Artist's Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* RIGHT CONTENT: THE SHATTER GALLERY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <ShatterGallery />
        </motion.div>

      </div>

      {/* TEXTURE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/brushed-alum.png')" }} />
    </section>
  );
}