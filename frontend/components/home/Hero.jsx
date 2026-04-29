"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// --- BRUSH STROKE LOGIC ---
class Stroke {
  constructor(canvas, x, y, type, color) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [{ x, y }];
    this.type = type; // 'masculine' or 'feminine'
    this.baseColor = color;
    this.currentColor = color;
    this.opacity = 0;
    this.thickness = type === "masculine" ? 1.2 : 0.6;
    this.maxLength = 40 + Math.random() * 80;
    this.growthSpeed = 0.5 + Math.random() * 1.5;
    
    // Silhouette path offset
    this.offsetX = (Math.random() - 0.5) * 40;
    this.offsetY = (Math.random() - 0.5) * 100;
  }

  update(mouseX, mouseY) {
    // Growth logic (Auto Painting)
    if (this.points.length < this.maxLength) {
      const lastPoint = this.points[this.points.length - 1];
      let angle;
      
      if (this.type === "masculine") {
        // Structured, bold, angular strokes
        angle = (Math.floor(Math.random() * 8) * Math.PI) / 4; 
      } else {
        // Fluid, expressive, curved strokes
        angle = Math.sin(this.points.length * 0.08) * 2 + Math.PI / 2;
      }
      
      this.points.push({
        x: lastPoint.x + Math.cos(angle) * this.growthSpeed,
        y: lastPoint.y + Math.sin(angle) * this.growthSpeed
      });
    }

    // Interaction logic
    const dist = Math.hypot(mouseX - this.points[0].x, mouseY - this.points[0].y);
    if (dist < 180) {
      // User as Artist effect
      this.currentColor = this.type === "masculine" ? "#D97757" : "#C8A96A"; // Terracotta / Gold
      this.opacity = Math.min(1, this.opacity + 0.05);
      // Slight morphing/vibration
      this.points.forEach(p => {
        p.x += (Math.random() - 0.5) * 0.5;
        p.y += (Math.random() - 0.5) * 0.5;
      });
    } else {
      this.currentColor = this.baseColor;
      this.opacity = Math.max(0.1, this.opacity - 0.01);
      // Fade in on load
      if (this.opacity < 0.3) this.opacity += 0.005;
    }
  }

  draw() {
    if (this.points.length < 2) return;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.thickness;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
  }
}

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokes = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });

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
      initStrokes();
    };

    const initStrokes = () => {
      strokes.current = [];
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // Masculine Figure (Structured Lines on Left)
      for (let i = 0; i < 60; i++) {
        strokes.current.push(new Stroke(
          canvas, 
          w * 0.35 + (Math.random() - 0.5) * 150, 
          h * 0.2 + Math.random() * (h * 0.6), 
          "masculine", 
          "#222222"
        ));
      }

      // Feminine Figure (Fluid Lines on Right)
      for (let i = 0; i < 60; i++) {
        strokes.current.push(new Stroke(
          canvas, 
          w * 0.65 + (Math.random() - 0.5) * 150, 
          h * 0.2 + Math.random() * (h * 0.6), 
          "feminine", 
          "#444444"
        ));
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.current.forEach(s => {
        s.update(mouse.current.x, mouse.current.y);
        s.draw();
      });
      animationId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
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
      {/* --- LEFT: LIVING CANVAS AREA (70%) --- */}
      <div 
        className="w-[70%] relative bg-white border-r border-gallery-border/30 cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouse.current.x = e.clientX - rect.left;
          mouse.current.y = e.clientY - rect.top;
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/canvas-orange.png')" }} />
        
        {/* Abstract "A" for ART Watermark */}
        <div className="absolute bottom-10 left-10 text-[10vw] font-bold text-gallery-soft/40 select-none pointer-events-none">
          ART
        </div>
      </div>

      {/* --- RIGHT: MINIMAL CONTENT (30%) --- */}
      <div className="w-[30%] flex flex-col justify-center px-16 bg-[#FAF8F5]">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="mb-12">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "40px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-[2px] bg-gallery-gold mb-8"
            />
            
            <h1 className="text-7xl font-light text-gallery-text leading-[1.1] mb-8">
              Where Art <br /> 
              <span className="italic text-gallery-accent">Comes Alive</span>
            </h1>
            
            <p className="text-gallery-muted text-lg font-light leading-relaxed mb-12 max-w-xs">
              Experience creativity beyond imagination through a living, breathing digital masterpiece.
            </p>

            <Link
              href="/products"
              className="group relative inline-flex items-center gap-6 px-10 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Explore Collection <ArrowRight size={16} />
              </span>
              <div className="absolute inset-0 bg-gallery-gold translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-gallery-border/50">
            <div className="flex items-center gap-4 text-gallery-muted group cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-gallery-border flex items-center justify-center group-hover:border-gallery-gold transition-colors">
                <Sparkles size={12} className="group-hover:text-gallery-gold transition-colors" />
              </div>
              <span className="text-[9px] tracking-[0.3em] uppercase">Interactive Experience</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Full Screen Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.02)]" />
    </section>
  );
}
