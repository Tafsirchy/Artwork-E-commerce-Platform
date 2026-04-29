"use client";

import { motion } from "framer-motion";

const styles = [
  "All Styles",
  "Abstract",
  "Minimalism",
  "Impressionism",
  "Modernism",
  "Digital Art",
  "Photography"
];

export default function StyleFilter({ activeStyle, setActiveStyle }) {
  return (
    <div className="py-12 border-b border-gallery-border">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted mb-6">
          🎭 Filter by Essence
        </p>
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          {styles.map((style, i) => (
            <motion.button
              key={style}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveStyle(style)}
              className={`text-xs tracking-[0.2em] uppercase transition-all relative pb-2 ${
                activeStyle === style 
                  ? "text-gallery-text font-medium" 
                  : "text-gallery-muted hover:text-gallery-text"
              }`}
            >
              {style}
              {activeStyle === style && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gallery-gold"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
