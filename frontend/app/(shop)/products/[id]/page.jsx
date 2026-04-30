"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import api from "@/lib/api";
import useCartStore from "@/store/cartStore";
import { getValidImageSrc } from "@/lib/utils";
import { toast } from "react-toastify";
import { ShoppingBag } from "lucide-react";

export default function ProductDetailsPage({ params }) {
  // Use React.use() to unwrap params in Next.js 15
  const resolvedParams = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${resolvedParams.id}`);
        setProduct(data);
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

  return (
    <div className="min-h-screen bg-gallery-bg py-16 px-6 md:px-12">
      <div className="w-11/12 mx-auto bg-gallery-surface border border-gallery-border shadow-sm flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative min-h-[500px] bg-gallery-soft">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
          <p className="text-sm tracking-widest text-gallery-muted uppercase mb-3">{product.category}</p>
          <h1 className="text-4xl lg:text-5xl font-light text-gallery-text mb-4">{product.title}</h1>
          <p className="text-xl text-gallery-muted italic mb-8">by {product.creator}</p>
          
          <div className="h-px w-16 bg-gallery-gold mb-8"></div>
          
          <p className="text-gallery-muted leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="mt-auto">
            <p className="text-3xl font-bold text-gallery-accent mb-6">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gallery-primary text-white text-lg rounded hover:bg-black transition-colors"
            >
              <ShoppingBag size={20} />
              Add to Collection
            </button>
            <p className="text-sm text-gallery-muted mt-4">
              {product.stock > 0 ? `${product.stock} available in stock` : "Currently out of stock"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
