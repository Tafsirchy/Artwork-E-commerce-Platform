"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ── Color utilities ──────────────────────────────────────────────
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0"), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function colorDist(a, b) {
  try {
    const [r1, g1, b1] = hexToRgb(a);
    const [r2, g2, b2] = hexToRgb(b);
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  } catch { return 999; }
}

// ── Particle ─────────────────────────────────────────────────────
class Particle {
  constructor(cx, cy) {
    this.cx = cx;
    const core = Math.random() > 0.35;
    const angle = Math.random() * Math.PI * 2;
    const dist = core
      ? Math.pow(Math.random(), 0.6) * 190
      : Math.pow(Math.random(), 0.85) * 380;

    this.baseX = cx + Math.cos(angle) * dist * 1.35;
    this.baseY = cy + Math.sin(angle) * dist * 0.8 - 40;
    this.x = this.baseX;
    this.y = this.baseY;

    this.hue = Math.floor(Math.random() * 360);
    this.sat = 75 + Math.floor(Math.random() * 25);
    this.lit = 45 + Math.floor(Math.random() * 20);
    this.hex = hslToHex(this.hue, this.sat, this.lit);
    this.color = `hsl(${this.hue},${this.sat}%,${this.lit}%)`;

    const rand = Math.random();
    this.size = rand > 0.98 ? (Math.random() * 5 + 3) : (Math.random() * 1.5 + 0.5);
    this.type = rand > 0.93 ? 'splash' : (rand > 0.8 ? 'blob' : 'dot');

    this.alpha = Math.random() * 0.65 + 0.35;
    this.speed = Math.random() * 0.003 + 0.001;
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.dx = Math.random() * 3000;
    this.dy = Math.random() * 3000;
    this.pulse = Math.random() * Math.PI * 2;
    this.hl = 0;
    this.isMatch = false;
    this.artworkIds = [];
  }

  computeMatches(artworks, threshold) {
    this.artworkIds = [];
    for (const a of artworks) {
      for (const c of (a.colorConcept || [])) {
        if (colorDist(this.hex, c) < threshold) {
          this.artworkIds.push(a._id);
          break;
        }
      }
    }
  }

  update() {
    this.dx += 0.007; this.dy += 0.007; this.pulse += 0.018;
    const ix = Math.sin(this.dx) * 2.2;
    const iy = Math.cos(this.dy) * 2.2;
    const ps = 1 + Math.sin(this.pulse) * 0.13;
    this.x += (this.baseX + ix - this.x) * 0.055;
    this.y += (this.baseY + iy - this.y) * 0.055;
    this.sz = this.size * ps;

    this.hl += ((this.isMatch ? 1 : 0) - this.hl) * 0.4;

    if (this.isMatch) {
      this.alpha = Math.min(1, this.alpha + 0.06);
    } else {
      this.alpha += this.speed * this.dir;
      if (this.alpha > 0.85 || this.alpha < 0.12) this.dir *= -1;
    }
  }

