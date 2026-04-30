"use client";

import useWishlistStore from "@/store/wishlistStore";
import ProductCard from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gallery-bg py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gallery-gold/20"
          >
            <Heart size={28} className="text-red-400 fill-red-400" />
          </motion.div>
          <h1 className="text-5xl font-light text-gallery-text tracking-widest uppercase mb-4">Your Wishlist</h1>
          <p className="text-gallery-muted tracking-[0.2em] uppercase text-xs">A Private Collection of Desired Beauty</p>
          <div className="w-12 h-[2px] bg-gallery-gold mt-8" />
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-20 bg-white/40 backdrop-blur-md rounded-[40px] border border-dashed border-gallery-gold/30 px-10"
          >
            <Sparkles size={40} className="mx-auto text-gallery-gold/40 mb-6" />
            <h2 className="text-2xl font-light text-gallery-text mb-4 uppercase tracking-widest">The Sanctuary is Empty</h2>
            <p className="text-gallery-muted mb-10 leading-relaxed">Your curated list of favorites awaits its first masterpiece.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gallery-text text-white text-xs tracking-[0.3em] uppercase rounded-full hover:bg-black transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Explore Gallery
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
