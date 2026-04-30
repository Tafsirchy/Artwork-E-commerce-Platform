"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherSystem({ active }) {
  const [lightning, setLightning] = useState(false);
  const [strikePos, setStrikePos] = useState("50%");

  useEffect(() => {
    if (!active) {
      setLightning(false);
      return;
    }

    const interval = setInterval(() => {
      // Random lightning bursts every 3-6 seconds
      if (Math.random() > 0.4) {
        setStrikePos(Math.random() * 80 + 10 + "%"); // Random strike position across sky
        setLightning(true);
        setTimeout(() => setLightning(false), 50);
        setTimeout(() => setLightning(true), 150);
        setTimeout(() => setLightning(false), 300);

        // Sometimes a third massive flash
        if (Math.random() > 0.5) {
          setTimeout(() => setLightning(true), 400);
          setTimeout(() => setLightning(false), 500);
        }
      }
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {/* Ambient Storm Darkening */}
          <div className="absolute inset-0 bg-[#0f172a]/50 mix-blend-multiply" />

          {/* Lightning Screen Flash Overlay */}
          <motion.div
            animate={{ opacity: lightning ? 0.9 : 0 }}
            transition={{ duration: 0.05 }}
            className="absolute inset-0 bg-white mix-blend-overlay z-10"
          />

          {/* Lightning Bolt (Actual strike) */}
          <motion.div
            animate={{ opacity: lightning ? 0.7 : 0 }}
            transition={{ duration: 0.05 }}
            className="absolute top-0 w-8 h-full bg-white blur-md mix-blend-overlay z-10"
            style={{ left: strikePos, transform: "rotate(15deg) scaleY(1.5)" }}
          />

          {/* Massive Storm Clouds */}
          <div className="absolute top-[-10%] left-0 w-full h-[45%] opacity-90">
            {/* Deep dark cloud layer */}
            <motion.div
              animate={{ x: ["-5%", "5%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute top-[0%] left-[-10%] w-[60%] h-[100%] bg-[#020617] rounded-full blur-[80px]"
            />
            <motion.div
              animate={{ x: ["5%", "-5%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute top-[5%] right-[-10%] w-[70%] h-[90%] bg-[#0f172a] rounded-full blur-[100px]"
            />
            {/* Mid-grey cloud layer */}
            <motion.div
              animate={{ x: ["-2%", "3%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute top-[15%] left-[20%] w-[50%] h-[80%] bg-[#1e293b] rounded-full blur-[70px] opacity-80"
            />
            <motion.div
              animate={{ x: ["4%", "-4%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute top-[10%] right-[20%] w-[40%] h-[75%] bg-[#334155] rounded-full blur-[60px] opacity-60"
            />
          </div>

          {/* Heavy Rain Drops */}
          {Array.from({ length: 150 }).map((_, i) => {
            const isHeavy = Math.random() > 0.8;
            return (
              <motion.div
                key={i}
                initial={{
                  y: -100,
                  x: Math.random() * 120 - 10 + "vw",
                  opacity: 0
                }}
                animate={{
                  y: ["0vh", "110vh"],
                  opacity: [0, isHeavy ? 0.6 : 0.3, isHeavy ? 0.6 : 0.3, 0],
                }}
                transition={{
                  duration: isHeavy ? 0.4 + Math.random() * 0.2 : 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
                className={`absolute top-0 w-[2px] bg-gradient-to-b from-transparent via-[#cbd5e1] to-transparent rotate-[15deg] ${isHeavy ? 'h-32 blur-[1px]' : 'h-16'}`}
              />
            );
          })}

          {/* Rolling Ground Fog */}
          <div className="absolute bottom-[-10%] left-0 w-full h-[30%] opacity-40 mix-blend-screen">
            <motion.div
              animate={{ x: ["-10%", "10%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute bottom-0 left-[-20%] w-[80%] h-[100%] bg-[#94a3b8] rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ x: ["10%", "-10%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
              className="absolute bottom-0 right-[-20%] w-[80%] h-[100%] bg-[#cbd5e1] rounded-full blur-[120px]"
            />
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
