"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Eye } from "lucide-react";
import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import api from "@/lib/api";
import TestimonialsSkeleton from "../ui/TestimonialsSkeleton";

const TestimonialCard = memo(({ item, onSelect }) => (
  <div
    className="flex-shrink-0 w-[85vw] sm:w-[450px] px-3"
    onClick={() => onSelect(item)}
    onMouseEnter={() => onSelect(item)}
    onMouseLeave={() => onSelect(null)}
  >
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/90 p-6 sm:p-8 rounded-none border border-black/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group overflow-hidden h-[240px] sm:h-[220px] flex flex-col justify-between cursor-pointer transform-gpu"
    >
      {/* Decorative Quote Background */}
      <div className="absolute top-4 right-6 text-black/[0.03] group-hover:text-gallery-gold/10 transition-colors duration-700">
        <Quote size={60} strokeWidth={1} />
      </div>

      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-1">
            {Array.from({ length: item.stars || 5 }).map((_, s) => (
              <Star key={s} size={10} fill="#C8A96A" color="#C8A96A" />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-[7px] tracking-[0.2em] uppercase text-gallery-gold font-bold"
          >
            <Eye size={10} /> View Art
          </motion.div>
        </div>
        <p className="text-gallery-text text-sm sm:text-base font-light italic leading-relaxed mb-4 line-clamp-4 sm:line-clamp-3">
          "{item.content}"
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-gallery-gold/30" />
        <div>
          <p className="text-gallery-text font-bold tracking-[0.2em] uppercase text-[9px] mb-0.5">{item.name}</p>
          <p className="text-gallery-muted text-[8px] uppercase tracking-[0.3em] font-medium">{item.role}</p>
        </div>
      </div>
    </motion.div>
  </div>
));

const MarqueeRow = memo(({ items, direction = "left", onSelect, isActive }) => {
  if (items.length === 0) return null;

  return (
    <div className="flex overflow-hidden py-4 select-none">
      <div 
        className={`flex whitespace-nowrap will-change-transform ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } ${!isActive ? "[animation-play-state:paused]" : ""}`}
        style={{
          // Use a CSS variable to control speed based on item count for consistency
          "--marquee-duration": `${items.length * 8}s`,
          animationDuration: "var(--marquee-duration)",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite"
        }}
      >
        {/* We only need to duplicate once for a seamless CSS loop if using 50% shift */}
        {[...items, ...items, ...items].map((item, i) => (
          <TestimonialCard key={i} item={item} onSelect={onSelect} />
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
      `}</style>
    </div>
  );
});

export default function Testimonials() {
  const [hasMounted, setHasMounted] = useState(false);
  const [hoveredArt, setHoveredArt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/reviews");
        // Ensure we have at least a few items for the marquee to look good
        setReviews(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 } // Trigger earlier for smoother entry
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback((item) => {
    setHoveredArt(item);
  }, []);

  if (!hasMounted || reviews.length === 0) return <TestimonialsSkeleton />;

  return (
    <section 
      ref={sectionRef}
      className={`py-20 sm:py-28 bg-gallery-soft/30 relative overflow-hidden transition-opacity duration-700 opacity-100`}
    >
      {/* Art Preview Modal/Overlay */}
      <AnimatePresence>
        {hoveredArt && (
          <>
            {/* Backdrop for mobile (dimming entire screen) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHoveredArt(null)}
              className="fixed inset-0 bg-black/60 z-[90] md:z-50 backdrop-blur-sm md:pointer-events-none md:opacity-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-[90vw] md:w-auto p-0 md:pointer-events-none"
            >
              <div className="relative p-3 md:p-4 bg-white shadow-2xl border-4 md:border-8 border-white group mx-auto md:max-w-none rounded-none">
                {/* Close Button for mobile */}
                <button 
                  onClick={() => setHoveredArt(null)}
                  className="absolute -top-10 right-0 text-white md:hidden p-2 text-[10px] tracking-widest uppercase font-bold"
                >
                  Close [×]
                </button>
                
                <motion.img
                  src={hoveredArt.artImage}
                  alt="Acquired Art"
                  className="w-full md:w-[400px] h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                  <p className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase opacity-80 mb-1">Acquired Original</p>
                  <p className="text-lg md:text-xl font-serif italic">{hoveredArt.name}'s Collection</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Abstract Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-gallery-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-gallery-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12 sm:mb-20 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-gallery-gold/30 rounded-full mb-6 sm:mb-8"
          >
            <p className="text-gallery-accent text-[9px] sm:text-[10px] tracking-[0.5em] uppercase">
              Collector Chronicles
            </p>
          </motion.div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-gallery-text tracking-[0.2em] sm:tracking-widest uppercase mb-4 leading-tight">
            Voices of the <br /> <span className="font-serif text-gallery-gold font-light">Incurious.</span>
          </h2>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-2 sm:space-y-4">
          <MarqueeRow items={reviews} direction="left" onSelect={handleSelect} isActive={isVisible} />
          <MarqueeRow items={reviews.slice().reverse()} direction="right" onSelect={handleSelect} isActive={isVisible} />
        </div>

        {/* Bottom Detail */}
        <div className="mt-8 sm:mt-0 text-center">
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-px h-12 sm:h-20 bg-gallery-gold/40 mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
