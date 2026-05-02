"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ART_PALETTE = [
  '#C4A484', // Gold
  '#2C3E50', // Slate
  '#E67E22', // Orange
  '#8E44AD', // Purple
  '#27AE60', // Green
  '#C0392B', // Crimson
  '#2980B9'  // Blue
];

const values = [
  {
    icon: ShieldCheck,
    title: "Real Art Guarantee",
    desc: "Every piece of art is real and signed by the artist."
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    desc: "We use strong packaging and insurance to make sure your art arrives in perfect condition."
  },
  {
    icon: Sparkles,
    title: "Best Quality",
    desc: "We only pick the best art for our gallery to ensure top quality."
  },
  {
    icon: HeartHandshake,
    title: "Help for You",
    desc: "Our experts help you find art that grows in value over time."
  }
];

const EaselCanvas = ({ isHovered, onHoverChange }) => {
  const [splashes, setSplashes] = useState([]);

  useEffect(() => {
    if (!isHovered) {
      setSplashes([]);
      return;
    }

    const interval = setInterval(() => {
      setSplashes(prev => [
        ...prev.slice(-15),
        {
          id: Math.random(),
          x: Math.random() * 160 + 30,
          y: Math.random() * 200 + 30,
          size: Math.random() * 70 + 20,
          color: ART_PALETTE[Math.floor(Math.random() * ART_PALETTE.length)],
          rotation: Math.random() * 360,
          shape: Math.floor(Math.random() * 3)
        }
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden md:overflow-visible"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.1 : 1.4) : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 1.1),
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.5 }}
          className="w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-gallery-gold/25 rounded-full blur-[80px] md:blur-[110px]"
        />
      </div>

      {/* 🚀 Mobile-First Scaling: Shrink easel to fit container on SM */}
      <div className="relative scale-[0.65] md:scale-100 origin-center transition-transform duration-500">
        <div className="relative w-[300px] h-[480px] z-10">
          <div className="absolute top-[487px] left-1/2 -translate-x-1/2 w-[240px] h-[12px] bg-black/40 blur-xl rounded-full opacity-40" />

          <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[16px] h-[350px] bg-gradient-to-b from-[#A67C3B] to-[#5A3F1D] shadow-inner z-0 rounded-t-sm" />
          <div className="absolute top-[320px] left-1/2 -translate-x-1/2 w-[16px] h-[120px] bg-gradient-to-b from-[#7A5A2B] to-[#362510] shadow-inner z-0 rounded-b-sm" />
          <div className="absolute top-[326px] left-[35px] w-[20px] h-[170px] bg-gradient-to-b from-[#D4A361] to-[#8C6B3E] rotate-[18deg] origin-top shadow-[4px_5px_15px_rgba(0,0,0,0.4)] z-0" />
          <div className="absolute top-[326px] right-[35px] w-[20px] h-[170px] bg-gradient-to-b from-[#D4A361] to-[#8C6B3E] -rotate-[18deg] origin-top shadow-[-4px_5px_15px_rgba(0,0,0,0.4)] z-0" />

          <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[220px] h-[260px] bg-[#F5F5F5] shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-10 border border-[#EBEBEB] overflow-hidden flex justify-center transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40px] h-[12px] bg-black/20 blur-[4px] rounded-b-full z-20" />

            <AnimatePresence>
              {isHovered && splashes.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0, rotate: s.rotation }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.6, filter: 'blur(12px)' }}
                  transition={{ duration: 0.8 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: s.x,
                    top: s.y,
                    width: s.size,
                    height: s.size,
                    backgroundColor: s.color,
                    borderRadius: s.shape === 0 ? '40% 60% 70% 30% / 40% 40% 60% 60%' : (s.shape === 1 ? '10% 90% 20% 80%' : '50%'),
                    mixBlendMode: 'multiply'
                  }}
                />
              ))}
            </AnimatePresence>
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/canvas-fabric.png")' }} />
          </div>

          <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[50px] h-[14px] bg-gradient-to-b from-[#E3BB82] to-[#B38546] shadow-[0_5px_8px_rgba(0,0,0,0.3)] z-20 rounded-sm" />
          <div className="absolute top-[24px] left-1/2 -translate-x-1/2 w-[24px] h-[16px] bg-[#D4A361] z-20" />
          <div className="absolute top-[310px] left-1/2 -translate-x-1/2 w-[260px] h-[16px] bg-gradient-to-b from-[#E3BB82] to-[#C89B5A] shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default function ValueSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 🚀 Mobile-First Logic: Auto-animate on mobile when visible
  const activeAnimation = isTouchDevice ? isVisible : isHovered;

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gallery-surface relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '100px 100px' }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 border border-gallery-gold/30 rounded-none mb-6 bg-white/50 backdrop-blur-sm shadow-sm">
            <p className="text-gallery-accent text-[9px] tracking-[0.6em] md:tracking-[0.8em] uppercase font-bold text-center pl-[0.6em] md:pl-[0.8em]">
              Our Promise
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-[1.1] md:leading-none">
            The Best <br /> <span className="font-serif text-gallery-gold font-light">Art.</span>
          </h2>
        </div>

        {/* 🚀 Mobile-First Layout: Reordered for vertical rhythm */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 max-w-[1400px] mx-auto">
          
          {/* Top Cards on Mobile / Left on Desktop */}
          <div className="w-full lg:w-[30%] space-y-4 md:space-y-12 lg:space-y-20 order-2 lg:order-1">
            <ValueCard item={values[0]} i={0} align="left" isActive={activeAnimation} />
            <ValueCard item={values[1]} i={1} align="left" isActive={activeAnimation} />
          </div>

          {/* Central Visual */}
          <div className="w-full lg:w-[40%] order-1 lg:order-2 h-[400px] md:h-[600px]">
            <EaselCanvas isHovered={activeAnimation} onHoverChange={setIsHovered} />
          </div>

          {/* Bottom Cards on Mobile / Right on Desktop */}
          <div className="w-full lg:w-[30%] space-y-4 md:space-y-12 lg:space-y-20 order-3">
            <ValueCard item={values[2]} i={2} align="right" isActive={activeAnimation} />
            <ValueCard item={values[3]} i={3} align="right" isActive={activeAnimation} />
          </div>
        </div>

        <div className="mt-20 md:mt-32 text-center">
          <div className="w-px h-16 md:h-24 bg-gradient-to-b from-gallery-gold/0 via-gallery-gold to-gallery-gold/0 mx-auto" />
          <p className="mt-8 text-[10px] md:text-[11px] tracking-[0.6em] uppercase text-gallery-muted">
            Opened in 2024 • Art for You
          </p>
        </div>
      </div>
    </section>
  );
}

// Sub-component Refactors
const ValueCard = ({ item, i, align, isActive }) => (
  <div className="relative">
    <motion.div
      animate={isActive ? {
        backgroundColor: ["rgba(255, 255, 255, 0.4)", "rgba(196, 164, 132, 0.15)", "rgba(142, 68, 173, 0.12)", "rgba(41, 128, 185, 0.12)", "rgba(255, 255, 255, 0.4)"],
        borderColor: ["#EBEBEB", "#C4A484", "#8E44AD", "#2980B9", "#EBEBEB"],
      } : {
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderColor: "#EBEBEB"
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      className={`relative p-6 md:p-10 rounded-none border bg-white/90 shadow-sm md:shadow-none transition-all duration-300 text-center lg:${align === 'right' ? 'text-left' : 'text-right'}`}
    >
      <div className={`flex flex-col items-center lg:${align === 'right' ? 'items-start' : 'items-end'}`}>
        <motion.div
          animate={isActive ? {
            backgroundColor: ["#F9F7F5", "#C4A484", "#8E44AD", "#2980B9", "#F9F7F5"],
            color: ["#1A1A1A", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#1A1A1A"],
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-14 h-14 rounded-none flex items-center justify-center mb-6 md:mb-8 shadow-inner border border-gallery-border transition-all duration-300"
        >
          <item.icon size={22} strokeWidth={1} />
        </motion.div>

        <div className={`mb-4 flex items-center gap-3 flex-row lg:${align === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="w-1 h-1 bg-gallery-gold" />
          <h3 className="text-[10px] font-bold text-gallery-text uppercase tracking-[0.4em] leading-tight">
            {item.title}
          </h3>
        </div>

        <p className="text-gallery-muted text-[13px] leading-relaxed font-light max-w-[280px]">
          {item.desc}
        </p>
      </div>

      {/* Decorative Lines - Only for Desktop */}
      <div className={`absolute top-1/2 ${align === 'left' ? '-right-40' : '-left-40'} w-40 h-40 pointer-events-none hidden lg:block z-0 -translate-y-1/2`}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="overflow-visible">
          <motion.path
            d={align === 'left' ? (i === 0 ? "M0 80 H 80 V 140 H 160" : "M0 80 H 80 V 20 H 160") : (i === 2 ? "M160 80 H 80 V 140 H 0" : "M160 80 H 80 V 20 H 0")}
            stroke="#C4A484"
            strokeWidth={isActive ? "2.5" : "1.5"}
            strokeDasharray={isActive ? "none" : "6 6"}
            opacity={isActive ? 1 : 0.4}
            transition={{ duration: 0.3 }}
          />
          <motion.circle
            cx="80"
            cy={align === 'left' ? (i === 0 ? 140 : 20) : (i === 2 ? 140 : 20)}
            r={isActive ? 7 : 4}
            fill="#C4A484"
            transition={{ duration: 0.3 }}
          />
        </svg>
      </div>
    </motion.div>
  </div>
);
