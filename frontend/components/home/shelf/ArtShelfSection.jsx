"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { CloudRain } from "lucide-react";
import { shelfCategories } from "./shelfData";
import Shelf from "./Shelf";
import CategoryModal from "./CategoryModal";
import WeatherSystem from "./WeatherSystem";
import ArtworkModal from "./ArtworkModal";

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
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        d="M300 820 C298 720 295 620 300 520 C305 420 300 320 300 220 C300 160 300 100 300 60"
        stroke="url(#trunkGrad)"
        strokeWidth="36"
        strokeLinecap="round"
      />
      {/* Trunk texture */}
      <motion.path
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
        d="M300 820 C298 720 295 620 300 520 C305 420 300 320 300 220"
        stroke="#7a5230"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="4 28"
      />

      {/* Top branch — Abstract */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2 }}
        d="M300 80 C300 80 300 60 300 40" stroke="url(#branchGrad)" strokeWidth="18" strokeLinecap="round"
      />

      {/* Upper-left branch — Landscape */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
        d="M300 210 C280 210 220 220 130 235" stroke="url(#branchGrad)" strokeWidth="20" strokeLinecap="round"
      />
      {/* Upper-right branch — Modern */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.7 }}
        d="M300 210 C320 210 380 220 470 235" stroke="url(#branchGrad)" strokeWidth="18" strokeLinecap="round"
      />

      {/* Mid-left branch — Minimalism */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        d="M300 390 C275 390 200 400 70 415" stroke="url(#branchGrad)" strokeWidth="22" strokeLinecap="round"
      />
      {/* Mid-right branch — Expressionism */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        d="M300 390 C325 390 400 400 520 415" stroke="url(#branchGrad)" strokeWidth="20" strokeLinecap="round"
      />

      {/* Bottom branch — Illustration */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        d="M300 590 C300 590 300 600 300 610" stroke="url(#branchGrad)" strokeWidth="26" strokeLinecap="round"
      />

      {/* Root flare */}
      <motion.ellipse
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.25 }}
        viewport={{ once: true }}
        cx="300" cy="822" rx="80" ry="14" fill="#a0784c"
      />

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
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isRaining, setIsRaining] = useState(false);
  const closeTimer = useRef(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    // Don't close if an artwork is being viewed
    if (selectedArtwork) return;
    closeTimer.current = setTimeout(() => setActiveCategory(null), 100);
  }, [cancelClose, selectedArtwork]);

  const handleShelfEnter = useCallback((cat) => {
    cancelClose();
    setActiveCategory(cat);
  }, [cancelClose]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const treeY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const treeRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
  const treeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  const smoothY = useSpring(treeY, { stiffness: 100, damping: 30 });
  const smoothRotate = useSpring(treeRotate, { stiffness: 100, damping: 30 });

  return (
    <section className="relative py-28 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: isRaining ? "#202836" : "#f8f6f2" }}>
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
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-[10px] uppercase mb-3"
          style={{ color: isRaining ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)" }}
        >
          Our Living Archive
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4"
          style={{ color: isRaining ? "rgba(255,255,255,0.9)" : undefined }}
        >
          Explore the <br /> <span className="font-serif text-gallery-gold">Collection</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 text-sm max-w-lg mx-auto font-light"
          style={{ color: isRaining ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}
        >
          Hover over a shelf to unveil an entire world. Click to step inside.
        </motion.p>
      </div>

      {/* ─── Tree Shelf Stage ─────────────────────────────── */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto"
        style={{
          width: "min(680px, 92%)",
          height: "860px",
          y: smoothY,
          rotate: smoothRotate,
          scale: treeScale
        }}
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
          <CategoryModal
            category={activeCategory}
            onClose={() => setActiveCategory(null)}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onSelectArtwork={setSelectedArtwork}
          />
        )}
      </AnimatePresence>

      {/* ─── Artwork Modal (Level 3) ────────────────────── */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
