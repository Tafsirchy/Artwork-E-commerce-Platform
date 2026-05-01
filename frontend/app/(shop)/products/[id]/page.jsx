"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import api from "@/lib/api";
import useCartStore from "@/store/cartStore";
import { getValidImageSrc } from "@/lib/utils";
import { toast } from "react-toastify";
import { ShoppingBag, Palette } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gallery-bg py-16 px-6 md:px-12">
      <div className="container mx-auto bg-gallery-surface border border-gallery-border shadow-sm flex flex-col md:flex-row">
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

          <p className="text-gallery-muted leading-relaxed mb-10">{product.description}</p>

          {/* 🎨 Color Concept Section */}
          {colors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <Palette size={14} className="text-gallery-muted" />
                <p className="text-[10px] tracking-[0.45em] uppercase font-bold text-gallery-muted">
                  Color Concept
                </p>
              </div>

              {/* Full-width gradient palette bar */}
              <div
                className="w-full h-3 rounded-full mb-5 shadow-inner"
                style={{
                  background: `linear-gradient(to right, ${colors.join(", ")})`,
                }}
              />

              {/* Individual swatches */}
              <div className="flex flex-wrap gap-3">
                {colors.map((color, i) => {
                  const isLight = getLuminance(color) > 0.5;
                  const isActive = activeColor === color;
                  return (
                    <motion.button
                      key={i}
                      onClick={() => setActiveColor(color)}
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex flex-col items-center gap-1.5 transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-md"
                        style={{
                          backgroundColor: color,
                          borderColor: isActive ? color : "transparent",
                          boxShadow: isActive
                            ? `0 0 0 3px white, 0 0 0 5px ${color}`
                            : "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <span className="text-[9px] font-mono tracking-wider text-gallery-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        {color.toUpperCase()}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Active color detail */}
              {activeColor && (
                <motion.div
                  key={activeColor}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center gap-3 p-3 border border-gallery-border rounded-sm"
                >
                  <div
                    className="w-8 h-8 rounded-sm flex-shrink-0 shadow"
                    style={{ backgroundColor: activeColor }}
                  />
                  <div>
                    <p className="text-[10px] font-mono tracking-widest text-gallery-text">
                      {activeColor.toUpperCase()}
                    </p>
                    <p className="text-[9px] text-gallery-muted mt-0.5">
                      Dominant hue used in this composition
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

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
