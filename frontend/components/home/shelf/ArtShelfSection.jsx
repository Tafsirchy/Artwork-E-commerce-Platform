"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { CloudRain } from "lucide-react";
import api from "@/lib/api";
import { shelfCategories as initialShelfData } from "./shelfData";
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
  const [shelfCategories, setShelfCategories] = useState(initialShelfData);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isRaining, setIsRaining] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const closeTimer = useRef(null);
  const openTimer = useRef(null);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const fetchArtworks = async () => {
      try {
        const { data } = await api.get("/products");
        const dbCategoryNames = [...new Set(data.map(p => p.category))].slice(0, 6);
        const updated = dbCategoryNames.map((catName, index) => {
          const layout = initialShelfData[index];
          const categoryProducts = data.filter(p => p.category === catName);
          return {
            ...layout,
            name: catName,
            artworks: categoryProducts.map(p => ({
              _id: p._id,
              id: p._id,
              title: p.title,
              artist: p.creator,
              price: `$${p.price.toLocaleString()}`,
              image: p.imageUrl,
              description: p.description
            }))
          };
        });
        setShelfCategories(updated);
      } catch (error) {
        console.error("Failed to fetch shelf artworks:", error);
      }
    };
    fetchArtworks();
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    if (selectedArtwork) return;
    closeTimer.current = setTimeout(() => setActiveCategory(null), 100);
  }, [cancelClose, selectedArtwork]);

  const handleShelfEnter = useCallback((cat) => {
    cancelClose();
    // 🚀 Mobile-First Fix: Instant interaction on touch, meditative delay on desktop
    const delay = isTouchDevice ? 0 : 1200;
    openTimer.current = setTimeout(() => {
      setActiveCategory(cat);
    }, delay);
  }, [cancelClose, isTouchDevice]);

  const containerRef = useRef(null);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: isRaining ? "#202836" : "#f8f6f2" }}>
      {/* Weather System */}
      <WeatherSystem active={isRaining} />

      {/* 🚀 Mobile-First Fix: Accessible Weather Toggle (Top-Right on mobile) */}
      <div className="absolute top-8 right-6 md:top-32 z-[100] md:z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsRaining(!isRaining)}
          aria-label={isRaining ? "Clear Skies" : "Summon Storm"}
          className="group relative flex items-center gap-2 px-6 py-4 md:px-5 md:py-2.5 rounded-full backdrop-blur-xl border shadow-2xl hover:transition-all duration-500 text-[11px] font-bold tracking-[0.2em] uppercase overflow-hidden"
          style={{
            backgroundColor: isRaining ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.8)",
            borderColor: isRaining ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
            color: isRaining ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.8)"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <CloudRain size={20} className={`${isRaining ? "text-blue-300" : "text-gallery-gold"} transition-colors duration-500`} />
          <span className="relative z-10 hidden sm:inline">{isRaining ? "Clear Skies" : "Summon Storm"}</span>
          <span className="relative z-10 sm:hidden">{isRaining ? "Clear" : "Storm"}</span>
        </button>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:flex flex-col items-center pointer-events-none"
        >
          <div className="text-[12px] font-black mb-1.5" style={{ color: isRaining ? "#93c5fd" : "#8b6340" }}>↑</div>
          <div className="px-3 py-1.5 rounded-sm border backdrop-blur-sm shadow-xl" style={{ backgroundColor: isRaining ? "rgba(147, 197, 253, 0.1)" : "rgba(139, 99, 64, 0.05)", borderColor: isRaining ? "rgba(147, 197, 253, 0.3)" : "rgba(139, 99, 64, 0.2)" }}>
            <span className="text-[8px] tracking-[0.6em] font-black uppercase text-center block" style={{ color: isRaining ? "#93c5fd" : "#8b6340" }}>
              {isRaining ? "Restore Serenity" : "Experience Atmosphere"}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />

      {/* Section Header */}
      <div className="w-11/12 mx-auto text-center mb-0 md:mb-6 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-[9px] md:text-[10px] uppercase mb-3 tracking-[0.4em]"
          style={{ color: isRaining ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)" }}
        >
          Our Living Archive
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-tight"
          style={{ color: isRaining ? "rgba(255,255,255,0.9)" : undefined }}
        >
          Explore the <br /> <span className="font-serif text-gallery-gold">Collection</span>
        </motion.h2>
      </div>

      {/* ─── Tree Shelf Stage ─────────────────────────────── */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2 }}
        className="relative mx-auto"
        style={{
          width: "min(680px, 95%)",
          height: isTouchDevice ? "640px" : "860px",
        }}
      >
        <TreeSVG />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,169,126,0.08) 0%, transparent 70%)" }} />

        {shelfCategories.map((cat) => (
          <Shelf key={cat.name} category={cat} onSelect={handleShelfEnter} onDeselect={scheduleClose} />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[9px] tracking-[0.3em] uppercase mt-4"
        style={{ color: isRaining ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)" }}
      >
        {isTouchDevice ? "Tap a shelf to explore" : "Hover a shelf · Click to explore"}
      </motion.p>

      {/* Modals */}
      <AnimatePresence>
        {activeCategory && (
          <CategoryModal category={activeCategory} onClose={() => setActiveCategory(null)} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} onSelectArtwork={setSelectedArtwork} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedArtwork && <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />}
      </AnimatePresence>
    </section>
  );
}
