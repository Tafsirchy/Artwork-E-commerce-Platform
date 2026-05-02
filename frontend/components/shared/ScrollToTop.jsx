"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercentage = (scrolled / scrollHeight) * 100;

      if (scrollPercentage > 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-24 right-0 z-[100] cursor-pointer group"
          onClick={scrollToTop}
        >
          <div className="relative flex items-center">
            {/* The "Notice" Body - Vertical Tag */}
            <motion.div
              whileHover={{ x: -10 }}
              className="relative w-12 h-48 bg-gallery-primary border-l border-y border-gallery-gold/40 shadow-[-10px_0_30px_rgba(0,0,0,0.4)] flex flex-col items-center justify-between py-6 overflow-hidden"
              style={{ borderRadius: "24px 0 0 24px" }}
            >
              {/* Animated Colorful Background SVG */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <svg width="100%" height="100%" viewBox="0 0 100 400" preserveAspectRatio="none">
                  <motion.path
                    animate={{
                      d: [
                        "M0 0 Q 50 100, 100 0 V 400 Q 50 300, 0 400 Z",
                        "M0 0 Q 20 150, 100 0 V 400 Q 80 250, 0 400 Z",
                        "M0 0 Q 50 100, 100 0 V 400 Q 50 300, 0 400 Z"
                      ]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    fill="url(#liquid-gold)"
                  />
                  <defs>
                    <linearGradient id="liquid-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#C4A484" />
                      <stop offset="50%" stopColor="#8B6340" />
                      <stop offset="100%" stopColor="#C4A484" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Top Animated Arrow */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10 text-gallery-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </motion.div>

              {/* Vertical Text */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                {["T", "O", "P"].map((char, i) => (
                  <span key={i} className="text-white text-[10px] font-black tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity font-sans">
                    {char}
                  </span>
                ))}
              </div>

              {/* Decorative Dot */}
              <div className="relative z-10 w-1.5 h-1.5 bg-gallery-gold rounded-full shadow-[0_0_10px_#C4A484]" />
            </motion.div>

            {/* Side Accent Line (Interactive) */}
            <motion.div 
              className="w-1 h-32 bg-gallery-gold/20 relative"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
            >
               <motion.div 
                 animate={{ top: ["0%", "100%", "0%"] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-gallery-gold to-transparent"
               />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

