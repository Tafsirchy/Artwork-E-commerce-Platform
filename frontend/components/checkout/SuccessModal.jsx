"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SuccessModal({ isOpen, orderId, onClose }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-lg border border-gallery-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          {/* Decorative Gold Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gallery-gold via-gallery-accent to-gallery-gold" />
          
          <div className="p-12 text-center">
            {/* Animated Success Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-20 h-20 bg-gallery-primary rounded-full flex items-center justify-center mx-auto mb-8 relative"
            >
              <Check className="text-white" size={32} />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-gallery-gold rounded-full"
              />
            </motion.div>

            <h2 className="text-4xl font-light text-gallery-text tracking-widest uppercase mb-4">Acquisition Complete</h2>
            <p className="text-gallery-muted tracking-[0.2em] uppercase text-[10px] font-bold mb-8 flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-gallery-gold" />
              A new masterpiece joins your collection
              <Sparkles size={12} className="text-gallery-gold" />
            </p>

            <div className="bg-gallery-soft p-6 mb-10 border border-gallery-border">
              <p className="text-[10px] tracking-widest uppercase text-gallery-muted mb-1">Authenticity ID</p>
              <p className="font-mono text-xs text-gallery-text">#{orderId?.slice(-12).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/dashboard"
                className="w-full py-5 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                Enter Private Gallery <ArrowRight size={14} />
              </Link>
              <button 
                onClick={onClose}
                className="w-full py-5 border border-gallery-border text-gallery-text text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-soft transition-all"
              >
                Continue Exploring
              </button>
            </div>
          </div>

          {/* Artistic Footer Decor */}
          <div className="bg-gallery-soft py-4 px-12 border-t border-gallery-border flex justify-between items-center">
            <span className="text-[8px] tracking-[0.3em] uppercase text-gallery-muted font-bold italic">Curator's Eye Verified</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-gallery-gold rounded-full" />)}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
