"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import api from "@/lib/api";
import useCartStore from "@/store/cartStore";
import { getValidImageSrc } from "@/lib/utils";
import { toast } from "react-toastify";
import { ShoppingBag, Palette, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductReviewSection from "@/components/products/ProductReviewSection";

// ─── Color name map (closest named color utility) ────────────────
function getLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function ProductDetailsPage({ params }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${resolvedParams.id}`);
        setProduct(data);
        if (data.colorConcept?.length) setActiveColor(data.colorConcept[0]);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.title} added to cart!`, {
        style: { backgroundColor: "#4CAF50", color: "#fff" }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gallery-bg flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gallery-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gallery-bg flex justify-center items-center">
        <p className="text-xl text-gallery-muted">Artwork not found.</p>
      </div>
    );
  }

  const imageSrc = getValidImageSrc(product.imageUrl);
  const colors = product.colorConcept || [];

  return (
    <>
    <div className="min-h-screen bg-gallery-bg py-12 px-6 flex items-center justify-center">
      <div className="container mx-auto bg-gallery-surface border border-gallery-border shadow-sm flex flex-col md:flex-row overflow-hidden">
        {/* Visual Column (Framed Image + Colors) */}
        <div className="w-full md:w-5/12 bg-gallery-soft border-r border-gallery-border/50 flex flex-col items-center justify-center">
          {/* Framed Image - Smaller within the column */}
          <div className="w-full p-8 lg:p-10 flex flex-col items-center">
            <div className="relative w-full aspect-square bg-white shadow-xl border-2 border-white p-1 group overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 30vw"
              />

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={() => setIsZoomed(true)}
                  className="bg-white/90 text-gallery-text p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center gap-2 group/btn"
                >
                  <Maximize2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest font-bold pr-2">Exhibition View</span>
                </button>
              </div>
            </div>

            {/* 🎨 Color Concept (Directly below framed image) */}
            {colors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full mt-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={12} className="text-gallery-muted" />
                  <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-gallery-muted">
                    Palette Identity
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color, i) => {
                    const isActive = activeColor === color;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => setActiveColor(color)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-full border transition-all shadow-sm"
                        style={{
                          backgroundColor: color,
                          borderColor: isActive ? color : "white",
                          boxShadow: isActive
                            ? `0 0 0 2px white, 0 0 0 3px ${color}`
                            : "0 1px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    );
                  })}
                </div>

                {activeColor && (
                  <motion.div
                    key={activeColor}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-4 flex items-center gap-2.5 p-2.5 bg-white border border-gallery-border/50 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-sm shadow-inner" style={{ backgroundColor: activeColor }} />
                    <p className="text-[9px] font-mono tracking-widest text-gallery-text">
                      {activeColor.toUpperCase()}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
          <p className="text-[10px] tracking-[0.4em] text-gallery-muted uppercase mb-2 font-bold">{product.category}</p>
          <h1 className="text-3xl lg:text-4xl font-light text-gallery-text mb-2 tracking-tight">{product.title}</h1>
          <p className="text-lg text-gallery-muted italic mb-6">by {product.creator}</p>

          <div className="h-[1px] w-12 bg-gallery-gold mb-6"></div>

          <div className="flex-1">
            <p className="text-gallery-muted leading-relaxed mb-8 text-sm font-light">{product.description}</p>
          </div>

          <div className="pt-6 border-t border-gallery-border">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gallery-accent">${product.price.toFixed(2)}</p>
                <p className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${product.stock > 0 ? 'text-gallery-muted' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} Original pieces in vault` : "Archived"}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all shadow-lg disabled:bg-gray-300"
              >
                <ShoppingBag size={16} />
                Acquire Piece
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Fullscreen Zoom Modal ────────────────────── */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                <Image
                  src={imageSrc}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-6 right-6 p-4 text-white/30 hover:text-white transition-colors pointer-events-auto"
              >
                <X size={32} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

    {/* ─── Collector Reviews ─────────────────────── */}
    <ProductReviewSection productId={resolvedParams.id} />
    </>
  );
}
