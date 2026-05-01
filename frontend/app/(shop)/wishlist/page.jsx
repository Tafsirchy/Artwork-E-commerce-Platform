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
  const { addToCart } = useCartStore();
  const router = useRouter();

  const handleCheckoutSingle = (product) => {
    addToCart(product);
    router.push("/checkout");
  };

  const handleCheckoutAll = () => {
    items.forEach(item => addToCart(item));
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gallery-bg py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-light text-gallery-text tracking-widest uppercase mb-4">Curated Wishlist</h1>
            <p className="text-gallery-muted tracking-[0.2em] uppercase text-[10px] font-bold">Your Private Selection of Masterpieces</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={handleCheckoutAll}
              className="px-10 py-5 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-gold transition-all rounded-none flex items-center gap-3 shadow-lg"
            >
              <ShoppingCart size={16} /> Checkout Entire Wishlist
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gallery-border p-8 flex flex-col md:flex-row items-center gap-10 group hover:border-gallery-gold transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 border border-gallery-border overflow-hidden bg-gallery-soft relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 text-gallery-muted hover:text-red-500 transition-colors border border-gallery-border"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h2 className="text-2xl font-light text-gallery-text tracking-tight">{product.title}</h2>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">{product.creator}</p>
                    <p className="text-lg font-light text-gallery-accent pt-2">${product.price.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleCheckoutSingle(product)}
                      className="px-8 py-4 bg-gallery-text text-white text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-gold transition-all rounded-none"
                    >
                      Instant Acquisition
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.title} moved to cart`);
                      }}
                      className="px-8 py-4 border border-gallery-border text-gallery-text text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-soft transition-all rounded-none"
                    >
                      Move to Cart
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
            className="max-w-2xl mx-auto text-center py-32 bg-white border border-gallery-border rounded-none px-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none text-[20vw] font-serif flex items-center justify-center italic">
              Souls
            </div>
            <Heart size={48} className="mx-auto text-gallery-gold/30 mb-8" />
            <h2 className="text-3xl font-light text-gallery-text mb-4 uppercase tracking-widest">The Sanctuary is Empty</h2>
            <p className="text-gallery-muted mb-12 leading-relaxed font-light tracking-wide">Your curated list of favorites awaits its first masterpiece.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-4 px-12 py-5 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-gold transition-all rounded-none shadow-lg"
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
