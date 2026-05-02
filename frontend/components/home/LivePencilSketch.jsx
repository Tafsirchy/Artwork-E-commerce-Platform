"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Sparkles, ArrowRight } from 'lucide-react';

// --- STROKE DATA (Artistic Paths) ---
// Simplified coordinates for a portrait sketch.
// In a real production app, these would be exported from an SVG or specialized tool.
const PORTRAIT_PATHS = {
  face: [
    { points: [[400, 150], [330, 170], [280, 250], [260, 350], [280, 500], [400, 600], [520, 500], [540, 350], [520, 250], [470, 170], [400, 150]], delay: 0 }, // Jawline & Face
    { points: [[300, 120], [400, 100], [500, 120]], delay: 500 }, // Hairline top
  ],
  eyes: [
    { points: [[340, 300], [360, 290], [390, 300], [370, 315], [340, 300]], delay: 1000 }, // Left Eye
    { points: [[365, 302]], isPoint: true, size: 4, delay: 1200 }, // Left Pupil
    { points: [[420, 300], [450, 290], [470, 300], [450, 315], [420, 300]], delay: 1300 }, // Right Eye
    { points: [[445, 302]], isPoint: true, size: 4, delay: 1500 }, // Right Pupil
    { points: [[330, 280], [380, 270]], delay: 1100 }, // Left Brow
    { points: [[430, 270], [480, 280]], delay: 1400 }, // Right Brow
  ],
  nose: [
    { points: [[400, 310], [390, 400], [410, 400]], delay: 1800 }, // Bridge
    { points: [[380, 410], [400, 420], [420, 410]], delay: 2000 }, // Tip
  ],
  lips: [
    { points: [[360, 480], [400, 470], [440, 480], [400, 495], [360, 480]], delay: 2200 }, // Mouth outline
    { points: [[365, 482], [435, 482]], delay: 2300 }, // Center line
  ],
  hair: [
    { points: [[300, 150], [250, 200], [220, 350], [230, 550]], delay: 2500 }, // Left hair flow
    { points: [[280, 130], [200, 250], [180, 600]], delay: 2700 },
    { points: [[500, 150], [550, 200], [580, 350], [570, 550]], delay: 2600 }, // Right hair flow
    { points: [[520, 130], [600, 250], [620, 600]], delay: 2800 },
    { points: [[350, 110], [400, 90], [450, 110]], delay: 600 }, // Top volume
  ],
  dress: [
    { points: [[280, 600], [200, 750], [600, 750], [520, 600]], delay: 3000 }, // Collar/Shoulders
  ]
};

const PALETTE = [
  { name: 'Graphite', color: 'rgba(0, 0, 0, 0.2)', dot: '#000000' },
  { name: 'Terracotta', color: 'rgba(210, 105, 30, 0.15)', dot: '#D2691E' },
  { name: 'Gold', color: 'rgba(196, 164, 132, 0.2)', dot: '#C4A484' },
  { name: 'Dusty Rose', color: 'rgba(188, 143, 143, 0.15)', dot: '#BC8F8F' },
  { name: 'Sage', color: 'rgba(143, 188, 143, 0.15)', dot: '#8FBC8F' },
];

const BRUSHES = [
  { name: 'Fine Pencil', radius: 1, density: 5, scatter: 15 },
  { name: 'Graphite Stick', radius: 3, density: 4, scatter: 25 },
  { name: 'Soft Charcoal', radius: 6, density: 2, scatter: 45 },
  { name: 'Oil Pastel', radius: 5, density: 6, scatter: 15 },
  { name: 'Ink Pen', radius: 1, density: 10, scatter: 5 },
  { name: 'Watercolor', radius: 15, density: 1, scatter: 40 },
  { name: 'Airbrush', radius: 25, density: 1, scatter: 100 },
];

