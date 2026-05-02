"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MoveUpRight, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const Butterfly = ({ startX, startY, delay }) => {
  // Use a stable random seed for flight paths to avoid jumpiness during re-renders
  const xValues = [0, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 400, 0];
  const yValues = [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 300, 0];
  const rotations = [0, Math.random() * 45, -Math.random() * 45, Math.random() * 20, 0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0.8, 0],
        x: xValues,
        y: yValues,
        rotate: rotations,
      }}
      transition={{
        duration: 8 + Math.random() * 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      className="absolute z-10 pointer-events-none"
      style={{ left: startX, top: startY }}
    >
      <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
        <defs>
          <filter id="wing-glow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wing Flutter Group */}
        <motion.g
          animate={{ scaleX: [1, 0.05, 1] }}
          transition={{
            duration: 0.15 + Math.random() * 0.1,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ originX: "25px" }}
          filter="url(#wing-glow)"
        >
          {/* Left Wings */}
          <path d="M25 25 C 10 5, 2 12, 5 25 C 8 38, 15 35, 25 25" stroke="#C4A484" strokeWidth="0.8" fill="#C4A484" fillOpacity="0.2" />
          <path d="M25 25 C 5 25, 2 35, 10 40 C 18 45, 22 35, 25 25" stroke="#C4A484" strokeWidth="0.5" fill="#C4A484" fillOpacity="0.1" />

          {/* Right Wings */}
          <path d="M25 25 C 40 5, 48 12, 45 25 C 42 38, 35 35, 25 25" stroke="#C4A484" strokeWidth="0.8" fill="#C4A484" fillOpacity="0.2" />
          <path d="M25 25 C 45 25, 48 35, 40 40 C 32 45, 28 35, 25 25" stroke="#C4A484" strokeWidth="0.5" fill="#C4A484" fillOpacity="0.1" />
        </motion.g>

        {/* Body & Antennae */}
        <path d="M25 20 L 25 32" stroke="#C4A484" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M25 20 Q 22 15, 20 12" stroke="#C4A484" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M25 20 Q 28 15, 30 12" stroke="#C4A484" strokeWidth="0.5" fill="none" opacity="0.4" />
      </svg>
    </motion.div>
  );
};

