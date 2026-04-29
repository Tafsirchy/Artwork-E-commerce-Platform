"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const canvasRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);

  // Parallax Springs
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], ["-20px", "20px"]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], ["-20px", "20px"]);

  // --- PARTICLE SYSTEM LOGIC ---
  useEffect(() => {
    setIsMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`;
        this.alpha = 1;
        this.decay = Math.random() * 0.01 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.size *= 0.99;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        // Artistic "brush" shape (irregular circle)
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        // Add a soft glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMoveInternal = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
      
      // Spawn artistic particles (paint strokes)
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(clientX, clientY));
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMoveInternal);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMoveInternal);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gallery-bg">
      {/* --- LAYER 0: The Artist's Canvas (The Magic!) --- */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-40 pointer-events-none mix-blend-multiply opacity-60"
      />

      {/* --- LAYER 1: Deep Background --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ x: translateX, y: translateY, scale: 1.05 }}
          className="absolute inset-0 opacity-30 grayscale-[0.8]"
        >
          <Image
            src="/gallery_hero_bg_1777459017637.png"
            alt="Deep Canvas"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-gallery-bg/40 via-transparent to-gallery-bg" />
      </div>

      {/* --- LAYER 2: The "Blooming" Ink (Center) --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          style={{ rotate: rotateY, x: useTransform(smoothX, [-0.5, 0.5], ["80px", "-80px"]) }}
          className="relative w-[70vw] h-[70vw] opacity-20 mix-blend-multiply blur-3xl"
        >
          <Image src="/ink_bloom_gold_1777463235353.png" alt="Ink Bloom" fill className="object-contain" />
        </motion.div>
      </motion.div>

      {/* --- LAYER 3: Main Content (The Portal) --- */}
      <div className="relative z-50 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative perspective-1000"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="px-5 py-1.5 border border-gallery-gold/40 rounded-full flex items-center gap-3 bg-white/5 backdrop-blur-md">
              <Sparkles className="text-gallery-gold animate-spin-slow" size={14} />
              <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-gold font-medium">The Living Canvas</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-light text-gallery-text leading-[1.1] mb-8 pointer-events-none select-none"
          >
            Unveil Your <br /> 
            <span className="relative italic text-gallery-accent group">
              Inner Vision.
              <motion.span 
                className="absolute -inset-4 bg-gallery-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gallery-muted max-w-xl mx-auto mb-12 leading-relaxed font-light pointer-events-none"
          >
            The cursor is your brush, the screen is your sanctuary. <br />
            Move to paint, hover to bloom, stay to discover.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link
              href="/products"
              className="relative group px-12 py-5 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin Exploring <ArrowRight size={14} />
              </span>
              <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <Link
              href="/about"
              className="px-12 py-5 border border-gallery-border text-gallery-text text-[10px] tracking-[0.4em] uppercase hover:bg-gallery-surface transition-all"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
