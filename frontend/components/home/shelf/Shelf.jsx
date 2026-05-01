"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ROTATIONS = [-6, 3, -4, 7, -3, 5, -7, 4];

function Leaf({ i }) {
  const greens = ["#4ade80", "#22c55e", "#16a34a", "#86efac", "#15803d", "#3b82f633"];
  const color = greens[i % 5]; // use 5 for color, 6th is just fallback if needed but we have 5 solid greens

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2 + Math.random(), 1, 0.8],
        y: [0, -10 - Math.random() * 30, 40 + Math.random() * 80],
        x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 70)],
        rotate: [0, (i % 2 === 0 ? 1 : -1) * (90 + Math.random() * 180)]
      }}
      transition={{ duration: 1.5 + Math.random() * 1.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 0.8 }}
      className="absolute z-10 pointer-events-none"
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: color,
        borderRadius: "0 60% 0 60%", // classic leaf shape
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
      }}
    />
  );
}

export default function Shelf({ category, onSelect, onDeselect }) {
  const [hovered, setHovered] = useState(false);
  const [labelHovered, setLabelHovered] = useState(false);

  return (
    /* ── Outer wrapper: pure CSS positioning (never touched by GSAP/Framer) ── */
    <div
      className="absolute"
      style={category.position}
    >
      {/* Category Label (Directional) - SIBLING to prevent modal trigger */}
      <motion.div
        onMouseEnter={(e) => { e.stopPropagation(); setLabelHovered(true); }}
        onMouseLeave={(e) => { e.stopPropagation(); setLabelHovered(false); }}
        onClick={() => onSelect(category)}
        initial={false}
        animate={{ 
          opacity: (hovered || labelHovered) ? 1 : 0.65, 
          x: category.direction === "left" ? ((hovered || labelHovered) ? -35 : -25) : ((hovered || labelHovered) ? 35 : 25),
          scale: (hovered || labelHovered) ? 1.05 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase font-bold whitespace-nowrap z-20 flex items-center gap-3 cursor-pointer"
        style={{
          [category.direction === "left" ? "right" : "left"]: "100%",
          backgroundColor: (hovered || labelHovered) ? category.color : "#efebe3",
          color: (hovered || labelHovered) ? "#fff" : "#8b6340",
          boxShadow: (hovered || labelHovered) ? `0 4px 20px ${category.glowColor}` : "0 2px 8px rgba(0,0,0,0.05)",
          border: `1px solid ${(hovered || labelHovered) ? "transparent" : "#d8cabc"}`
        }}
      >
        {category.direction === "left" && <span className="text-lg leading-none">←</span>}
        {category.name}
        {category.direction === "right" && <span className="text-lg leading-none">→</span>}
      </motion.div>

      {/* ── Inner wrapper: Framer Motion animation only ── */}
      <motion.div
        onMouseEnter={() => {
          setHovered(true);
          onSelect(category);
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (onDeselect) onDeselect();
        }}
        className="flex flex-col items-center cursor-pointer relative"
        whileHover={{ y: -6, scale: 1.03 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >

      {/* Shelf Board + Miniature Images */}
      <div className="relative flex items-end justify-center gap-[3px] pb-1">
        {/* Miniature Paintings (standing on shelf) */}
        {category.artworks.slice(0, 5).map((art, i) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 40, scale: 0.5, rotate: ROTATIONS[i % ROTATIONS.length] - 20 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: ROTATIONS[i % ROTATIONS.length] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden shadow-md bg-white origin-bottom"
            style={{
              width: "48px",
              height: i % 3 === 0 ? "64px" : i % 3 === 1 ? "52px" : "58px",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
            animate={{
              y: hovered ? -8 : [0, -3, 0],
              scale: hovered ? 1.15 : 1,
              rotate: hovered ? ROTATIONS[i % ROTATIONS.length] * 1.8 : ROTATIONS[i % ROTATIONS.length],
              boxShadow: hovered 
                ? `0 15px 35px ${category.glowColor}, 0 5px 15px rgba(0,0,0,0.2)` 
                : "0 4px 12px rgba(0,0,0,0.15)"
            }}
            transition={{
              y: hovered ? { type: "spring", stiffness: 400, damping: 20 } : { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 25 },
              rotate: { type: "spring", stiffness: 300, damping: 20 },
              opacity: { duration: 0.5, delay: i * 0.1 },
              default: { type: "spring", stiffness: 200, damping: 15, delay: i * 0.1 }
            }}
          >
            <Image
              src={art.image}
              alt={art.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          </motion.div>
        ))}
      </div>

      {/* Shelf Plank */}
      <motion.div
        className="rounded-sm relative"
        initial={{ scaleX: 0, opacity: 0, filter: "blur(4px)" }}
        whileInView={{ scaleX: 1, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        animate={{
          boxShadow: hovered
            ? `0 10px 40px ${category.glowColor}, 0 4px 10px rgba(0,0,0,0.2)`
            : "0 2px 6px rgba(0,0,0,0.12)",
        }}
        style={{
          width: category.position.width,
          height: "14px",
          background:
            "linear-gradient(180deg, #c8a97e 0%, #a0784c 50%, #8b6340 100%)",
          originX: category.position.left === "50%" ? 0.5 : (category.direction === "left" ? 1 : 0),
        }}
      >
        {/* Wood grain detail lines */}
        <div className="absolute inset-0 overflow-hidden opacity-30 rounded-sm">
          {[20, 45, 68].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 w-px bg-black/20"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>
        {/* Shadow under shelf */}
        <div className="absolute -bottom-2 left-2 right-2 h-2 bg-black/10 blur-sm rounded-full" />
      </motion.div>

      {/* Leaves Generation */}
      {labelHovered && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-30 flex items-center justify-center">
          {Array.from({ length: 24 }).map((_, i) => (
            <Leaf key={i} i={i} />
          ))}
        </div>
      )}

      </motion.div>
    </div>
  );
}
