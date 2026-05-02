"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Sparkles, Zap, Ticket, X } from "lucide-react";
import { toast } from "react-toastify";
import usePromotionStore from "@/store/promotionStore";

export default function OfferSlider() {
  const { isSliderVisible, offers, globalDiscount, fetchPromotions } = usePromotionStore();
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [welcomeModal, setWelcomeModal] = useState(null); // { type: 'offer' | 'welcome', data?: any }

  useEffect(() => {
    const initializeEntrance = async () => {
      await fetchPromotions();

      // Only show once per session
      const hasVisited = sessionStorage.getItem("bristiii_visited");
      if (!hasVisited) {
        setTimeout(() => {
          // If offers exist, show the first one as an invitation
          const promotionStore = usePromotionStore.getState();
          if (promotionStore.offers && promotionStore.offers.length > 0) {
            setWelcomeModal({ type: 'offer', data: promotionStore.offers[0] });
          } else {
            setWelcomeModal({ type: 'welcome' });
          }
          sessionStorage.setItem("bristiii_visited", "true");
        }, 400); // Faster trigger for better responsiveness
      }
    };

    initializeEntrance();
  }, []);

  useEffect(() => {
    if (copiedCoupon) {
      console.log("Modal Triggered for:", copiedCoupon.code);
      const timer = setTimeout(() => setCopiedCoupon(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCoupon]);

  if (!isSliderVisible) return null;
  
  if (offers.length === 0) {
    return (
      <div className="bg-gallery-primary py-4 relative animate-pulse">
        <div className="flex justify-center gap-20">
          <div className="h-4 w-48 bg-white/10 rounded" />
          <div className="h-4 w-48 bg-white/10 rounded hidden sm:block" />
          <div className="h-4 w-48 bg-white/10 rounded hidden lg:block" />
        </div>
      </div>
    );
  }

  const handleCopy = (offer) => {
    console.log("Copying:", offer.code);
    navigator.clipboard.writeText(offer.code);
    setCopiedCoupon(offer);
  };

  return (
    <>
      <section className="bg-gallery-primary py-4 overflow-hidden relative group">
        {/* Decorative Aura */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gallery-accent/5 to-transparent pointer-events-none" />

        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center">
              {offers.map((offer) => (
                <div
                  key={`${idx}-${offer._id}`}
                  className="flex items-center gap-12 mx-12"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none border border-white/20 flex items-center justify-center text-gallery-accent">
                      <Ticket size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40 block">
                        {offer.type}
                      </span>
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-white">
                        {offer.title}: <span className="text-gallery-accent">{offer.discount}</span>
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => handleCopy(offer)}
                    className="px-4 py-1.5 border border-dashed border-gallery-gold/40 flex items-center gap-3 cursor-pointer hover:bg-gallery-gold/10 transition-colors group/copy"
                  >
                    <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-gallery-gold">Code:</span>
                    <span className="text-[11px] tracking-widest font-bold text-white">{offer.code}</span>
                  </div>

                  <div className="w-2 h-2 bg-white/10" />
                </div>
              ))}

              {globalDiscount > 0 && (
                <div className="flex items-center gap-12 mx-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none border border-gallery-accent/30 flex items-center justify-center text-gallery-accent animate-pulse">
                      <Zap size={14} fill="currentColor" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gallery-accent block">
                        Limited Time
                      </span>
                      <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-white">
                        Global Curator Discount: <span className="text-gallery-accent">{globalDiscount}% OFF EVERYTHING</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-white/10" />
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* 🎭 Success Modal: "The Chromesthesia Boom" */}
      <AnimatePresence>
        {copiedCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            {/* Full Screen Confetti Explosion */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    scale: [0, 1, 0.5, 0],
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 800,
                    rotate: Math.random() * 720,
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeOut",
                    times: [0, 0.1, 0.8, 1]
                  }}
                  className="absolute w-3 h-3"
                  style={{
                    backgroundColor: ['#FFD700', '#FF69B4', '#8A2BE2', '#00FFFF', '#FF4500'][i % 5],
                    borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '20%'
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, y: 100, opacity: 0, rotate: -10 }}
              animate={{
                scale: [0.8, 1.1, 1],
                y: 0,
                opacity: 1,
                rotate: 0
              }}
              exit={{ scale: 1.2, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-sm bg-white/10 backdrop-blur-3xl border border-white/20 p-10 text-center shadow-[0_0_100px_rgba(255,105,180,0.3)] relative pointer-events-auto"
            >
              {/* Central Popper Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-gallery-accent via-gallery-gold to-gallery-accent rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full text-white drop-shadow-2xl">
                  <Sparkles size={64} strokeWidth={1} className="animate-spin-slow" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 bg-gradient-to-r from-gallery-accent via-gallery-gold to-gallery-accent bg-clip-text text-transparent">
                  Boom!
                </h2>
                <p className="text-[10px] tracking-[0.5em] uppercase text-white/60 font-bold mb-8">
                  Discovery Acquired
                </p>

                <div className="space-y-1">
                  <span className="text-3xl font-black text-white tracking-widest block font-serif">
                    {copiedCoupon.code}
                  </span>
                  <p className="text-gallery-accent text-sm font-bold uppercase tracking-widest animate-pulse">
                    {copiedCoupon.discount} OFF YOUR COLLECTION
                  </p>
                </div>
              </motion.div>

              {/* Progress Bar (Auto-Close Visual) */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gallery-accent to-gallery-gold"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎭 Compact 3D Celebration Modal: "The Surprise Reveal" */}
      <AnimatePresence>
        {welcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="w-full max-w-md bg-[#E8A6A6] p-8 pt-24 pb-12 rounded-none border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative flex flex-col items-center overflow-visible"
            >
              {/* ✖ Manual Close Tab */}
              <button
                onClick={() => setWelcomeModal(null)}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-50 p-2"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {/* 🎀 Ribbon Confetti (Isolated Overflow) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <Ribbon key={i} />
                ))}
              </div>

              {/* 🎈 Balloons (Repositioned for larger modal) */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                <Balloon color="white" size="w-10 h-14" delay={0} />
                <Balloon color="#FF8C00" size="w-8 h-10" delay={0.5} />
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                <Balloon color="#FF8C00" size="w-10 h-14" delay={0.3} />
                <Balloon color="white" size="w-8 h-10" delay={0.8} />
              </div>

              {/* 🎁 The Surprise Box (Now with ample float space) */}
              <div className="mt-6 mb-10 relative overflow-visible">
                <SurpriseBox welcomeModal={welcomeModal} />
              </div>

              {/* 🎬 Reveal Info (Animated after box opens) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center z-20 relative"
              >
                <h2 className="text-white text-lg font-black tracking-widest uppercase mb-0.5">
                  Private Gift
                </h2>
                <p className="text-white/60 text-[7px] tracking-[0.5em] uppercase font-bold mb-6">
                  Discovery Awaits
                </p>

                <button
                  onClick={() => setWelcomeModal(null)}
                  className="px-8 py-2.5 bg-white text-[#E8A6A6] text-[9px] tracking-[0.4em] uppercase font-black hover:bg-[#FF8C00] hover:text-white transition-all shadow-xl"
                >
                  Collect Offer
                </button>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 7, ease: "linear" }}
                onAnimationComplete={() => setWelcomeModal(null)}
                className="absolute bottom-0 left-0 h-1 bg-white/30"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 80s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}

// 🧱 Refined 3D Components

function SurpriseBox({ welcomeModal }) {
  return (
    <div className="relative w-32 h-32 [perspective:1000px]">
      <div className="w-full h-full relative [transform-style:preserve-3d]">

        {/* 🎆 Floating Data (Emerges when lid opens) */}
        {welcomeModal.type === 'offer' && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -90, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            className="absolute top-0 left-0 w-full flex flex-col items-center z-[60]"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center min-w-[180px]">
              <span className="text-[8px] text-[#E8A6A6] uppercase tracking-[0.6em] font-black mb-2 opacity-60">Coupon Code</span>
              <h3 className="text-3xl font-black text-[#E8A6A6] tracking-widest uppercase italic mb-2">
                {welcomeModal.data.code}
              </h3>
              <div className="w-8 h-[1px] bg-[#FF8C00]/30 mb-2" />
              <p className="text-[#FF8C00] text-[11px] font-black uppercase tracking-[0.4em]">
                SAVE {welcomeModal.data.discount}
              </p>
            </div>
          </motion.div>
        )}

        {/* Box Lid (Animated Opening) */}
        <motion.div
          initial={{ rotateX: 0, y: 0 }}
          animate={{ rotateX: -110, y: -20, opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
          className="absolute -top-1 left-0 w-full h-4 bg-white border border-gray-100 origin-bottom z-20 flex items-center justify-center"
        >
          {/* Lid Ribbon */}
          <div className="w-1/4 h-full bg-[#FF8C00]" />
          {/* Bow (SVG) */}
          <div className="absolute -top-4 w-8 h-8 text-[#FF8C00]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50,50 C30,10 10,10 10,30 C10,50 30,50 50,50 Z" />
              <path d="M50,50 C70,10 90,10 90,30 C90,50 70,50 50,50 Z" />
            </svg>
          </div>
        </motion.div>

        {/* Box Body */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-white border border-gray-100 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Ribbons */}
          <div className="absolute h-full w-4 bg-[#FF8C00]" />
          {/* Interior Glow */}
          <div className="absolute inset-4 bg-gradient-to-t from-[#FF8C00]/20 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[#FF8C00]/40"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Balloon({ color, size, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
      className={`relative ${size} flex flex-col items-center`}
    >
      <div
        className="w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-lg"
        style={{ backgroundColor: color }}
      />
      <div className="w-[0.5px] h-8 bg-white/20 mt-[-1px]" />
    </motion.div>
  );
}

function Ribbon() {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomRotate = Math.random() * 360;

  return (
    <motion.div
      initial={{ top: `${randomY}%`, left: `${randomX}%`, rotate: randomRotate }}
      animate={{
        y: [0, 30, 0],
        rotate: [randomRotate, randomRotate + 180, randomRotate]
      }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity }}
      className="absolute w-3 h-1 bg-[#FF8C00]/30 rounded-full"
    />
  );
}
