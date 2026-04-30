"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ROTATIONS = [-6, 3, -4, 7, -3, 5, -7, 4];

export default function Shelf({ category, onSelect, onDeselect }) {
  const [hovered, setHovered] = useState(false);

  return (
    /* ── Outer wrapper: pure CSS positioning (never touched by GSAP/Framer) ── */
    <div
      className="absolute"
      style={category.position}
      onMouseEnter={() => {
        setHovered(true);
        onSelect(category);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onDeselect && onDeselect();
      }}
    >
      {/* ── Inner wrapper: Framer Motion animation only ── */}
      <motion.div
        className="flex flex-col items-center cursor-pointer"
        whileHover={{ y: -6, scale: 1.03 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
      {/* Category Label */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.3 }}
        className="mb-2 px-4 py-1 rounded-full text-[10px] tracking-[0.35em] uppercase font-medium"
        style={{
          backgroundColor: category.color,
          color: "#fff",
          boxShadow: hovered ? `0 4px 20px ${category.glowColor}` : "none",
        }}
      >
        {category.name}
      </motion.div>

      {/* Shelf Board + Miniature Images */}
      <div className="relative flex items-end justify-center gap-[3px] pb-1">
        {/* Miniature Paintings (standing on shelf) */}
        {category.artworks.map((art, i) => (
          <motion.div
            key={art.id}
            className="relative overflow-hidden shadow-md bg-white"
            style={{
              width: "48px",
              height: i % 3 === 0 ? "64px" : i % 3 === 1 ? "52px" : "58px",
              rotate: `${ROTATIONS[i % ROTATIONS.length]}deg`,
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
            animate={
              hovered
                ? { y: -3, boxShadow: `0 8px 24px ${category.glowColor}` }
                : { y: 0 }
            }
            transition={{ delay: i * 0.04, duration: 0.3 }}
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
        animate={{
          boxShadow: hovered
            ? `0 6px 30px ${category.glowColor}, 0 2px 6px rgba(0,0,0,0.15)`
            : "0 2px 6px rgba(0,0,0,0.12)",
        }}
        style={{
          width: category.position.width,
          height: "14px",
          background:
            "linear-gradient(180deg, #c8a97e 0%, #a0784c 50%, #8b6340 100%)",
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
    </motion.div>
    </div>
  );
}