  draw(ctx) {
    const drawSz = this.sz * (1 + this.hl * 2);
    ctx.globalAlpha = this.isMatch ? Math.min(1, this.alpha + 0.5) : this.alpha;
    ctx.fillStyle = this.color;

    // ⚠️ REPLACED Expensive shadowBlur with a secondary glow fill for performance
    if (this.hl > 0.1) {
      ctx.save();
      ctx.globalAlpha = this.hl * 0.3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, drawSz * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    if (this.type === 'splash') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = drawSz * 0.6;
      ctx.lineCap = "round";
      ctx.moveTo(this.x, this.y);
      const arcDir = this.baseX > this.cx ? 1 : -1;
      ctx.quadraticCurveTo(
        this.x + arcDir * drawSz * 3, this.y - drawSz * 4,
        this.x + arcDir * drawSz * 6, this.y - drawSz * 1.5
      );
      ctx.stroke();
    } else if (this.type === 'blob') {
      ctx.arc(this.x, this.y, drawSz, 0, Math.PI * 2);
      ctx.arc(this.x + drawSz * 0.45, this.y + drawSz * 0.2, drawSz * 0.65, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(this.x, this.y, drawSz, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── Tree trunk ───────────────────────────────────────────────────
function drawTrunk(ctx, t, W, H, cx, cy) {
  ctx.save();
  const sw = Math.sin(t * 0.001) * 3;

  const sg = ctx.createRadialGradient(cx + 20, H - 12, 5, cx + 60, H - 12, 190);
  sg.addColorStop(0, "rgba(0,0,0,0.3)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.ellipse(cx + 45, H - 12, 190, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#110a08";
  ctx.beginPath();
  ctx.moveTo(cx - 75, H - 5);
  ctx.quadraticCurveTo(cx - 30 + sw, H - 120, cx - 25 + sw, cy + 40);
  ctx.quadraticCurveTo(cx - 130 + sw * 2, cy - 70, cx - 200 + sw * 2, cy - 120);
  ctx.quadraticCurveTo(cx - 100 + sw, cy - 30, cx - 5 + sw, cy + 20);
  ctx.quadraticCurveTo(cx - 70 + sw * 1.5, cy - 110, cx - 90 + sw * 1.5, cy - 180);
  ctx.quadraticCurveTo(cx - 30 + sw, cy - 50, cx + 10 + sw, cy + 10);
  ctx.quadraticCurveTo(cx + 90 + sw * 1.5, cy - 130, cx + 120 + sw * 1.5, cy - 190);
  ctx.quadraticCurveTo(cx + 40 + sw, cy - 60, cx + 25 + sw, cy + 15);
  ctx.quadraticCurveTo(cx + 150 + sw * 2, cy - 60, cx + 250 + sw * 2, cy - 100);
  ctx.quadraticCurveTo(cx + 80 + sw, cy - 10, cx + 45 + sw, cy + 60);
  ctx.quadraticCurveTo(cx + 55, H - 120, cx + 90, H - 5);
  ctx.fill();

  const B = (sx, sy, tx, ty, w) => {
    ctx.globalAlpha = 0.9; ctx.strokeStyle = "#110a08"; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + (tx - sx) * 0.4, sy - 20, sx + (tx - sx) * 0.6, ty + 20, tx, ty);
    ctx.stroke();
  };

  B(cx - 170 + sw * 2, cy - 100, cx - 280 + sw * 2, cy - 130, 4.5);
  B(cx - 80 + sw * 1.5, cy - 160, cx - 140 + sw * 1.5, cy - 220, 3.5);
  B(cx - 10 + sw, cy - 130, cx - 40 + sw, cy - 240, 3.5);
  B(cx + 100 + sw * 1.5, cy - 170, cx + 160 + sw * 1.5, cy - 230, 4);
  B(cx + 210 + sw * 2, cy - 85, cx + 320 + sw * 2, cy - 110, 4.5);

  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 20 + i * 15, H - 10);
    ctx.quadraticCurveTo(cx - 5 + i * 10 + sw, H - 150, cx + 10 + i * 5 + sw, cy + 50);
    ctx.stroke();
  }
  ctx.restore();
}

function randomPositions(n) {
  const pool = [
    { x: `${2 + Math.random() * 3}%`, y: `${6 + Math.random() * 18}%` },
    { x: `${2 + Math.random() * 3}%`, y: `${44 + Math.random() * 18}%` },
    { x: `${80 + Math.random() * 3}%`, y: `${6 + Math.random() * 18}%` },
    { x: `${80 + Math.random() * 3}%`, y: `${44 + Math.random() * 18}%` },
    { x: `${20 + Math.random() * 12}%`, y: `${4 + Math.random() * 10}%` },
    { x: `${58 + Math.random() * 12}%`, y: `${4 + Math.random() * 10}%` },
  ];
  return [...pool].sort(() => Math.random() - .5).slice(0, n);
}

export default function TreeCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: null, y: null });
  const hoverRef = useRef(false);
  const particlesRef = useRef([]);
  const matchedRef = useRef("");
  const timerRef = useRef(null);
  const bloomRef = useRef(false);

