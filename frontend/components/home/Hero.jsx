"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

// --- SVG PATH STRINGS FOR SILHOUETTES ---
const MAN_PATH = "M100,50 C120,50 140,70 140,100 C140,130 130,150 120,180 C110,210 130,240 140,280 C150,320 150,380 130,420 C110,460 90,460 70,420 C50,380 50,320 60,280 C70,240 90,210 80,180 C70,150 60,130 60,100 C60,70 80,50 100,50";
const WOMAN_PATH = "M100,50 C115,50 125,65 125,85 C125,105 115,120 110,140 C105,160 125,185 135,215 C145,245 140,285 125,325 C110,365 90,365 75,325 C60,285 55,245 65,215 C75,185 95,160 90,140 C85,120 75,105 75,85 C75,65 85,50 100,50";

class Stroke {
  constructor(canvas, pathPoints, type, color, xOffset, yOffset) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pathPoints = pathPoints;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    
    const startIdx = Math.floor(Math.random() * pathPoints.length);
    this.currentIdx = startIdx;
    this.points = [{
      x: pathPoints[startIdx].x + xOffset,
      y: pathPoints[startIdx].y + yOffset
    }];
    
    this.type = type;
    this.baseColor = color;
    this.currentColor = color;
    this.opacity = 0;
    this.thickness = type === "masculine" ? 1.4 : 0.7;
    this.maxLength = 20 + Math.random() * 40;
    this.growthSpeed = 1;
  }

  update(mouseX, mouseY) {
    if (this.points.length < this.maxLength) {
      this.currentIdx = (this.currentIdx + 1) % this.pathPoints.length;
      const p = this.pathPoints[this.currentIdx];
      this.points.push({
        x: p.x + this.xOffset + (Math.random() - 0.5) * 15,
        y: p.y + this.yOffset + (Math.random() - 0.5) * 15
      });
    }

    const dist = Math.hypot(mouseX - this.points[0].x, mouseY - this.points[0].y);
    if (dist < 180) {
      this.currentColor = this.type === "masculine" ? "#D97757" : "#C8A96A";
      this.opacity = Math.min(1, this.opacity + 0.05);
    } else {
      this.currentColor = this.baseColor;
      this.opacity = Math.max(0.1, this.opacity - 0.01);
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

  const getPathPoints = (pathString, samples = 100) => {
    if (typeof document === "undefined") return [];
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathString);
    const length = path.getTotalLength();
    const points = [];
    for (let i = 0; i < samples; i++) {
      const p = path.getPointAtLength((i / samples) * length);
      points.push({ x: p.x, y: p.y });
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;

    const manPoints = getPathPoints(MAN_PATH, 200);
    const womanPoints = getPathPoints(WOMAN_PATH, 200);

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

      // Create strokes that follow the man path
      for (let i = 0; i < 100; i++) {
        strokes.current.push(new Stroke(
          canvas, manPoints, "masculine", "#222", w * 0.15, h * 0.2
        ));
      }
      // Create strokes that follow the woman path
      for (let i = 0; i < 100; i++) {
        strokes.current.push(new Stroke(
          canvas, womanPoints, "feminine", "#444", w * 0.45, h * 0.2
        ));
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Periodically add new strokes to keep it evolving
      if (Math.random() > 0.98 && strokes.current.length < 300) {
        const isMasculine = Math.random() > 0.5;
        strokes.current.push(new Stroke(
          canvas, 
          isMasculine ? manPoints : womanPoints, 
          isMasculine ? "masculine" : "feminine", 
          isMasculine ? "#222" : "#444", 
          canvas.width * (isMasculine ? 0.15 : 0.45), 
          canvas.height * 0.2
        ));
      }

      strokes.current.forEach(s => {
        s.update(mouse.current.x, mouse.current.y);
        s.draw();
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
      {/* --- CANVAS AREA (70%) --- */}
      <div 
        className="w-[70%] relative bg-white border-r border-gallery-border/30 cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mouse.current.x = e.clientX - rect.left;
          mouse.current.y = e.clientY - rect.top;
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/canvas-orange.png')" }} />
        
        <div className="absolute bottom-10 left-10 text-[10vw] font-bold text-gallery-soft/40 select-none pointer-events-none">
          ART
        </div>
      </div>

      {/* --- CONTENT AREA (30%) --- */}
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
              Experience the convergence of technology and soul through our Living Canvas.
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
              <span className="text-[9px] tracking-[0.3em] uppercase">Interactive Portrait</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
