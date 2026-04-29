"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StyleFilter from "./StyleFilter";

export default function MainGallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStyle, setActiveStyle] = useState("All Styles");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("Gallery fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeStyle === "All Styles" 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === activeStyle).slice(0, 8);

  return (
    <section className="py-24 bg-gallery-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-gallery-accent text-sm tracking-[0.3em] uppercase mb-4">
              🖼️ Core Collection
            </p>
            <h2 className="text-5xl font-light text-gallery-text">Explore the Gallery</h2>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-sm tracking-widest uppercase text-gallery-muted hover:text-gallery-text transition-colors">
            View All Artworks <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <StyleFilter activeStyle={activeStyle} setActiveStyle={setActiveStyle} />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {!loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-20 text-center border border-dashed border-gallery-border"
          >
            <p className="text-gallery-muted tracking-widest uppercase text-sm">No artworks found in this style.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
