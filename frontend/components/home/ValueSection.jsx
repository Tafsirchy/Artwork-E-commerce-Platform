"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Certified Authenticity",
    desc: "Every artwork comes with a physical Certificate of Authenticity signed by the artist."
  },
  {
    icon: Truck,
    title: "Museum-Grade Art Handling",
    desc: "Archival packaging and insured white-glove delivery, ensuring your acquisition arrives in pristine condition."
  },
  {
    icon: Sparkles,
    title: "Curated Excellence",
    desc: "Only 5% of submissions make it to our gallery, ensuring museum-grade quality."
  },
  {
    icon: HeartHandshake,
    title: "Collector's Support",
    desc: "Dedicated art advisors to help you build a collection that appreciates in value."
  }
];

const HostCurator = () => (
  <div className="relative w-full h-[600px] flex items-center justify-center">
    {/* Animated Background Aura */}
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="w-[400px] h-[400px] bg-gallery-gold/20 rounded-full blur-[100px]"
      />
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        opacity: { duration: 0.8 },
        scale: { duration: 0.8 }
      }}
      className="relative z-10 w-full max-w-[500px]"
    >
      <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Subtle Halo Layers */}
        <motion.circle
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          cx="200" cy="170" r="100" stroke="url(#gradient-gold)" strokeWidth="0.5"
        />
        <motion.circle
          animate={{ opacity: [0.02, 0.08, 0.02], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          cx="200" cy="170" r="130" stroke="url(#gradient-gold)" strokeWidth="0.25"
        />

        {/* Artistic Minimalist Head */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          d="M200 80 C 230 80, 260 120, 260 170 C 260 220, 230 260, 200 260 C 170 260, 140 220, 140 170 C 140 120, 170 80, 200 80 Z"
          stroke="url(#gradient-gold)"
          strokeWidth="1.2"
        />

        {/* Improved Constellation Body */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.2 }}
          d="M200 260 Q 200 400, 200 550 M 200 300 C 160 320, 120 380, 80 450 M 200 300 C 240 320, 280 380, 320 450"
          stroke="url(#gradient-gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Ethereal Flowing Garment - More Translucent & Dynamic */}
        <motion.path
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.12, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          d="M200 260 Q 380 400, 320 580 L 80 580 Q 20 400, 200 260 Z"
          fill="url(#gradient-gold)"
        />

        {/* Pulsing Constellation Nodes - Faster */}
        <motion.circle
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          cx="80" cy="450" r="5" fill="#C4A484"
        />
        <motion.circle
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
          cx="320" cy="450" r="5" fill="#C4A484"
        />

        <defs>
          <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4A484" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>

    {/* Floating Geometric Orbits */}
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        animate={{
          rotate: i * 120 + 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] border border-gallery-gold/5 rounded-full"
        style={{ transform: `rotate(${i * 45}deg)` }}
      />
    ))}
  </div>
);

const ValueCard = ({ item, i, align }) => (
  <motion.div
    initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay: i * 0.2 }}
    whileHover={{ y: -15, scale: 1.02 }}
    className={`group relative p-8 rounded-[2rem] border border-transparent hover:border-gallery-gold/20 transition-all duration-700 bg-white/30 backdrop-blur-md shadow-sm hover:shadow-2xl overflow-hidden ${align === 'right' ? 'text-left' : 'text-right'}`}
  >
    {/* Animated Background Shine */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-gallery-gold/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

    <div className={`flex flex-col ${align === 'right' ? 'items-start' : 'items-end'}`}>
      <motion.div
        className="w-16 h-16 bg-gallery-bg rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-gallery-primary group-hover:text-white transition-all duration-500 relative"
      >
        <item.icon size={24} strokeWidth={1.5} />
        <div className="absolute -inset-2 bg-gallery-gold/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      <h3 className="text-[12px] font-bold text-gallery-text mb-4 uppercase tracking-[0.4em] leading-tight">
        {item.title}
      </h3>

      <p className="text-gallery-muted text-[13px] leading-relaxed font-light">
        {item.desc}
      </p>
    </div>

    {/* Connection Line Decorator */}
    <div className={`absolute bottom-0 ${align === 'left' ? 'right-0' : 'left-0'} w-24 h-px bg-gradient-to-r from-transparent via-gallery-gold/20 to-transparent group-hover:via-gallery-gold transition-all duration-700`} />
  </motion.div>
);

export default function ValueSection() {
  return (
    <section className="py-28 bg-gallery-bg relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[15vw] font-serif italic text-black/[0.02] pointer-events-none select-none">
        Excellence
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 border border-gallery-gold/30 rounded-full mb-6"
          >
            <p className="text-gallery-accent text-[10px] tracking-[0.5em] uppercase">
              The Bristiii Standard
            </p>
          </motion.div>
          <h2 className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-none">
            Curated <br /> <span className="font-serif text-gallery-gold font-light">Perfection.</span>
          </h2>
        </div>

        {/* Creative Constellation Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-[1400px] mx-auto">
          {/* Left Wing */}
          <div className="w-full lg:w-[30%] space-y-20">
            <ValueCard item={values[0]} i={0} align="left" />
            <ValueCard item={values[1]} i={1} align="left" />
          </div>

          {/* Centerpiece: The Curator */}
          <div className="w-full lg:w-[40%]">
            <HostCurator />
          </div>

          {/* Right Wing */}
          <div className="w-full lg:w-[30%] space-y-20">
            <ValueCard item={values[2]} i={2} align="right" />
            <ValueCard item={values[3]} i={3} align="right" />
          </div>
        </div>

        {/* Bottom Call to Action or Detail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
          <div className="w-px h-24 bg-gradient-to-b from-gallery-gold/0 via-gallery-gold to-gallery-gold/0 mx-auto" />
          <p className="mt-8 text-[11px] tracking-[0.6em] uppercase text-gallery-muted">
            Est. 2024 • Gallery of Souls
          </p>
        </motion.div>
      </div>
    </section>
  );
}
