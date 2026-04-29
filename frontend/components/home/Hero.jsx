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

  // Smooth parallax effect for text
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], ["-30px", "30px"]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], ["-30px", "30px"]);

  // --- GENERATIVE ART LOGIC (The "Human-Surpassing" Artist) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = color;
        this.opacity = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.05;
        this.opacity -= 0.01;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Subtle background fade (trailing effect)
      ctx.fillStyle = "rgba(245, 241, 235, 0.05)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.opacity <= 0) particles.splice(i, 1);
      });

      // Auto-painting "Ghost" Brush
      if (Math.random() > 0.9) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const hue = (Date.now() / 50) % 360;
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(x, y, `hsl(${hue}, 70%, 60%)`));
        }
      }

      animationFrame = requestAnimationFrame(init);
    };

    init();

    const handlePaint = (e) => {
      const hue = (Date.now() / 10) % 360;
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(e.clientX, e.clientY, `hsl(${hue}, 80%, 60%)`));
      }
      
      // Update motion values for parallax
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handlePaint);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePaint);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gallery-bg cursor-none">
      
      {/* --- THE GENERATIVE CANVAS (The "Invisible Artist") --- */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-multiply"
      />

      {/* --- STATIC OVERLAYS --- */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-gallery-bg/10 to-gallery-bg" />

      {/* --- MAIN PORTAL CONTENT --- */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          style={{ rotateX, rotateY, x: translateX, y: translateY }}
          className="relative perspective-1000"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="px-6 py-2 border border-gallery-gold/40 rounded-full flex items-center gap-3 bg-white/40 backdrop-blur-xl">
              <Sparkles className="text-gallery-gold animate-spin-slow" size={14} />
              <span className="text-[10px] tracking-[0.6em] uppercase text-gallery-text font-bold">The Living Canvas</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-light text-gallery-text leading-[1.05] mb-8"
          >
            Art That <br /> 
            <span className="relative inline-block italic text-gallery-accent">
              Self-Creates.
              <motion.div 
                className="absolute -inset-4 bg-gallery-gold/10 blur-3xl -z-10 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gallery-muted max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
          >
            Move your cursor to paint your own soul onto our infinite gallery. <br />
            Experience generative beauty that "arts like a man never can."
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <Link
              href="/products"
              className="group relative px-16 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore The Void <ArrowRight size={16} />
              </span>
              <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <Link
              href="/about"
              className="text-[10px] tracking-[0.5em] uppercase text-gallery-text border-b border-gallery-text/20 pb-2 hover:border-gallery-gold transition-colors"
            >
              The Artist's Soul
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- CUSTOM ARTISTIC CURSOR --- */}
      <motion.div 
        style={{ x: useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 2000]), { damping: 20 }), y: useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 1000]), { damping: 20 }) }}
        className="fixed w-4 h-4 bg-gallery-gold rounded-full pointer-events-none mix-blend-difference z-50 blur-[2px]"
      />

    </section>
  );
}
