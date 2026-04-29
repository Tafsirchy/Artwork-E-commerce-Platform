"use client";

import Link from "next/link";
import Image from "next/image";
import useCartStore from "@/store/cartStore";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent linking to the product page when clicking the button
    addToCart(product);
    toast.success(`${product.title} added to cart!`, { 
      style: { backgroundColor: "#4CAF50", color: "#fff" } 
    });
  };

  const imageSrc = product.imageUrl.startsWith("http") 
    ? product.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${product.imageUrl}`;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-gallery-surface border border-gallery-border overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gallery-soft">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-light text-gallery-text truncate">{product.title}</h3>
            <p className="text-sm text-gallery-muted mt-1">{product.creator}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-bold text-gallery-accent">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center p-2 rounded-full bg-gallery-primary text-white hover:bg-black transition-colors"
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
