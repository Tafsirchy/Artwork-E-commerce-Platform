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
    const [r1,g1,b1] = hexToRgb(a);
    const [r2,g2,b2] = hexToRgb(b);
    return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
  } catch { return 999; }
}

// ── Particle ─────────────────────────────────────────────────────
class Particle {
  constructor(cx, cy) {
    this.cx = cx; // Store for draw method
    const core = Math.random() > 0.35; // 65% dense core
    const angle = Math.random() * Math.PI * 2;
    // Create a dense horizontal canopy
    const dist  = core
      ? Math.pow(Math.random(), 0.6) * 190
      : Math.pow(Math.random(), 0.85) * 380;

    this.baseX = cx + Math.cos(angle) * dist * 1.35; // wider spread
    this.baseY = cy + Math.sin(angle) * dist * 0.8 - 40; // lifted up slightly
    this.x = this.baseX;
    this.y = this.baseY;

    this.hue = Math.floor(Math.random() * 360);
    this.sat = 75 + Math.floor(Math.random() * 25); // Highly saturated like fresh paint
    this.lit = 45 + Math.floor(Math.random() * 20); // Bright
    this.hex = hslToHex(this.hue, this.sat, this.lit);
    this.color = `hsl(${this.hue},${this.sat}%,${this.lit}%)`;

    const rand = Math.random();
    // Many tiny splatters, a few large dots
    this.size = rand > 0.98 ? (Math.random() * 5 + 3) : (Math.random() * 1.5 + 0.5);
    this.type = rand > 0.93 ? 'splash' : (rand > 0.8 ? 'blob' : 'dot');

    this.alpha  = Math.random() * 0.65 + 0.35; // More opaque overall
    this.speed  = Math.random() * 0.003 + 0.001;
    this.dir    = Math.random() > 0.5 ? 1 : -1;
    this.dx     = Math.random() * 3000;
    this.dy     = Math.random() * 3000;
    this.pulse  = Math.random() * Math.PI * 2;
    this.hl     = 0; // highlight lerp 0→1
    this.isMatch = false;

    // Pre-computed artwork match ids (populated after artworks load)
    this.artworkIds = [];
  }

  // Called once when artworks load — O(artworks * colors) only once
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

    this.hl += ((this.isMatch ? 1 : 0) - this.hl) * 0.4; // Instant glow snap

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
    ctx.fillStyle   = this.color;
    ctx.shadowBlur  = this.hl > 0.05 ? this.hl * 30 : 0;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    if (this.type === 'splash') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = drawSz * 0.6;
      ctx.lineCap = "round";
      ctx.moveTo(this.x, this.y);
      const arcDir = this.baseX > this.cx ? 1 : -1; // Splatter outwards
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
    ctx.shadowBlur = 0;
  }
}

// ── Tree trunk ───────────────────────────────────────────────────
function drawTrunk(ctx, t, W, H, cx, cy) {
  ctx.save();
  const sw = Math.sin(t * 0.001) * 3;

  // Ground shadow
  const sg = ctx.createRadialGradient(cx+20, H-12, 5, cx+60, H-12, 190);
  sg.addColorStop(0, "rgba(0,0,0,0.3)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.ellipse(cx+45, H-12, 190, 22, 0, 0, Math.PI*2);
  ctx.fill();

  // Organic, thick, connected trunk using path
  ctx.fillStyle = "#110a08";
  ctx.beginPath();
  ctx.moveTo(cx - 75, H - 5); // Left base
  
  // Left trunk to left branch
  ctx.quadraticCurveTo(cx - 30 + sw, H - 120, cx - 25 + sw, cy + 40);
  ctx.quadraticCurveTo(cx - 130 + sw*2, cy - 70, cx - 200 + sw*2, cy - 120);
  
  // Inner left branch back to center
  ctx.quadraticCurveTo(cx - 100 + sw, cy - 30, cx - 5 + sw, cy + 20);
  
  // Center-left branch
  ctx.quadraticCurveTo(cx - 70 + sw*1.5, cy - 110, cx - 90 + sw*1.5, cy - 180);
  ctx.quadraticCurveTo(cx - 30 + sw, cy - 50, cx + 10 + sw, cy + 10);

  // Center-right branch
  ctx.quadraticCurveTo(cx + 90 + sw*1.5, cy - 130, cx + 120 + sw*1.5, cy - 190);
  ctx.quadraticCurveTo(cx + 40 + sw, cy - 60, cx + 25 + sw, cy + 15);

  // Right branch
  ctx.quadraticCurveTo(cx + 150 + sw*2, cy - 60, cx + 250 + sw*2, cy - 100);
  
  // Right trunk back down to base
  ctx.quadraticCurveTo(cx + 80 + sw, cy - 10, cx + 45 + sw, cy + 60);
  ctx.quadraticCurveTo(cx + 55, H - 120, cx + 90, H - 5); // Right base
  
  ctx.fill();

  // Add fine branches extending outward
  const B = (sx,sy,tx,ty,w) => {
    ctx.globalAlpha = 0.9; ctx.strokeStyle = "#110a08"; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(sx,sy);
    ctx.bezierCurveTo(sx+(tx-sx)*0.4,sy-20, sx+(tx-sx)*0.6,ty+20, tx,ty);
    ctx.stroke();
  };

  B(cx-170+sw*2, cy-100, cx-280+sw*2, cy-130, 4.5);
  B(cx-80+sw*1.5, cy-160, cx-140+sw*1.5, cy-220, 3.5);
  B(cx-10+sw, cy-130, cx-40+sw, cy-240, 3.5);
  B(cx+100+sw*1.5, cy-170, cx+160+sw*1.5, cy-230, 4);
  B(cx+210+sw*2, cy-85, cx+320+sw*2, cy-110, 4.5);

  // Texture lines on trunk
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  for(let i=0; i<3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 20 + i*15, H - 10);
    ctx.quadraticCurveTo(cx - 5 + i*10 + sw, H - 150, cx + 10 + i*5 + sw, cy + 50);
    ctx.stroke();
  }
  ctx.restore();
}

