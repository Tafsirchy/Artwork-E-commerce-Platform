"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { getValidImageSrc } from "@/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gallery-bg flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl font-light text-gallery-text mb-6">Your Cart is Empty</h2>
        <p className="text-gallery-muted mb-8">Check out our art to start shopping.</p>
        <Link href="/products" className="px-8 py-3 bg-gallery-primary text-white rounded hover:bg-black transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-bg py-10 sm:py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text mb-8 sm:mb-12 tracking-tight uppercase">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="space-y-4 sm:space-y-6">
              {items.map((item, idx) => (
                <div key={item.product?._id || idx} className="flex gap-4 sm:gap-6 bg-gallery-surface border border-gallery-border p-4 sm:p-6 shadow-sm relative group overflow-hidden">
                  <div className="relative w-24 h-32 sm:w-32 sm:h-40 flex-shrink-0 bg-gallery-soft border border-gallery-border/50">
                    <Image
                      src={getValidImageSrc(item.product.imageUrl || item.product.image || item.product.thumbnailUrl)}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 128px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1 sm:py-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-light text-gallery-text leading-tight">{item.product.title}</h3>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted mt-1 font-bold">{item.product.creator || item.product.artist}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                      {/* Tactile Quantity Controls */}
                      <div className="flex items-center border border-gallery-border h-12 w-fit bg-white">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-12 h-full flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors active:bg-gallery-soft"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 h-full flex items-center justify-center text-gallery-text border-x border-gallery-border font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-12 h-full flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors active:bg-gallery-soft"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <span className="text-xl font-black text-gallery-accent tracking-tighter">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="w-12 h-12 flex items-center justify-center border border-red-50 text-gallery-muted hover:text-red-500 hover:border-red-100 transition-all active:bg-red-50"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gallery-surface border border-gallery-border p-8 shadow-2xl sticky top-24">
              <h2 className="text-xl sm:text-2xl font-light text-gallery-text mb-8 border-b border-gallery-border pb-4 uppercase tracking-widest">Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm sm:text-base text-gallery-muted uppercase tracking-wider font-bold">
                  <span>Subtotal</span>
                  <span className="text-gallery-text">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gallery-muted uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="font-serif">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gallery-border pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-[0.4em] text-gallery-muted mb-1 font-bold">Total Price</span>
                  <span className="text-3xl font-black text-gallery-accent tracking-tighter leading-none">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full h-16 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl active:scale-95"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
