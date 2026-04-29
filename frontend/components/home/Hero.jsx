"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";

// --- GENERATIVE PARTICLE SYSTEM ---
class ArtParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 4 + 1;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.008;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.vx *= 0.99;
    this.vy *= 0.99;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a slight glow to each particle
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
  }
}

// --- CHROMATIC BRUSH SYSTEM ---
class LivingStroke {
  constructor(canvas, x, y, type) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [{ x, y }];
    this.type = type; // 'masculine' or 'feminine'
    this.hue = type === "masculine" ? 210 : 340; // Cool vs Warm base
    this.thickness = type === "masculine" ? 1.5 : 0.7;
    this.maxLength = 50 + Math.random() * 120;
    this.angle = Math.random() * Math.PI * 2;
    this.opacity = 0;
    this.distortion = 0;
  }

  update(mouseX, mouseY, frame) {
    // Generative Autonomous Growth
    if (this.points.length < this.maxLength) {
      const last = this.points[this.points.length - 1];
      const noise = Math.sin(frame * 0.01 + this.points.length * 0.1) * 1.5;
      const stepX = Math.cos(this.angle + noise) * 1.2;
      const stepY = Math.sin(this.angle + noise) * 1.2;
      this.points.push({ x: last.x + stepX, y: last.y + stepY });
    }

    // Advanced Chromatic Interaction
    const dist = Math.hypot(mouseX - this.points[0].x, mouseY - this.points[0].y);
    if (dist < 250) {
      // Multicolor Flow based on distance and time
      this.hue = (frame * 0.5 + dist) % 360; 
      this.opacity = Math.min(1, this.opacity + 0.08);
      this.thickness = (this.type === "masculine" ? 3 : 1.5) * (1 + (250 - dist) / 250);
      
      // Magnetic Morphing: Strokes lean toward cursor
      this.points.forEach((p, idx) => {
        const pull = (250 - dist) * 0.0005 * (idx / this.points.length);
        p.x += (mouseX - p.x) * pull;
        p.y += (mouseY - p.y) * pull;
      });
    } else {
      this.opacity = Math.max(0.15, this.opacity - 0.005);
      if (this.opacity < 0.45) this.opacity += 0.003;
      this.thickness = this.type === "masculine" ? 1.5 : 0.7;
    }
  }

  draw() {
    if (this.points.length < 2) return;
    this.ctx.beginPath();
    this.ctx.strokeStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
    this.ctx.lineWidth = this.thickness;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    
    // Shadow glow for the "Masterpiece" look
    this.ctx.shadowBlur = this.opacity > 0.5 ? 20 : 0;
    this.ctx.shadowColor = `hsla(${this.hue}, 80%, 60%, 0.5)`;
    
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
    
    // Reset shadow for next draw
    this.ctx.shadowBlur = 0;
  }
}

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokes = useRef([]);
  const particles = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.offsetWidth * 0.7;
      canvas.height = container.offsetHeight;
      initInstallation();
    };

    const initInstallation = () => {
      strokes.current = [];
      particles.current = [];
      const w = canvas.width;
      const h = canvas.height;
      
      // Generate the "Living Souls"
      // Masculine Archetype (Structured, Strong)
      for (let i = 0; i < 80; i++) {
        strokes.current.push(new LivingStroke(
          canvas, 
          w * 0.38 + (Math.random() - 0.5) * 220, 
          h * 0.2 + Math.random() * (h * 0.6), 
          "masculine"
        ));
      }

      // Feminine Archetype (Fluid, Expressive)
      for (let i = 0; i < 80; i++) {
        strokes.current.push(new LivingStroke(
          canvas, 
          w * 0.62 + (Math.random() - 0.5) * 220, 
          h * 0.2 + Math.random() * (h * 0.6), 
          "feminine"
        ));
      }
    };

    const render = () => {
      frame.current++;
      
      // Semi-transparent clear for motion trails
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and Draw Strokes
      strokes.current.forEach(s => {
        s.update(mouse.current.x, mouse.current.y, frame.current);
        s.draw();
      });

      // Particle Trail Logic
      if (mouse.current.x > 0 && mouse.current.x < canvas.width) {
        // Emit new artistic particles
        if (frame.current % 2 === 0) {
          particles.current.push(new ArtParticle(
            mouse.current.x, 
            mouse.current.y, 
            `hsl(${frame.current % 360}, 90%, 65%)`
          ));
        }
      }

      // Update and Draw Particles
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        p.update();
        p.draw(ctx);
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
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen bg-white flex overflow-hidden">
      {/* --- LEFT: ART INSTALLATION CANVAS (70%) --- */}
      <div 
        className="w-[70%] relative bg-white border-r border-gallery-border/20 cursor-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouse.current.x = e.clientX - rect.left;
          mouse.current.y = e.clientY - rect.top;
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Creative Labeling */}
        <div className="absolute top-12 left-12 flex items-center gap-6">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            className="h-[1px] bg-gallery-gold"
          />
          <span className="text-[9px] tracking-[0.6em] uppercase text-gallery-gold font-medium">
            Neural Canvas / Inst-001
          </span>
        </div>

        {/* Artistic Watermark */}
        <div className="absolute bottom-12 left-12">
          <h4 className="text-[8vw] font-black text-gallery-soft/30 leading-none select-none pointer-events-none tracking-tighter">
            SOUL
          </h4>
        </div>
      </div>

      {/* --- RIGHT: THE ARTIST'S VOICE (30%) --- */}
      <div className="w-[30%] flex flex-col justify-center px-20 bg-[#FAF8F5] relative">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-12 relative">
             <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-20 text-gallery-gold/10"
            >
              <Sparkles size={200} strokeWidth={0.2} />
            </motion.div>

            <h1 className="text-8xl font-light text-gallery-text leading-[0.9] mb-12">
              Beyond <br /> 
              <span className="italic text-gallery-accent">Human</span> <br />
              Artistry.
            </h1>
            
            <p className="text-gallery-muted text-xl font-light leading-relaxed mb-16 max-w-sm">
              Experience the "Living Soul" — a generative art installation that paints the emotions you haven't yet discovered.
            </p>

            <Link
              href="/products"
              className="group relative inline-flex items-center gap-8 px-14 py-8 bg-gallery-primary text-white text-[10px] tracking-[0.7em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Begin Exploration <Wand2 size={16} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gallery-accent via-gallery-gold to-gallery-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
            </Link>
          </div>
        </motion.div>
        
        {/* Footnote */}
        <div className="absolute bottom-12 left-20">
          <div className="flex items-center gap-4 text-gallery-muted/60">
            <div className="w-2 h-2 rounded-full bg-gallery-gold animate-pulse" />
            <p className="text-[9px] tracking-[0.4em] uppercase">Live Generative Feed Active</p>
          </div>
        </div>
      </div>
      
      {/* Texture Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply" 
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')" }} />
    </section>
  );
}
