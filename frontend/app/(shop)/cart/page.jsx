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
        <h2 className="text-3xl font-light text-gallery-text mb-6">Your Collection is Empty</h2>
        <p className="text-gallery-muted mb-8">Discover our curated artworks to start your collection.</p>
        <Link href="/products" className="px-8 py-3 bg-gallery-primary text-white rounded hover:bg-black transition-colors">
          Explore Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gallery-bg py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-light text-gallery-text mb-12">Your Collection</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-6 bg-gallery-surface border border-gallery-border p-4 shadow-sm">
                  <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-gallery-soft">
                    <Image
                      src={getValidImageSrc(item.product.imageUrl)}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <h3 className="text-xl font-light text-gallery-text">{item.product.title}</h3>
                      <p className="text-sm text-gallery-muted mt-1">{item.product.creator}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gallery-border">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-1 text-gallery-muted hover:text-gallery-text transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 text-gallery-text border-x border-gallery-border">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-1 text-gallery-muted hover:text-gallery-text transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-gallery-accent">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-gallery-muted hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
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
            <div className="bg-gallery-surface border border-gallery-border p-6 shadow-sm sticky top-24">
              <h2 className="text-2xl font-light text-gallery-text mb-6 border-b border-gallery-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gallery-muted">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gallery-muted">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gallery-border pt-4 mb-8">
                <div className="flex justify-between text-xl text-gallery-text font-bold">
                  <span>Total</span>
                  <span className="text-gallery-accent">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-gallery-primary text-white text-lg rounded hover:bg-black transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
