"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const TestimonialCard = ({ item, onHover }) => (
  <div
    className="flex-shrink-0 w-[350px] px-3"
    onMouseEnter={() => onHover(item)}
    onMouseLeave={() => onHover(null)}
  >
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/40 backdrop-blur-xl p-8 rounded-none border border-black/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group overflow-hidden h-[220px] flex flex-col justify-between cursor-pointer"
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
        <p className="text-gallery-text text-base font-light italic leading-relaxed mb-4 line-clamp-3">
          "{item.content}"
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-gallery-gold/30" />
        <div>
          <p className="text-gallery-text font-bold tracking-[0.2em] uppercase text-[9px] mb-20.5">{item.name}</p>
          <p className="text-gallery-muted text-[8px] uppercase tracking-[0.3em] font-medium">{item.role}</p>
        </div>
      </div>
    </motion.div>
  </div>
);

const MarqueeRow = ({ items, direction = "left", onHover }) => {
  return (
    <div className="flex overflow-hidden group">
      <motion.div
        animate={{
          x: direction === "left" ? [0, "-33.33%"] : ["-33.33%", 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 120,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items, ...items].map((item, i) => (
          <TestimonialCard key={i} item={item} onHover={onHover} />
        ))}
      </motion.div>
    </div>
  );
};

export default function Testimonials() {
  const [hasMounted, setHasMounted] = useState(false);
  const [hoveredArt, setHoveredArt] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setHasMounted(true);
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/reviews");
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  if (!hasMounted || reviews.length === 0) return null;

  return (
    <section className="py-28 bg-gallery-soft/30 relative overflow-hidden">
      {/* Art Preview Modal/Overlay */}
      <AnimatePresence>
        {hoveredArt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
          >
            <div className="relative p-4 bg-white shadow-2xl border-8 border-white group">
              <motion.img
                src={hoveredArt.artImage}
                alt="Acquired Art"
                className="w-[400px] h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-80">Acquired Original</p>
                <p className="text-xl font-serif italic">{hoveredArt.name}'s Collection</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Dim when art is hovered */}
      <motion.div
        animate={{ opacity: hoveredArt ? 0.4 : 0 }}
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />

      {/* Abstract Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-gallery-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-gallery-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-gallery-gold/30 rounded-full mb-8"
          >
            <p className="text-gallery-accent text-[10px] tracking-[0.5em] uppercase">
              Collector Chronicles
            </p>
          </motion.div>
          <h2 className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4">
            Voices of the <br /> <span className="font-serif text-gallery-gold font-light">Incurious.</span>
          </h2>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-4">
          <MarqueeRow items={reviews} direction="left" onHover={setHoveredArt} />
          <MarqueeRow items={reviews.slice().reverse()} direction="right" onHover={setHoveredArt} />
        </div>

        {/* Bottom Detail */}
        <div className="mt-0 text-center">
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-px h-20 bg-gallery-gold/40 mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
