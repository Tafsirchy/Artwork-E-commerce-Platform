"use client";

import { useState } from "react";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { getValidImageSrc } from "@/lib/utils";
import { toast } from "react-toastify";
import { ShoppingBag, Palette, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductReviewSection from "@/components/products/ProductReviewSection";

export default function ProductDetailsClient({ product }) {
  const [activeColor, setActiveColor] = useState(product?.colorConcept?.[0] || null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.title} added!`, {
        position: "top-center",
        autoClose: 2000
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gallery-bg flex justify-center items-center p-6 text-center">
        <div>
          <p className="text-xl text-gallery-muted mb-4 font-serif italic">Artwork lost in the archives.</p>
          <button onClick={() => window.history.back()} className="text-[10px] tracking-[0.3em] uppercase font-bold text-gallery-gold">Return to Collection</button>
        </div>
      </div>
    );
  }

  const imageSrc = getValidImageSrc(product.imageUrl);
  const colors = product.colorConcept || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen bg-gallery-bg pb-12 md:pb-12 md:py-12 px-0 sm:px-4 md:px-6 flex flex-col items-center">
        <div className="w-full bg-gallery-surface md:border md:border-gallery-border shadow-sm flex flex-col md:flex-row overflow-hidden relative">

          {/* 🖼️ Visual Column */}
          <div className="w-full md:w-1/2 bg-gallery-soft md:border-r border-gallery-border/50 flex flex-col items-center relative">
            <div className="relative w-full aspect-[4/5] sm:aspect-square bg-white shadow-sm md:shadow-2xl border-b md:border-8 border-white p-0 md:p-1 group overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
              />

              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <button
                  onClick={() => setIsZoomed(true)}
                  className="bg-white/95 text-gallery-text p-4 rounded-full shadow-2xl active:scale-90 transition-all duration-300 flex items-center gap-2 border border-black/5"
                >
                  <Maximize2 size={20} className="text-gallery-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold pr-1">Expand View</span>
                </button>
              </div>

              <div className="absolute top-6 left-6 md:hidden">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[8px] tracking-[0.3em] text-gallery-muted uppercase font-black shadow-sm">
                  {product.category}
                </span>
              </div>
            </div>
            
            {colors.length > 0 && (
              <div className="w-full px-8 py-10 border-t border-gallery-border/30 bg-gallery-surface/30">
                <div className="flex items-center gap-3 mb-6">
                  <Palette size={14} className="text-gallery-gold" />
                  <p className="text-[10px] tracking-[0.4em] uppercase font-black text-gallery-muted">Palette Identity</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveColor(color)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${activeColor === color ? 'border-gallery-gold scale-110 shadow-xl' : 'border-transparent opacity-70'}`}
                    >
                      <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col">
            <div className="mb-10">
              <div className="hidden md:block mb-4">
                <span className="text-[10px] tracking-[0.5em] text-gallery-gold uppercase font-black">{product.category}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gallery-text mb-4 tracking-tight leading-[1.1]">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-[1px] bg-gallery-gold/50"></div>
                <p className="text-lg md:text-xl text-gallery-muted italic font-serif">by {product.creator}</p>
              </div>

              <div className="flex items-baseline gap-3 md:hidden mb-10">
                <span className="text-3xl font-bold text-gallery-accent">${product.price.toLocaleString()}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gallery-muted font-bold">Original Work</span>
              </div>
            </div>

            <div className="mb-12 border-b border-gallery-border/30 pb-10 relative">
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="w-full flex items-center justify-between group"
              >
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-gallery-text">
                  Curator's Statement
                </h3>
                <span className={`text-gallery-gold transition-transform duration-300 ${isDescExpanded ? 'rotate-180' : ''}`}>
                  {isDescExpanded ? "—" : "+"}
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isDescExpanded ? "auto" : "100px", opacity: 1 }}
                className="overflow-hidden mt-6 relative"
              >
                <p className="text-gallery-muted leading-relaxed text-base font-light italic">
                  {product.description}
                </p>
                {!isDescExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gallery-surface to-transparent pointer-events-none" />
                )}
              </motion.div>
            </div>

            <div className="hidden md:block pt-10 border-t border-gallery-border/50 mt-auto">
              <div className="flex items-center justify-between gap-8">
                <div>
                  <p className="text-4xl font-bold text-gallery-accent">${product.price.toLocaleString()}</p>
                  <p className={`text-[9px] uppercase tracking-[0.3em] mt-2 font-black ${product.stock > 0 ? 'text-gallery-muted' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} Original pieces in vault` : "Exhibited (Out of Stock)"}
                  </p>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 min-h-[64px] flex items-center justify-center gap-4 bg-gallery-primary text-white text-[11px] tracking-[0.4em] uppercase font-black hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-200"
                >
                  <ShoppingBag size={18} /> Acquire Piece
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mt-6 px-6 md:px-0">
          <ProductReviewSection productId={product._id} />
        </div>
      </div>

      {/* SM STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gallery-border p-5 md:hidden z-[100] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          <div>
            <p className="text-[10px] text-gallery-muted uppercase tracking-[0.3em] font-black mb-1">Acquisition</p>
            <p className="text-2xl font-bold text-gallery-accent">${product.price.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 h-[64px] flex items-center justify-center gap-3 bg-gallery-primary text-white text-[11px] tracking-[0.4em] uppercase font-black shadow-2xl active:scale-[0.96] transition-transform rounded-none"
          >
            <ShoppingBag size={18} /> Acquire
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-black/98 backdrop-blur-xl cursor-zoom-out"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full max-w-screen-2xl max-h-screen">
                <Image src={imageSrc} alt={product.title} fill className="object-contain" priority />
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-8 right-8 p-6 text-white/40 hover:text-white transition-colors pointer-events-auto bg-white/5 rounded-full backdrop-blur-md"
              >
                <X size={32} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