// ── Card positions (always visible inside wrapper) ────────────────
function randomPositions(n) {
  const pool = [
    { x:`${2+Math.random()*3}%`,  y:`${6+Math.random()*18}%`  },
    { x:`${2+Math.random()*3}%`,  y:`${44+Math.random()*18}%` },
    { x:`${80+Math.random()*3}%`, y:`${6+Math.random()*18}%`  },
    { x:`${80+Math.random()*3}%`, y:`${44+Math.random()*18}%` },
    { x:`${20+Math.random()*12}%`,y:`${4+Math.random()*10}%`  },
    { x:`${58+Math.random()*12}%`,y:`${4+Math.random()*10}%`  },
  ];
  return [...pool].sort(()=>Math.random()-.5).slice(0,n);
}

// ── Main component ────────────────────────────────────────────────
export default function TreeCanvas() {
  const canvasRef     = useRef(null);
  const containerRef  = useRef(null);
  const rafRef        = useRef(null);
  const frameRef      = useRef(0);
  const mouseRef      = useRef({ x: null, y: null });
  const hoverRef      = useRef(false);
  const particlesRef  = useRef([]);
  const matchedRef    = useRef(""); // prev match ids string
  const timerRef      = useRef(null);
  const bloomRef      = useRef(false);

  const [artworks,    setArtworks]    = useState([]);
  const [showCards,   setShowCards]   = useState(false);
  const [cards,       setCards]       = useState([]);
  const [positions,   setPositions]   = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // ── Fetch artworks ──────────────────────────────────────────────
  useEffect(() => {
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

  // ── Pre-compute particle matches when artworks load ─────────────
  useEffect(() => {
    if (!artworks.length || !particlesRef.current.length) return;
    particlesRef.current.forEach(p => p.computeMatches(artworks, 110));
  }, [artworks]);

  // ── Hover check (Highly optimized for 3000 particles) ───────────
  const checkHover = useCallback(() => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (mx === null) return;

    // Find particles near cursor (radius 240px for maximum ease of interaction)
    const r2 = 240 * 240;
    const idSet = new Set();
    const particles = particlesRef.current;
    const len = particles.length;

    // 1. Collect matched artwork ids from particles near the mouse
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

    // 2. Highlight matching particles everywhere
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      let match = false;
      const ids = p.artworkIds;
      for (let j = 0; j < ids.length; j++) {
        if (idSet.has(ids[j])) {
          match = true;
          break;
        }
      }
      p.isMatch = match;
    }

    if (idSet.size === 0) { matchedRef.current = ""; return; }

    const idStr = [...idSet].sort().join(",");
    if (idStr === matchedRef.current) return; // same match, no re-render
    matchedRef.current = idStr;

    const matched = (particlesRef.current[0]?.artworkIds
      ? artworks // ref to state — safe read in callback
      : []).filter(a => idSet.has(a._id)).slice(0, 6);

    setCards(matched);
    setPositions(randomPositions(matched.length));
    setShowCards(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowCards(false);
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        particles[i].isMatch = false;
      }
      matchedRef.current = "";
    }, 3000);
  }, [artworks]);

  // ── Canvas loop — runs once ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H, cx, cy;

    const resize = () => {
      W = canvas.width  = containerRef.current.offsetWidth;
      H = canvas.height = containerRef.current.offsetHeight;
      cx = W / 2; cy = H * 0.52; // Lowered canopy to reduce overall tree height
      // Drastically increased density: 3000 particles
      particlesRef.current = Array.from({ length: 3000 }, () => new Particle(cx, cy));
      // re-attach matches if artworks already loaded
      if (artworks.length) {
        particlesRef.current.forEach(p => p.computeMatches(artworks, 110));
      }
    };

    window.addEventListener("resize", resize);
    resize();
    setTimeout(() => { bloomRef.current = true; }, 400);

    const loop = (t) => {
      frameRef.current++;
      ctx.clearRect(0, 0, W, H);
      drawTrunk(ctx, t, W, H, cx, cy);

      // Hover check every single frame (60 FPS) for zero-lag tracking
      if (hoverRef.current) checkHover();

      if (bloomRef.current) {
        particlesRef.current.forEach(p => { p.update(); p.draw(ctx); });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      clearTimeout(timerRef.current);
    };
  }, [artworks, checkHover]);

  const onMove = useCallback((e) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  const onLeave = useCallback(() => {
    hoverRef.current = false;
    mouseRef.current = { x: null, y: null };
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      particles[i].isMatch = false;
    }
    matchedRef.current = "";
    // Let the 5s timer naturally dismiss the cards, so users have time to move their cursor to them.
  }, []);

  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      {/* Header */}
      <div className="max-w-4xl w-full px-6 text-center mb-16">
        <motion.p initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
          className="text-[10px] tracking-[0.6em] uppercase text-black/40 font-bold mb-3">
          Living Masterpiece
        </motion.p>
        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          transition={{ delay:0.1 }}
          className="text-4xl md:text-5xl font-serif text-black tracking-tight italic">
          The Breathing Canopy
        </motion.h2>
        <motion.div initial={{ width:0 }} whileInView={{ width:80 }}
          className="h-[1px] bg-black/10 mx-auto mt-8" />
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} transition={{ delay:0.4 }}
          className="mt-5 text-[11px] text-black/30 tracking-[0.35em] uppercase">
          Hover over the canopy — discover artworks by color
        </motion.p>
      </div>

      {/* Outer wrapper — no overflow clip so cards are never hidden */}
      <div className="relative container mx-auto px-6">

        {/* Canvas */}
        <motion.div ref={containerRef}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} transition={{ duration:1.5 }}
          className="relative w-full h-[550px] md:h-[750px]"
          onMouseMove={onMove}
          onMouseEnter={() => { hoverRef.current = true; }}
          onMouseLeave={onLeave}
        >
          <canvas ref={canvasRef} className="w-full h-full" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <motion.p animate={{ opacity:[0.2,0.5,0.2] }} transition={{ repeat:Infinity, duration:3.5 }}
              className="text-[9px] tracking-[0.4em] uppercase text-black/25 whitespace-nowrap">
              move cursor through the colors
            </motion.p>
          </div>
        </motion.div>

        {/* Artwork cards — zero JS overhead CSS animations */}
        <>
          {showCards && cards.map((art, i) => {
            // If hovering a specific card, hide the others
            if (hoveredCardId && hoveredCardId !== art._id) return null;

            const pos = positions[i] || { x:"50%", y:"10%" };
            return (
              <div key={`c-${art._id}`}
                className="absolute z-40 pointer-events-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out fill-mode-both"
                style={{ left:pos.x, top:pos.y, animationDelay: hoveredCardId ? "0ms" : `${i * 30}ms` }}
                onMouseEnter={() => {
                  setHoveredCardId(art._id);
                  clearTimeout(timerRef.current); // Pause dismiss timer
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  // Restart the 3s dismiss timer
                  timerRef.current = setTimeout(() => {
                    setShowCards(false);
                    const particles = particlesRef.current;
                    for (let j = 0; j < particles.length; j++) {
                      particles[j].isMatch = false;
                    }
                    matchedRef.current = "";
                  }, 3000);
                }}
              >
                <Link href={`/products/${art._id}`}>
                  <div className="group w-28 md:w-36 bg-white p-2 cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{ boxShadow:`0 8px 32px ${art.colorConcept[0]}40, 0 2px 8px rgba(0,0,0,0.14)` }}>

                    {/* Color swatches */}
                    <div className="flex gap-1 mb-2">
                      {art.colorConcept.slice(0,5).map((c,ci) => (
                        <div key={ci} className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor:c }} />
                      ))}
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
                      <Image src={art.imageUrl} alt={art.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background:`linear-gradient(to top, ${art.colorConcept[0]}50, transparent)` }} />
                    </div>

                    {/* Info */}
                    <div className="mt-2 px-0.5">
                      <p className="text-[9px] font-bold tracking-widest uppercase text-black/70 truncate leading-tight">
                        {art.title}
                      </p>
                      <p className="text-[8px] italic text-black/35 font-serif truncate mt-0.5">
                        {art.creator}
                      </p>
                      <p className="text-[8px] text-black/30 tracking-wider mt-1 uppercase">
                        View Portrait →
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </>
      </div>

      {/* Footer */}
      <div className="max-w-xl text-center px-6 mt-16">
        <p className="text-[11px] tracking-[0.3em] text-black/30 uppercase leading-relaxed italic font-medium">
          "A living painting where colors breathe, move, and respond — without losing its original artistic soul."
        </p>
      </div>
    </section>
  );
}
