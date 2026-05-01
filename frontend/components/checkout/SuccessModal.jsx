"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SuccessModal({ isOpen, orderId, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gallery-bg/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-md border border-gallery-gold/40 shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden rounded-sm"
        >
          {/* Subtle artistic noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gallery-gold to-transparent opacity-70" />
          
          {/* Animated Colorful Flower SVG Background */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 flex justify-center items-center overflow-hidden mix-blend-multiply">
            <svg viewBox="0 0 200 200" className="w-[150%] h-[150%] max-w-none opacity-40">
              <motion.g
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 3, ease: "easeOut" }}
              >
                {/* Petal 1 */}
                <motion.path 
                  d="M100 100 C100 40, 160 40, 100 100" 
                  fill="none" stroke="#FF6B6B" strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fill: "transparent" }}
                  animate={{ pathLength: 1, opacity: 1, fill: "#FF6B6B" }}
                  transition={{ duration: 2, delay: 0.2 }}
                />
                {/* Petal 2 */}
                <motion.path 
                  d="M100 100 C160 100, 160 160, 100 100" 
                  fill="none" stroke="#4ECDC4" strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fill: "transparent" }}
                  animate={{ pathLength: 1, opacity: 1, fill: "#4ECDC4" }}
                  transition={{ duration: 2, delay: 0.4 }}
                />
                {/* Petal 3 */}
                <motion.path 
                  d="M100 100 C100 160, 40 160, 100 100" 
                  fill="none" stroke="#FFE66D" strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fill: "transparent" }}
                  animate={{ pathLength: 1, opacity: 1, fill: "#FFE66D" }}
                  transition={{ duration: 2, delay: 0.6 }}
                />
                {/* Petal 4 */}
                <motion.path 
                  d="M100 100 C40 100, 40 40, 100 100" 
                  fill="none" stroke="#6B5B95" strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0, fill: "transparent" }}
                  animate={{ pathLength: 1, opacity: 1, fill: "#6B5B95" }}
                  transition={{ duration: 2, delay: 0.8 }}
                />
                {/* Center */}
                <motion.circle 
                  cx="100" cy="100" r="10" 
                  fill="#FFF"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 1.5, type: "spring" }}
                />
              </motion.g>
            </svg>
          </div>

          {/* Animated Colorful Garden SVG Background */}
          <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-center items-center overflow-hidden">
            <svg viewBox="0 0 400 400" className="w-[120%] h-[120%] max-w-none">
              {/* Flower 1 - Bottom Left */}
              <motion.g initial={{ scale: 0, x: -100, y: 100 }} animate={{ scale: 1, x: -80, y: 80 }} transition={{ duration: 4, delay: 0.2 }}>
                {[0, 72, 144, 216, 288].map(rotate => (
                  <motion.path 
                    key={rotate} d="M100 100 C100 40, 160 40, 100 100" 
                    fill="#FFB7B2" stroke="#FF6B6B" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    style={{ rotate: `${rotate}deg`, originX: "100px", originY: "100px" }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                ))}
              </motion.g>
              {/* Flower 2 - Top Right */}
              <motion.g initial={{ scale: 0, x: 100, y: -100 }} animate={{ scale: 0.8, x: 120, y: -120 }} transition={{ duration: 5, delay: 0.5 }}>
                {[0, 60, 120, 180, 240, 300].map(rotate => (
                  <motion.path 
                    key={rotate} d="M100 100 C100 50, 150 50, 100 100" 
                    fill="#B2F2BB" stroke="#40C057" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    style={{ rotate: `${rotate}deg`, originX: "100px", originY: "100px" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                ))}
              </motion.g>
              {/* Flower 3 - Center (Subtle) */}
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1.5 }} transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map(rotate => (
                  <motion.path 
                    key={rotate} d="M100 100 C100 20, 120 20, 100 100" 
                    fill="#D0BFFF" stroke="#9775FA" strokeWidth="0.5"
                    style={{ rotate: `${rotate}deg`, originX: "100px", originY: "100px" }}
                  />
                ))}
              </motion.g>
            </svg>
          </div>

          <div className="p-10 text-center relative z-10">
            {/* Minimalist Animated Success Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.1 }}
              className="w-16 h-16 bg-gallery-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-xl"
            >
              <Check size={24} strokeWidth={1.5} />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 border-2 border-gallery-gold rounded-full"
              />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-light text-gallery-text tracking-widest uppercase mb-2"
            >
              Acquisition Complete
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gallery-muted tracking-[0.2em] uppercase text-[9px] font-bold mb-8 flex items-center justify-center gap-3"
            >
              <Sparkles size={12} className="text-gallery-gold" />
              A Masterpiece Joins Your Collection
              <Sparkles size={12} className="text-gallery-gold" />
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gallery-soft/80 backdrop-blur-sm p-6 mb-8 border border-gallery-border relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gallery-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] tracking-widest uppercase text-gallery-muted mb-2">Authenticity ID</p>
              <p className="font-mono text-sm tracking-widest text-gallery-text font-bold">#{orderId?.slice(-12).toUpperCase()}</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/dashboard"
                className="col-span-2 py-4 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-black transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10">Enter Private Gallery</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <button 
                onClick={onClose}
                className="col-span-2 py-4 border border-gallery-border text-gallery-text text-[10px] tracking-[0.4em] uppercase hover:bg-gallery-soft transition-all"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
