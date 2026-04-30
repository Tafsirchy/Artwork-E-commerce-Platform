"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain } from "lucide-react";
import { shelfCategories } from "./shelfData";
import Shelf from "./Shelf";
import CategoryModal from "./CategoryModal";
import WeatherSystem from "./WeatherSystem";

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
  const [isRaining, setIsRaining] = useState(false);
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
    <section className="relative py-24 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: isRaining ? "#202836" : "#f8f6f2" }}>
      {/* Weather System */}
      <WeatherSystem active={isRaining} />

      {/* Weather Toggle Button Group */}
      <div className="absolute top-32 right-8 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsRaining(!isRaining)}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border shadow-lg hover:transition-all duration-500 text-[11px] font-bold tracking-[0.2em] uppercase overflow-hidden"
          style={{
            backgroundColor: isRaining ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)",
            borderColor: isRaining ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
            color: isRaining ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)"
          }}
        >
          {/* Subtle button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <CloudRain size={16} className={`${isRaining ? "text-blue-300" : "text-gray-500"} transition-colors duration-500`} />
          <span className="relative z-10">{isRaining ? "Clear Skies" : "Summon Storm"}</span>
        </button>

        <motion.div
          animate={{ 
            y: [0, -6, 0],
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="flex flex-col items-center pointer-events-none"
        >
          <div 
            className="text-[12px] font-black mb-1.5"
            style={{ color: isRaining ? "#93c5fd" : "#8b6340" }}
          >
            ↑
          </div>
          
          <div 
            className="px-3 py-1.5 rounded-sm border backdrop-blur-sm shadow-xl"
            style={{ 
              backgroundColor: isRaining ? "rgba(147, 197, 253, 0.1)" : "rgba(139, 99, 64, 0.05)",
              borderColor: isRaining ? "rgba(147, 197, 253, 0.3)" : "rgba(139, 99, 64, 0.2)"
            }}
          >
            <span 
              className="text-[8px] tracking-[0.6em] font-black uppercase text-center block"
              style={{ color: isRaining ? "#93c5fd" : "#8b6340" }}
            >
              {isRaining ? "Restore Serenity" : "Experience Atmosphere"}
            </span>
          </div>
        </motion.div>
      </div>

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
          className="text-[10px] tracking-[0.4em] uppercase mb-3"
          style={{ color: isRaining ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)" }}
        >
          Our Living Archive
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl font-light font-serif tracking-wide"
          style={{ color: isRaining ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)" }}
        >
          Explore the Collection
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 text-sm max-w-lg mx-auto"
          style={{ color: isRaining ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}
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
        style={{ width: "min(680px, 92%)", height: "860px" }}
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
        className="text-center text-[10px] tracking-[0.3em] uppercase mt-2"
        style={{ color: isRaining ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)" }}
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
