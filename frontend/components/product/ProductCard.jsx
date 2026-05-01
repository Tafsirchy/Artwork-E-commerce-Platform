"use client";

import Link from "next/link";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { toast } from "react-toastify";
import { ShoppingCart, Heart } from "lucide-react";
import { getValidImageSrc } from "@/lib/utils";
import useWishlistStore from "@/store/wishlistStore";
import usePromotionStore from "@/store/promotionStore";

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { globalDiscount } = usePromotionStore();
  
  const isWishlisted = isInWishlist(product._id);

  // Calculate Discount
  const hasSpecificOffer = product.offerPrice && product.offerPrice < product.price;
  const effectiveDiscount = hasSpecificOffer 
    ? Math.round((1 - (product.offerPrice / product.price)) * 100)
    : globalDiscount;
    
  const currentPrice = hasSpecificOffer 
    ? product.offerPrice 
    : (globalDiscount > 0 ? product.price * (1 - globalDiscount / 100) : product.price);

  const discountPercentage = effectiveDiscount > 0 ? effectiveDiscount : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ ...product, price: currentPrice });
    toast.success(`${product.title} added to cart!`, { 
      style: { backgroundColor: "#4CAF50", color: "#fff" } 
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    if (added) {
      toast.success(`${product.title} added to wishlist!`, {
        icon: "❤️",
        style: { backgroundColor: "#fff", color: "#C4A484" }
      });
    } else {
      toast.info(`${product.title} removed from wishlist`);
    }
  };

  const imageSrc = getValidImageSrc(product.imageUrl);

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-gallery-surface border border-gallery-border overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative">
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-0 left-0 z-20 bg-gallery-accent text-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase">
            {discountPercentage}% OFF
          </div>
        )}

        <div className="relative aspect-square w-full overflow-hidden bg-gallery-soft">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-none bg-white/80 backdrop-blur-md shadow-lg border border-gallery-gold/20 hover:scale-110 transition-all group/wish"
            aria-label="Add to wishlist"
          >
            <Heart 
              size={18} 
              className={`transition-colors ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'text-gallery-muted group-hover/wish:text-red-400'}`} 
            />
          </button>
        </div>
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-light text-gallery-text truncate">{product.title}</h3>
            <p className="text-sm text-gallery-muted mt-1">{product.creator}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              {discountPercentage > 0 && (
                <span className="text-[10px] text-gallery-muted line-through mb-0.5">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="font-bold text-gallery-accent">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center p-2 rounded-none bg-gallery-primary text-white hover:bg-black transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

