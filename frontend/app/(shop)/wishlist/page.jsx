"use client";

import useWishlistStore from "@/store/wishlistStore";
import useCartStore from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft, Sparkles, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addMultipleToCart, addToCart } = useCartStore();
  const router = useRouter();

  const handleCheckoutSingle = async (product) => {
    await addToCart(product);
    router.push("/checkout");
  };

  const handleCheckoutAll = async () => {
    await addMultipleToCart(items);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gallery-bg py-10 sm:py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-6 sm:gap-8">
          <div>
            <h1 className="text-2xl sm:text-5xl font-extralight text-gallery-text tracking-[0.15em] sm:tracking-widest uppercase mb-3 sm:mb-4">Curated Wishlist</h1>
            <p className="text-gallery-muted tracking-[0.2em] uppercase text-[9px] sm:text-[10px] font-black">Your Private Selection of Masterpieces</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleCheckoutAll}
              className="w-full md:w-auto px-10 h-14 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingCart size={16} /> Acquisition All
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gallery-border p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-10 group hover:border-gallery-gold transition-all duration-500 relative shadow-sm"
                >
                  {/* Image Container */}
                  <div className="w-full aspect-square sm:w-40 sm:h-40 shrink-0 border border-gallery-border overflow-hidden bg-gallery-soft relative">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 text-gallery-muted hover:text-red-500 transition-colors border border-gallery-border shadow-sm active:bg-red-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl font-light text-gallery-text tracking-tight leading-tight">{product.title}</h2>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black">{product.creator}</p>
                    <p className="text-xl font-black text-gallery-accent pt-2 tracking-tighter">${product.price.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleCheckoutSingle(product)}
                      className="w-full md:w-auto px-8 h-12 sm:h-14 bg-gallery-text text-white text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all active:scale-95"
                    >
                      Instant Entry
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.title} moved to cart`);
                      }}
                      className="w-full md:w-auto px-8 h-12 sm:h-14 border border-gallery-border text-gallery-text text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-soft transition-all active:bg-gallery-surface"
                    >
                      Move to Collection
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-20 sm:py-32 bg-white border border-gallery-border px-8 sm:px-10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none text-[20vw] font-serif flex items-center justify-center italic">
              Souls
            </div>
            <Heart size={48} className="mx-auto text-gallery-gold/30 mb-8 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-light text-gallery-text mb-4 uppercase tracking-widest leading-tight">The Sanctuary is Empty</h2>
            <p className="text-gallery-muted mb-10 sm:mb-12 leading-relaxed font-light tracking-wide text-sm">Your curated list of favorites awaits its first masterpiece.</p>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-4 h-16 px-12 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl active:scale-95"
            >
              <ArrowLeft size={14} />
              Return to Gallery
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
