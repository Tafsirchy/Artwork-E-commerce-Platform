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

  // Shading memory for user interaction
  const shadingRef = useRef([]);

  useEffect(() => {
    setHasMounted(true);
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

      // --- RESPONSIVE SCALING & CENTERING ---
      // The portrait is roughly 400x650 logical units. 
      // We'll scale it to fit the current canvas size while maintaining aspect ratio.
      const padding = 0;
      const logicalWidth = 400;
      const logicalHeight = 600;

      const scaleX = (canvas.width / window.devicePixelRatio - padding * 2) / logicalWidth;
      const scaleY = (canvas.height / window.devicePixelRatio - padding * 2) / logicalHeight;
      const scale = Math.min(scaleX, scaleY);

      const offsetX = (canvas.width / window.devicePixelRatio - logicalWidth * scale) / 2 - (200 * scale);
      const offsetY = (canvas.height / window.devicePixelRatio - logicalHeight * scale) / 2 - (50 * scale);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // --- DRAWING ---
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.arc(400, 400, 350, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      Object.values(PORTRAIT_PATHS).flat().forEach(stroke => {
        drawStroke(stroke, now);
      });

      shadingRef.current.forEach(point => {
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const totalElapsed = now - startTime;
      if (totalElapsed > 2500) {
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

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Viewport coordinates
    const viewX = e.clientX - rect.left;
    const viewY = e.clientY - rect.top;

    // Map to Logical coordinates (mirroring the render loop logic)
    const padding = 0;
    const logicalWidth = 400;
    const logicalHeight = 600;

    const scaleX = (canvas.width / window.devicePixelRatio - padding * 2) / logicalWidth;
    const scaleY = (canvas.height / window.devicePixelRatio - padding * 2) / logicalHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (canvas.width / window.devicePixelRatio - logicalWidth * scale) / 2 - (200 * scale);
    const offsetY = (canvas.height / window.devicePixelRatio - logicalHeight * scale) / 2 - (50 * scale);

    const x = (viewX - offsetX) / scale;
    const y = (viewY - offsetY) / scale;

    setMousePos({ x: viewX, y: viewY });

    if (isHovered && isPaintingActive) {
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

  const togglePainting = () => {
    setIsPaintingActive(!isPaintingActive);
  };

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center py-28">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT: INTERACTIVE CANVAS (65%) */}
          <div
            className="relative w-full lg:w-[65%] h-[50vh] lg:h-[80vh] cursor-none group/canvas bg-gallery-soft/10 rounded-[40px] border border-black/5 overflow-hidden shadow-inner"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={togglePainting}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ touchAction: 'none' }}
            />

            {/* --- LEFT: BRUSH SELECTOR --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-black/5 z-20 cursor-auto"
            >
              <p className="text-[8px] tracking-[0.3em] uppercase text-gallery-muted mb-2 text-center">Medium</p>
              <div className="flex flex-col gap-2">
                {BRUSHES.map((b) => (
                  <motion.button
                    key={b.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBrush(b);
                    }}
                    className={`text-[9px] py-2 px-3 rounded-none border transition-all duration-300 text-left ${activeBrush.name === b.name ? 'bg-gallery-text text-white border-gallery-text shadow-md' : 'bg-white/50 text-gallery-text border-transparent hover:border-gallery-gold/30'}`}
                  >
                    {b.name.split(' ')[1] || b.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* --- RIGHT: COLOR PALETTE --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-2xl border border-black/5 z-20 cursor-auto"
            >
              <p className="text-[8px] tracking-[0.3em] uppercase text-gallery-muted mb-2 text-center">Tints</p>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE.map((p, i) => (
                  <motion.button
                    key={p.name}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveColor(p);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-300 ${activeColor.name === p.name ? 'border-gallery-text scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                    style={{ backgroundColor: p.dot }}
                    title={p.name}
                  />
                ))}
              </div>
              <div className="w-full h-px bg-gallery-border/10 my-1" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  shadingRef.current = [];
                }}
                className="text-[8px] tracking-[0.2em] uppercase text-red-400 hover:text-red-600 transition-colors text-center"
              >
                Clear
              </motion.button>
            </motion.div>

            {/* Pencil Cursor & Double-Click Tooltip */}
            {hasMounted && isHovered && (
              <>
                <motion.div
                  className="absolute pointer-events-none z-50 text-gallery-text"
                  style={{
                    left: 0,
                    top: 0,
                    x: mousePos.x,
                    y: mousePos.y,
                  }}
                  animate={{
                    scale: isPaintingActive ? 1.2 : 1,
                    opacity: isPaintingActive ? 1 : 0.4
                  }}
                >
                  <Pencil size={24} className="-rotate-45" />
                  {/* Double Click Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-8 top-0 whitespace-nowrap bg-black/80 text-white text-[9px] tracking-[0.2em] uppercase py-1 px-3 rounded-full backdrop-blur-md"
                  >
                    {isPaintingActive ? 'Double Click to Stop' : 'Double Click to Paint'}
                  </motion.div>
                  <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full blur-sm ${isPaintingActive ? 'bg-gallery-gold animate-pulse' : 'bg-black/10'}`} />
                </motion.div>
              </>
            )}

            {/* Status Indicator */}
            <div className="absolute bottom-6 left-6 flex items-center gap-4 text-gallery-muted/40">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.4em] uppercase">Live Sketching</span>
                <span className="text-[10px] font-signature text-gallery-text">Series 0.4: "The Observant"</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={16} className="text-gallery-gold" />
                <span className="text-[10px] tracking-[0.6em] uppercase text-gallery-accent font-medium">Generative Soul</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-[1.1]">
                Art Comes <br />
                <span className="font-serif text-gallery-gold font-light">to Life</span>
              </h1>

              <p className="text-gallery-muted text-lg font-light leading-relaxed mb-12 border-l-2 border-gallery-gold/20 pl-8">
                Experience the meditative flow of a digital graphite pencil. A living portrait that reacts to your presence, evolving with every glance and movement.
              </p>

              <div className="space-y-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-6 bg-gallery-text text-white px-8 py-5 rounded-none hover:bg-gallery-primary transition-all duration-500 shadow-xl"
                >
                  <span className="text-xs tracking-[0.4em] uppercase font-bold">Acquire Original</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                </motion.button>

                <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted/60 pl-4">
                  * Interactive Shading Enabled
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default LivePencilSketch;