const WelcomingDoraemon = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-10), { id: `dora-${Date.now()}-${Math.random()}`, x: Math.random() * 40 - 20 }]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[-5%] left-0 w-[300px] h-[400px] pointer-events-none hidden lg:block"
    >
      <svg viewBox="0 0 200 300" className="w-full h-full opacity-60 filter drop-shadow-lg">
        <defs>
          <radialGradient id="tail-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b30000" stopOpacity="0.7" />
          </radialGradient>
          <radialGradient id="body-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0096d7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0072a3" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Tail (Red Ball) */}
        <motion.circle
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          cx="35" cy="245" r="8" fill="url(#tail-grad)" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.5"
        />

        {/* Main Body & Head */}
        <circle cx="100" cy="110" r="75" fill="url(#body-grad)" stroke="#fff" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M45 165 Q 35 270, 100 270 Q 165 270, 155 165" fill="url(#body-grad)" stroke="#fff" strokeWidth="1" strokeOpacity="0.5" />

        {/* Face Detail (White inner area) */}
        <path d="M100 55 Q 160 55, 160 110 Q 160 165, 100 165 Q 40 165, 40 110 Q 40 55, 100 55 Z" fill="#fff" fillOpacity="0.6" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Large Iconic Eyes */}
        <circle cx="82" cy="85" r="14" fill="#fff" fillOpacity="0.7" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx="118" cy="85" r="14" fill="#fff" fillOpacity="0.7" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" />
        
        {/* Pupils with reflections */}
        <g opacity="0.6">
          <circle cx="85" cy="88" r="2.5" fill="#000" />
          <circle cx="84" cy="87" r="0.8" fill="#fff" />
          <circle cx="115" cy="88" r="2.5" fill="#000" />
          <circle cx="116" cy="87" r="0.8" fill="#fff" />
        </g>

        {/* Nose & Whiskers */}
        <circle cx="100" cy="108" r="7" fill="#ff0000" fillOpacity="0.8" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.4" />
        <path d="M100 115 L 100 155" stroke="#fff" strokeWidth="1" opacity="0.2" />
        <path d="M100 155 Q 100 165, 120 160 M 100 155 Q 100 165, 80 160" stroke="#fff" strokeWidth="1" fill="none" opacity="0.3" />

        {/* Dynamic Whiskers */}
        <g stroke="#fff" strokeWidth="0.8" opacity="0.2">
          <path d="M75 120 L 35 110 M 75 130 L 30 130 M 75 140 L 35 150" />
          <path d="M125 120 L 165 110 M 125 130 L 170 130 M 125 140 L 165 150" />
        </g>

        {/* Collar & Golden Bell */}
        <path d="M45 165 L 155 165" stroke="#ff0000" strokeWidth="6" strokeOpacity="0.6" strokeLinecap="round" />
        <circle cx="100" cy="175" r="13" fill="#ffd700" fillOpacity="0.7" stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="100" cy="178" r="2.5" fill="#333" opacity="0.5" />

        {/* 4D Pocket (Pouch) */}
        <path d="M65 195 Q 100 245, 135 195 L 65 195" fill="#fff" fillOpacity="0.4" stroke="#fff" strokeWidth="1" strokeOpacity="0.3" />

        {/* Paws */}
        <circle cx="35" cy="180" r="18" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="165" cy="180" r="18" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.2" />
      </svg>

      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, y: -180, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute top-[65%] left-1/2 text-gallery-gold"
            style={{ marginLeft: h.x - 10 }}
          >
            <Heart size={22} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const KissingCat = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-10), { id: `kiss-${Date.now()}-${Math.random()}`, x: Math.random() * 40 - 20 }]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute bottom-[-5%] right-0 w-[300px] h-[400px] pointer-events-none hidden lg:block"
    >
      <svg viewBox="0 0 200 300" className="w-full h-full opacity-60 filter drop-shadow-lg">
        <defs>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cat-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf5e6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#faebd7" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Tail */}
        <motion.path
          animate={{
            d: [
              "M140 220 Q 160 200, 180 230 T 160 280",
              "M140 220 Q 180 180, 200 230 T 180 290",
              "M140 220 Q 160 200, 180 230 T 160 280"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          stroke="#fdf5e6"
          strokeWidth="12"
          strokeOpacity="0.4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Body */}
        <path
          d="M100 260 Q 150 260, 160 200 Q 170 140, 100 140 Q 30 140, 40 200 Q 50 260, 100 260 Z"
          fill="url(#cat-body)"
          stroke="#fff"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Front Legs */}
        <path d="M75 250 L 75 285 Q 75 295, 85 295" stroke="#fdf5e6" strokeWidth="8" strokeOpacity="0.4" fill="none" strokeLinecap="round" />
        <path d="M125 250 L 125 285 Q 125 295, 115 295" stroke="#fdf5e6" strokeWidth="8" strokeOpacity="0.4" fill="none" strokeLinecap="round" />

        {/* Ears */}
        <path d="M65 155 L 50 110 L 85 140" fill="#fdf5e6" fillOpacity="0.5" stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M135 155 L 150 110 L 115 140" fill="#fdf5e6" fillOpacity="0.5" stroke="#fff" strokeWidth="1" strokeOpacity="0.4" />

        {/* Expressive Eyes */}
        <g filter="url(#eye-glow)" opacity="0.6">
          <circle cx="80" cy="180" r="4" fill="#32cd32" />
          <circle cx="80" cy="180" r="1.5" fill="#000" />
          <circle cx="120" cy="180" r="4" fill="#32cd32" />
          <circle cx="120" cy="180" r="1.5" fill="#000" />
        </g>

        {/* Nose & Mouth */}
        <circle cx="100" cy="198" r="3" fill="#ffb6c1" fillOpacity="0.6" />
        <path d="M90 210 Q 100 220, 110 210" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.2" />

        {/* Whiskers */}
        <g stroke="#fff" strokeWidth="0.5" opacity="0.2">
          <path d="M60 195 L 20 185 M 60 200 L 20 200 M 60 205 L 20 215" />
          <path d="M140 195 L 180 185 M 140 200 L 180 200 M 140 205 L 180 215" />
        </g>
      </svg>

      {/* Floating Hearts (Kisses) */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 0.8, y: -180, scale: 1.4, rotate: 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute top-[65%] left-1/2 text-gallery-gold"
            style={{ marginLeft: h.x - 10 }}
          >
            <Heart size={22} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default function CTA() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <section className="pt-20 pb-24 sm:pt-28 sm:pb-36 bg-gallery-primary relative overflow-hidden group">
      {/* Artistic Background Layer */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gallery-gold/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gallery-accent/10 rounded-full blur-[120px]"
        />
        {/* Floating Particles - Desktop Only for performance */}
        {hasMounted && isDesktop && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -100],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
        {/* Global Butterfly Swarm - Desktop Only */}
        {hasMounted && isDesktop && Array.from({ length: 10 }).map((_, i) => (
          <Butterfly
            key={`butterfly-${i}`}
            startX={`${Math.random() * 100}%`}
            startY={`${Math.random() * 100}%`}
            delay={i * 1.5}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-px h-16 sm:h-24 bg-gradient-to-b from-gallery-gold/0 via-gallery-gold to-gallery-gold/0" />
            </div>
          </div>

          <p className="text-gallery-gold text-[10px] sm:text-xs tracking-[0.5em] sm:tracking-[0.8em] uppercase mb-6">
            A Home for Art
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-[0.2em] sm:tracking-widest uppercase mb-12 sm:mb-20 leading-tight">
            Start Your <br />
            <span className="font-serif text-gallery-gold font-light">Collection.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <Link
              href="/products"
              className="w-full sm:w-auto relative group/link px-12 sm:px-20 py-5 sm:py-7 bg-white text-gallery-primary text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase overflow-hidden rounded-none shadow-2xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-4 font-bold">
                See Art <MoveUpRight size={18} strokeWidth={2} />
              </span>
              <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover/link:translate-y-0 transition-transform duration-500" />
            </Link>

            <Link
              href="/register"
              className="group/link flex flex-col items-center gap-3"
            >
              <span className="text-white text-[10px] sm:text-[12px] tracking-[0.5em] sm:tracking-[0.6em] uppercase group-hover:text-gallery-gold transition-colors font-medium">
                Join Us
              </span>
              <div className="w-8 h-px bg-white/30 group-hover:bg-gallery-gold group-hover:w-20 sm:group-hover:w-24 transition-all duration-700" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* The Animals - Desktop Only */}
      {isDesktop && (
        <>
          <WelcomingDoraemon />
          <KissingCat />
        </>
      )}

      {/* Bottom Quote */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 text-center w-full px-6">
        <p className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-white/20 italic">
          "Find art that speaks to you"
        </p>
      </div>
    </section>
  );
}
