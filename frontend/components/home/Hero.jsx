"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// --- SHARD DATA (Organic Shatter Pattern) ---
const shards = [
  { top: "0%", left: "0%", width: "40%", height: "40%", clip: "polygon(0 0, 100% 0, 70% 100%, 0 80%)" },
  { top: "0%", left: "30%", width: "50%", height: "40%", clip: "polygon(20% 0, 100% 0, 80% 100%, 0 90%)" },
  { top: "0%", left: "70%", width: "30%", height: "50%", clip: "polygon(10% 0, 100% 0, 100% 100%, 0 70%)" },
  { top: "30%", left: "0%", width: "40%", height: "50%", clip: "polygon(0 20%, 90% 0, 100% 100%, 0 100%)" },
  { top: "35%", left: "35%", width: "40%", height: "40%", clip: "polygon(10% 10%, 90% 0, 100% 90%, 0 100%)" },
  { top: "40%", left: "70%", width: "30%", height: "60%", clip: "polygon(0 10%, 100% 0, 100% 100%, 10% 90%)" },
  { top: "70%", left: "0%", width: "40%", height: "30%", clip: "polygon(0 0, 100% 10%, 100% 100%, 0 100%)" },
  { top: "70%", left: "35%", width: "45%", height: "30%", clip: "polygon(10% 10%, 90% 0, 100% 100%, 0 100%)" },
  { top: "80%", left: "75%", width: "25%", height: "20%", clip: "polygon(0 20%, 100% 0, 100% 100%, 10% 100%)" },
];

const galleryImages = [
  "https://images4.alphacoders.com/131/1314643.jpg",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501472312651-726afe119ff1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80"
];

function ShatterGallery({ mousePos }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % galleryImages.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto rounded-[3rem] overflow-hidden shadow-[0_60px_150px_-30px_rgba(0,0,0,0.2)] bg-[#FAF8F5] border border-white/60 perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div 
          key={index} 
          className="absolute inset-0"
          style={{
            rotateY: mousePos.x * 10,
            rotateX: -mousePos.y * 10,
          }}
        >
          {shards.map((shard, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: (Math.random() - 0.5) * 1000, 
                y: (Math.random() - 0.5) * 1000, 
                rotate: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: 0.1,
                filter: "blur(20px)"
              }}
              animate={{ 
                x: mousePos.x * 30, // Shards react to mouse even when joined
                y: mousePos.y * 30, 
                rotate: 0, 
                opacity: 1, 
                scale: 1,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0,
                scale: 1.5,
                filter: "blur(30px)",
                transition: { duration: 0.4 } 
              }}
              transition={{ 
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: i * 0.01
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
                className="absolute w-[300%] h-[300%] grayscale-[0.2] hover:grayscale-0 transition-all duration-700" 
                style={{ 
                  left: `-${parseFloat(shard.left) * 2.5}%`, 
                  top: `-${parseFloat(shard.top) * 2.5}%`,
                  backgroundImage: `url(${galleryImages[index]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 bg-white z-30 pointer-events-none mix-blend-overlay"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-10 left-10 right-10 z-30 p-8 bg-white/30 backdrop-blur-3xl rounded-[2rem] border border-white/40 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-gallery-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="text-[10px] tracking-[0.6em] uppercase text-gallery-text/60 mb-3 font-semibold">Symbiotic Masterpiece</p>
        <h3 className="text-3xl font-light text-gallery-text tracking-wide italic">Kinetic Resonance</h3>
      </div>
    </div>
  );
}

class FluidInk {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.radius = Math.random() * 30 + 15;
    this.alpha = 0.45;
    this.decay = 0.0035;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.99; this.vy *= 0.99;
    this.alpha -= this.decay;
    this.radius += 0.4;
  }
  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `hsla(${this.hue}, 90%, 65%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.hue}, 90%, 65%, 0)`);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
  }
}

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const inks = useRef([]);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const render = () => {
      ctx.fillStyle = "rgba(245, 241, 235, 0.05)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      inks.current = inks.current.filter(ink => ink.alpha > 0);
      inks.current.forEach(ink => { ink.update(); ink.draw(ctx); });
      animationId = requestAnimationFrame(render);
    };
    window.addEventListener("resize", resize);
    resize(); render();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationId); };
  }, []);

  const handlePointerMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x - 0.5, y: y - 0.5 });
    if (isHovered && Math.random() > 0.4) {
      inks.current.push(new FluidInk(e.clientX - rect.left, e.clientY - rect.top, (Date.now() / 20) % 360));
    }
  };

  return (
    <section 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      className="relative min-h-screen bg-[#F5F1EB] flex items-center overflow-hidden selection:bg-gallery-accent selection:text-white"
    >
      {/* BACKGROUND DEPTH LAYER */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,177,142,0.15)_0%,transparent_70%)]" 
        />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-60" />

      <div className="relative z-20 max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center gap-32 py-20">
        
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10 inline-flex items-center gap-5 px-6 py-2.5 border border-gallery-gold/20 rounded-full bg-white/30 backdrop-blur-xl shadow-lg">
              <Sparkles size={18} className="text-gallery-gold animate-spin-slow" />
              <span className="text-[10px] tracking-[0.7em] uppercase text-gallery-text font-bold">Resonating Art Space</span>
            </div>

            <h1 className="text-8xl md:text-[8.5rem] font-light text-gallery-text leading-[0.85] mb-12 tracking-tight">
              Beyond the <br /> 
              <span className="italic text-gallery-accent relative inline-block">
                Senses.
                <motion.div 
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 left-0 w-full h-[1px] bg-gallery-accent origin-left"
                />
              </span>
            </h1>
            
            <p className="text-gallery-muted text-2xl font-light leading-relaxed mb-20 max-w-lg">
              Step into a kinetic sanctuary where every movement weaves a new masterpiece. You are the catalyst in this symphony of light.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-14">
              <Link
                href="/products"
                className="group relative px-20 py-8 bg-gallery-primary text-white text-[11px] tracking-[0.8em] uppercase overflow-hidden rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all hover:scale-105 hover:shadow-[0_30px_70px_rgba(0,0,0,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-6">Explore <ArrowRight size={18} /></span>
                <div className="absolute inset-0 bg-gallery-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
              </Link>
              <Link
                href="/about"
                className="text-[11px] tracking-[0.6em] uppercase text-gallery-text border-b-2 border-gallery-border/30 pb-2 hover:text-gallery-accent hover:border-gallery-accent transition-all duration-500 font-bold"
              >
                The Manifesto
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30"
        >
          <ShatterGallery mousePos={mousePos} />
        </motion.div>

      </div>

      {/* TEXTURE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')" }} />
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { rotate: 0deg; } to { rotate: 360deg; } }
      `}</style>
    </section>
  );
}