"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AnimatedButton({ 
  href, 
  onClick,
  text = "See the beauty",
  containerClass = "mt-8",
  buttonClass = "border-[#e6e5dd]/30 hover:border-[#e6e5dd]",
  textClass = "text-[#e6e5dd] group-hover:text-[#9c9a87]",
  fillClass = "bg-[#e6e5dd]",
  delay = 0.4
}) {
  const content = (
    <>
      <span className={`text-[10px] tracking-[0.3em] uppercase z-10 transition-colors duration-500 ${textClass}`}>
        {text}
      </span>
      <motion.span 
        className={`z-10 transition-colors duration-500 ${textClass}`}
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        →
      </motion.span>
      <div className={`absolute inset-0 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-[0.77,0,0.175,1] ${fillClass}`} />
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={containerClass}
    >
      {onClick ? (
        <button onClick={onClick} className={`group relative px-8 py-3 flex items-center justify-center gap-3 border transition-colors duration-500 overflow-hidden ${buttonClass}`}>
          {content}
        </button>
      ) : (
        <Link href={href || "/products"} className={`group relative px-8 py-3 flex items-center justify-center gap-3 border transition-colors duration-500 overflow-hidden ${buttonClass}`}>
          {content}
        </Link>
      )}
    </motion.div>
  );
}