  const [artworks, setArtworks] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [cards, setCards] = useState([]);
  const [positions, setPositions] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    import("@/lib/api").then(({ default: api }) => {
      api.get("/products")
        .then(({ data }) => {
          const arr = Array.isArray(data) ? data : (data.products || []);
          const withColors = arr.filter(p => p.colorConcept?.length > 0);
          setArtworks(withColors);
        })
        .catch(err => console.error("[TreeCanvas] fetch failed:", err));
    });
  }, []);

  useEffect(() => {
    if (!artworks.length || !particlesRef.current.length) return;
    particlesRef.current.forEach(p => p.computeMatches(artworks, 110));
  }, [artworks]);

  const checkHover = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (mx === null) return;

    const radius = isTouchDevice ? 300 : 240;
    const r2 = radius * radius;
    const idSet = new Set();
    const particles = particlesRef.current;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const p = particles[i];
      const dx = p.x - mx;
      const dy = p.y - my;
      if (dx * dx + dy * dy < r2) {
        const ids = p.artworkIds;
        for (let j = 0; j < ids.length; j++) {
          idSet.add(ids[j]);
        }
      }
    }

    const idStr = [...idSet].sort().join(",");
    if (idStr === matchedRef.current) return;
    matchedRef.current = idStr;

    for (let i = 0; i < len; i++) {
      const p = particles[i];
      let match = false;
      if (idSet.size > 0) {
        const ids = p.artworkIds;
        for (let j = 0; j < ids.length; j++) {
          if (idSet.has(ids[j])) {
            match = true;
            break;
          }
        }
      }
      p.isMatch = match;
    }

    if (idSet.size === 0) {
      setShowCards(false);
      return;
    }

    const matched = artworks.filter(a => idSet.has(a._id)).slice(0, 4);
    setCards(matched);
    
    // Stabilize mobile positions
    if (isTouchDevice) {
        const mobilePositions = [
            { x: "5%", y: "15%" },
            { x: "55%", y: "15%" },
            { x: "5%", y: "55%" },
            { x: "55%", y: "55%" },
        ];
        setPositions(mobilePositions.slice(0, matched.length));
    } else {
        setPositions(randomPositions(matched.length));
    }
    
    setShowCards(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowCards(false);
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        particles[i].isMatch = false;
      }
      matchedRef.current = "";
    }, 5000);
  }, [artworks, isTouchDevice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    let W, H, cx, cy;
    const isVisible = { current: false };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible.current;
        isVisible.current = entry.isIntersecting;
        if (isVisible.current && !wasVisible) {
          rafRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    const resize = () => {
      W = canvas.width = containerRef.current.offsetWidth;
      H = canvas.height = containerRef.current.offsetHeight;
      cx = W / 2; cy = H * 0.52;
      particlesRef.current = Array.from({ length: 2500 }, () => new Particle(cx, cy));
      if (artworks.length) {
        particlesRef.current.forEach(p => p.computeMatches(artworks, 110));
      }
    };

    window.addEventListener("resize", resize);
    resize();
    setTimeout(() => { bloomRef.current = true; }, 400);

    const loop = (t) => {
      if (!isVisible.current) return;
      frameRef.current++;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      drawTrunk(ctx, t, W, H, cx, cy);
      if (hoverRef.current && frameRef.current % 4 === 0) {
        checkHover();
      }
      if (bloomRef.current) {
        const particles = particlesRef.current;
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          particles[i].update();
          particles[i].draw(ctx);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      clearTimeout(timerRef.current);
      observer.disconnect();
    };
  }, [artworks, checkHover]);

  const onMove = useCallback((e) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseRef.current = { x: clientX - r.left, y: clientY - r.top };
    hoverRef.current = true;
  }, []);

  const onLeave = useCallback(() => {
    hoverRef.current = false;
    mouseRef.current = { x: null, y: null };
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      particles[i].isMatch = false;
    }
    matchedRef.current = "";
  }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-white flex flex-col items-center">
      <div className="max-w-4xl w-full px-6 text-center mb-10 md:mb-16">
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase text-black/40 font-bold mb-3">
          Living Art
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif text-black tracking-tight italic">
          The Moving Tree
        </motion.h2>
        <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }}
          className="h-[1px] bg-black/10 mx-auto mt-6 md:mt-8" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-5 text-[9px] md:text-[11px] text-black/30 tracking-[0.3em] md:tracking-[0.35em] uppercase">
          {isTouchDevice ? "Move your finger to find art by color" : "Move your mouse to find art by color"}
        </motion.p>
      </div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div ref={containerRef}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5 }}
          className="relative w-full h-[450px] md:h-[750px] touch-none"
          onMouseMove={onMove}
          onTouchMove={onMove}
          onMouseEnter={() => { if (!isTouchDevice) hoverRef.current = true; }}
          onMouseLeave={onLeave}
          onTouchStart={() => { hoverRef.current = true; }}
          onTouchEnd={onLeave}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <motion.p animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3.5 }}
              className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-black/25 whitespace-nowrap">
              {isTouchDevice ? "swipe to see art" : "move mouse to see art"}
            </motion.p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showCards && cards.map((art, i) => {
            if (hoveredCardId && hoveredCardId !== art._id) return null;
            const pos = positions[i] || { x: "50%", y: "10%" };
            return (
              <motion.div key={`c-${art._id}`}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-40 pointer-events-auto"
                style={{ left: pos.x, top: pos.y }}
                onMouseEnter={() => {
                  setHoveredCardId(art._id);
                  clearTimeout(timerRef.current);
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  timerRef.current = setTimeout(() => {
                    setShowCards(false);
                    const particles = particlesRef.current;
                    for (let j = 0; j < particles.length; j++) {
                      particles[j].isMatch = false;
                    }
                    matchedRef.current = "";
                  }, 5000);
                }}
              >
                <Link href={`/products/${art._id}`}>
                  <div className="group w-32 md:w-40 bg-white p-2 md:p-3 shadow-2xl transition-transform duration-300"
                    style={{ borderBottom: `4px solid ${art.colorConcept[0]}` }}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50 mb-3">
                      <Image src={art.imageUrl} alt={art.title} fill className="object-cover" />
                    </div>
                    <div className="px-1 pb-1">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-black truncate">{art.title}</p>
                      <p className="text-[8px] italic text-black/40 font-serif truncate mt-1">View Art →</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="max-w-xl text-center px-6 mt-12 md:mt-16">
        <p className="text-[10px] md:text-[11px] tracking-[0.3em] text-black/30 uppercase leading-relaxed italic font-medium">
          "A painting that moves and reacts to you while staying true to its art."
        </p>
      </div>
    </section>
  );
}
