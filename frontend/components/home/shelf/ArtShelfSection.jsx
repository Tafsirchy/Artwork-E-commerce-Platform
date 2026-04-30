"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shelfCategories } from "./shelfData";
import Shelf from "./Shelf";
import CategoryModal from "./CategoryModal";

/* ─── SVG Tree (trunk + branches) ─────────────────────────────── */
function TreeSVG() {
  return (
    <svg
      viewBox="0 0 600 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main trunk */}
      <path
        d="M300 820 C298 720 295 620 300 520 C305 420 300 320 300 220 C300 160 300 100 300 60"
        stroke="url(#trunkGrad)"
        strokeWidth="36"
        strokeLinecap="round"
      />
      {/* Trunk texture */}
      <path
        d="M300 820 C298 720 295 620 300 520 C305 420 300 320 300 220"
        stroke="#7a5230"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.3"
        strokeDasharray="4 28"
      />

      {/* Top branch — Abstract */}
      <path d="M300 80 C300 80 300 60 300 40" stroke="url(#branchGrad)" strokeWidth="18" strokeLinecap="round" />

      {/* Upper-left branch — Landscape */}
      <path d="M300 210 C280 210 220 220 130 235" stroke="url(#branchGrad)" strokeWidth="20" strokeLinecap="round" />
      {/* Upper-right branch — Modern */}
      <path d="M300 210 C320 210 380 220 470 235" stroke="url(#branchGrad)" strokeWidth="18" strokeLinecap="round" />

      {/* Mid-left branch — Minimalism */}
      <path d="M300 390 C275 390 200 400 70 415" stroke="url(#branchGrad)" strokeWidth="22" strokeLinecap="round" />
      {/* Mid-right branch — Expressionism */}
      <path d="M300 390 C325 390 400 400 520 415" stroke="url(#branchGrad)" strokeWidth="20" strokeLinecap="round" />

      {/* Bottom branch — Illustration */}
      <path d="M300 590 C300 590 300 600 300 610" stroke="url(#branchGrad)" strokeWidth="26" strokeLinecap="round" />

      {/* Root flare */}
      <ellipse cx="300" cy="822" rx="80" ry="14" fill="#a0784c" opacity="0.25" />

      {/* Gradients */}
      <defs>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#c8a97e" />
          <stop offset="50%" stopColor="#a0784c" />
          <stop offset="100%" stopColor="#7a5230" />
        </linearGradient>
        <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#b08850" />
          <stop offset="100%" stopColor="#c8a97e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Main Section ─────────────────────────────────────────────── */
export default function ArtShelfSection() {
  const [activeCategory, setActiveCategory] = useState(null);
  const closeTimer = useRef(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActiveCategory(null), 250);
  }, [cancelClose]);

  const handleShelfEnter = useCallback((cat) => {
    cancelClose();
    setActiveCategory(cat);
  }, [cancelClose]);

  return (
    <section className="relative py-24 bg-[#f8f6f2] overflow-hidden">
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }}
      />

      {/* Section Header */}
      <div className="w-11/12 mx-auto text-center mb-6 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.4em] uppercase text-black/35 mb-3"
        >
          Our Living Archive
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl font-light font-serif text-black/80 tracking-wide"
        >
          Explore the Collection
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 text-sm text-black/40 max-w-lg mx-auto"
        >
          Hover over a shelf to unveil an entire world. Click to step inside.
        </motion.p>
      </div>

      {/* ─── Tree Shelf Stage ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative mx-auto"
        style={{ width: "min(680px, 92vw)", height: "860px" }}
      >
        {/* Tree SVG background */}
        <TreeSVG />

        {/* Floating ambient light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,169,126,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Shelves */}
        {shelfCategories.map((cat) => (
          <Shelf
            key={cat.name}
            category={cat}
            onSelect={handleShelfEnter}
            onDeselect={scheduleClose}
          />
        ))}

        {/* Ground shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "300px",
            height: "30px",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="text-center text-[10px] tracking-[0.3em] uppercase text-black/25 mt-2"
      >
        Hover a shelf · Click to explore
      </motion.p>

      {/* ─── Category Modal (Level 2) ────────────────────── */}
      <AnimatePresence>
        {activeCategory && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="contents"
          >
            <CategoryModal
              category={activeCategory}
              onClose={() => setActiveCategory(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