const LivePencilSketch = () => {
  const canvasRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(PALETTE[0]);
  const [activeBrush, setActiveBrush] = useState(BRUSHES[0]);
  const [isPaintingActive, setIsPaintingActive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [showTapHint, setShowTapHint] = useState(true);
  const [doubleTapActive, setDoubleTapActive] = useState(false);

  const shadingRef = useRef([]);

  useEffect(() => {
    setHasMounted(true);
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = container.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationFrame;
    let startTime = Date.now();

    const drawStroke = (stroke, currentTime) => {
      const elapsed = currentTime - startTime - stroke.delay;
      if (elapsed < 0) return;
      const strokeDuration = 1000;
      const t = Math.min(elapsed / strokeDuration, 1);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.isPoint) {
        if (t > 0) {
          ctx.arc(stroke.points[0][0], stroke.points[0][1], stroke.size * t, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fill();
        }
      } else {
        const points = stroke.points;
        const count = Math.floor(points.length * t);
        if (count > 0) {
          ctx.moveTo(points[0][0], points[0][1]);
          for (let i = 1; i < count; i++) {
            const jitterX = (Math.random() - 0.5) * 0.5;
            const jitterY = (Math.random() - 0.5) * 0.5;
            ctx.lineTo(points[i][0] + jitterX, points[i][1] + jitterY);
          }
          ctx.stroke();
        }
      }
    };

    const render = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const logicalWidth = 400;
      const logicalHeight = 600;
      const scaleX = (canvas.width / window.devicePixelRatio) / logicalWidth;
      const scaleY = (canvas.height / window.devicePixelRatio) / logicalHeight;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = (canvas.width / window.devicePixelRatio - logicalWidth * scale) / 2 - (200 * scale);
      const offsetY = (canvas.height / window.devicePixelRatio - logicalHeight * scale) / 2 - (50 * scale);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.setLineDash([5, 15]);
      ctx.beginPath(); ctx.arc(400, 400, 350, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      Object.values(PORTRAIT_PATHS).flat().forEach(stroke => drawStroke(stroke, now));
      shadingRef.current.forEach(point => {
        ctx.fillStyle = point.color;
        ctx.beginPath(); ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2); ctx.fill();
      });

      if (now - startTime > 2500) {
        ctx.fillStyle = 'rgba(210, 105, 30, 0.015)';
        ctx.beginPath();
        const lipPath = PORTRAIT_PATHS.lips[0].points;
        ctx.moveTo(lipPath[0][0], lipPath[0][1]);
        lipPath.forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.fill();
      }
      ctx.restore();
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handlePointerMove = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const viewX = clientX - rect.left;
    const viewY = clientY - rect.top;

    const logicalWidth = 400;
    const logicalHeight = 600;
    const scaleX = (canvas.width / window.devicePixelRatio) / logicalWidth;
    const scaleY = (canvas.height / window.devicePixelRatio) / logicalHeight;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvas.width / window.devicePixelRatio - logicalWidth * scale) / 2 - (200 * scale);
    const offsetY = (canvas.height / window.devicePixelRatio - logicalHeight * scale) / 2 - (50 * scale);

    const x = (viewX - offsetX) / scale;
    const y = (viewY - offsetY) / scale;

    setMousePos({ x: viewX, y: viewY });
    
    // 🚀 RESTORED: Draw if toggle is ON (mobile) OR mouse is DOWN (desktop)
    // 📱 Mobile Double-Tap Guard: Only paint if double-tap active OR it's a desktop hover
    const canPaint = (!isTouchDevice && (isPaintingActive || isMouseDown)) || (isTouchDevice && doubleTapActive && isPaintingActive);

    if (canPaint) {
      for (let i = 0; i < activeBrush.density; i++) {
        shadingRef.current.push({
          x: x + (Math.random() - 0.5) * activeBrush.scatter / scale,
          y: y + (Math.random() - 0.5) * activeBrush.scatter / scale,
          r: (Math.random() * activeBrush.radius + 1) / scale,
          color: activeColor.color
        });
      }
      if (shadingRef.current.length > 5000) shadingRef.current.shift();
    }
  };

  const handleTouchStart = (e) => {
    if (!isTouchDevice) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setDoubleTapActive(!doubleTapActive);
      setShowTapHint(false);
      setIsPaintingActive(true);
    }
    setLastTap(now);
    setIsMouseDown(true);
  };

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center py-12 md:py-28">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-20">

          {/* LEFT: INTERACTIVE CANVAS */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            <div
              className="relative w-full aspect-square md:aspect-auto md:h-[70vh] cursor-crosshair group/canvas bg-gallery-soft/10 rounded-2xl md:rounded-[40px] border border-black/5 overflow-hidden shadow-inner"
              style={{ touchAction: 'none' }}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
              onMouseDown={() => setIsMouseDown(true)}
              onMouseUp={() => setIsMouseDown(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={() => setIsMouseDown(false)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => { setIsHovered(false); setIsMouseDown(false); }}
            >
              <canvas ref={canvasRef} className="w-full h-full" style={{ touchAction: 'none' }} />

              {/* 📱 Mobile Double-Tap Instruction Popup */}
              {isTouchDevice && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/20 shadow-2xl"
                   >
                     <span className="text-[10px] tracking-[0.4em] uppercase font-black text-white whitespace-nowrap">
                       {doubleTapActive ? "Double Click to Stop" : "Double Click to Art"}
                     </span>
                   </motion.div>
                </div>
              )}
              
              {/* Desktop Sidebars (LG+) */}
              <div className="hidden lg:block">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-black/5 z-20 shadow-xl">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gallery-muted mb-2 text-center">Medium</p>
                  {BRUSHES.map((b) => (
                    <button key={b.name} onClick={() => setActiveBrush(b)} className={`text-[9px] py-3 px-4 rounded-none border transition-all ${activeBrush.name === b.name ? 'bg-gallery-text text-white border-gallery-text' : 'bg-white/50 text-gallery-text border-transparent'}`}>
                      {b.name.split(' ')[1] || b.name}
                    </button>
                  ))}
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-black/5 z-20 shadow-xl">
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gallery-muted mb-2 text-center">Tints</p>
                  <div className="grid grid-cols-2 gap-3">
                    {PALETTE.map((p) => (
                      <button key={p.name} onClick={() => setActiveColor(p)} className={`w-8 h-8 rounded-full border-2 ${activeColor.name === p.name ? 'border-gallery-text scale-110 shadow-lg' : 'border-transparent opacity-60'}`} style={{ backgroundColor: p.dot }} />
                    ))}
                  </div>
                  <button onClick={() => shadingRef.current = []} className="text-[8px] tracking-[0.2em] uppercase text-red-500 mt-2">Clear</button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-6 left-6 flex flex-col">
                <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted/60">Live Sketching</span>
                <span className="text-[10px] font-signature text-gallery-text">Series 0.4: "The Observant"</span>
              </div>

              {/* Toggle Paint Button (Mobile-First UI) */}
              <button 
                onClick={() => setIsPaintingActive(!isPaintingActive)}
                className={`absolute bottom-6 right-6 px-6 py-3 rounded-full text-[9px] tracking-[0.3em] uppercase font-bold transition-all duration-500 z-30 shadow-2xl lg:hidden ${isPaintingActive ? 'bg-gallery-gold text-white scale-110' : 'bg-white text-gallery-text'}`}
              >
                {isPaintingActive ? 'Stop Painting' : 'Start Painting'}
              </button>
            </div>

            {/* Mobile Artist's Toolbox (Visible on < LG) */}
            <div className="lg:hidden flex flex-col gap-6 bg-gallery-soft/20 p-6 rounded-2xl border border-black/5">
              <div className="flex flex-col gap-3">
                <p className="text-[8px] tracking-[0.4em] uppercase text-gallery-accent font-bold">Select Medium</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {BRUSHES.map((b) => (
                    <button key={b.name} onClick={() => setActiveBrush(b)} className={`whitespace-nowrap text-[10px] py-4 px-6 rounded-none border transition-all ${activeBrush.name === b.name ? 'bg-gallery-text text-white' : 'bg-white text-gallery-text border-black/5'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[8px] tracking-[0.4em] uppercase text-gallery-accent font-bold">Select Tint</p>
                <div className="flex gap-4 items-center">
                  {PALETTE.map((p) => (
                    <button key={p.name} onClick={() => setActiveColor(p)} className={`w-12 h-12 rounded-full border-4 ${activeColor.name === p.name ? 'border-gallery-gold scale-110' : 'border-transparent'}`} style={{ backgroundColor: p.dot }} />
                  ))}
                  <div className="w-px h-8 bg-black/10 mx-2" />
                  <button onClick={() => shadingRef.current = []} className="text-[10px] tracking-[0.2em] uppercase text-red-500 font-bold">Clear Canvas</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={16} className="text-gallery-gold" />
                <span className="text-[10px] tracking-[0.6em] uppercase text-gallery-accent font-medium">Generative Soul</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-6 leading-tight">
                Art Comes <br /> <span className="font-serif text-gallery-gold">to Life</span>
              </h1>
              <p className="text-gallery-muted text-base md:text-lg font-light leading-relaxed mb-10 border-l-2 border-gallery-gold/20 pl-8">
                Experience the meditative flow of a digital graphite pencil. A living portrait that reacts to your presence, evolving with every movement.
              </p>
              <button className="w-full md:w-auto group flex items-center justify-center gap-6 bg-gallery-text text-white px-10 py-5 rounded-none hover:bg-gallery-primary transition-all shadow-xl active:scale-95">
                <span className="text-xs tracking-[0.4em] uppercase font-bold">Acquire Original</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default LivePencilSketch;
