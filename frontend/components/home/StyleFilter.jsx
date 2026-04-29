"use client";

import { motion } from "framer-motion";

const categories = ["All", "Abstract", "Minimalism", "Modern", "Digital Art", "Oil Painting"];

export default function StyleFilter({ activeCategory, onFilter }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onFilter(category)}
            className="relative px-6 py-2 group overflow-hidden"
          >
            {/* Animated Background Pill */}
            <AnimatePill isActive={isActive} />
            
            {/* Category Text */}
            <span className={`relative z-10 text-[10px] tracking-[0.4em] uppercase transition-colors duration-500 ${
              isActive ? "text-white" : "text-gallery-muted group-hover:text-gallery-text"
            }`}>
              {category}
            </span>

            {/* Hover Dot */}
            {!isActive && (
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gallery-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId={`dot-${category}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function AnimatePill({ isActive }) {
  return (
    <div className="absolute inset-0 z-0">
      {isActive && (
        <motion.div
          layoutId="activeCategoryPill"
          className="absolute inset-0 bg-gallery-primary rounded-full shadow-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </div>
  );
}
