"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- THE FLUID MIXING ENGINE ---
class FluidInk {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.radius = Math.random() * 25 + 15;
    this.alpha = 0.45;
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

const HERO_ARTWORK = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2400&q=80"; // High-res stable artwork source

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
      className="relative min-h-screen bg-[#F5F1EB] flex items-center overflow-hidden"
    >
      {/* BACKGROUND: THE REFLECTION WORLD */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={HERO_ARTWORK} 
          alt="Spirited Reflection" 
          fill 
          priority
          className="object-cover opacity-20 grayscale-[0.5] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1EB] via-[#F5F1EB]/90 to-transparent" />
      </div>

      {/* INTERACTIVE FLUID LAYER */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply" />

      {/* CONTENT GRID */}
      <div className="relative z-20 max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24">
        
        {/* LEFT: MINIMAL TEXT */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="mb-8 inline-flex items-center gap-4 px-5 py-2 border border-gallery-gold/30 rounded-full bg-white/40 backdrop-blur-md">
              <Sparkles size={16} className="text-gallery-gold" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-text">Where Souls Mirror Beauty</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-light text-gallery-text leading-[1.0] mb-10">
              A Pastel Veil <br /> 
              <span className="italic text-gallery-accent">Living Art.</span>
            </h1>
            
            <p className="text-gallery-muted text-xl font-light leading-relaxed mb-12 max-w-lg">
              A soft painterly field covers the artwork, then opens only where your cursor moves. The reveal feels like brushing light back onto the canvas.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Link
                href="/products"
                className="group relative px-12 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden rounded-full transition-transform hover:-translate-y-1"
              >
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link
                href="/about"
                className="text-[10px] tracking-[0.4em] uppercase text-gallery-text border-b border-gallery-border pb-1 hover:text-gallery-accent hover:border-gallery-accent transition-all"
              >
                The Artist's Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: THE INTERACTIVE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative group w-full"
        >
          <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto rounded-[2.5rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] border border-white/60 bg-white/20 backdrop-blur-sm">
            <Image 
              src={HERO_ARTWORK} 
              alt="Spirited Away" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {/* Reveal Label Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full border border-white/40 flex items-center justify-center">
                  <MoveUpRight size={24} className="text-white" />
               </div>
            </div>

            {/* Card Info Box */}
            <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/40 backdrop-blur-2xl rounded-[1.8rem] border border-white/40 shadow-xl">
              <p className="text-[9px] tracking-[0.5em] uppercase text-gallery-muted mb-3 font-medium">Revealed only by touch</p>
              <h3 className="text-2xl font-light text-gallery-text tracking-wide">Spirited Reflection / Hover Gallery</h3>
            </div>
          </div>
        </motion.div>

      </div>

      {/* TEXTURE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/brushed-alum.png')" }} />
    </section>
  );
}