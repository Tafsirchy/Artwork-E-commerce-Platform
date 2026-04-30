"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import StyleFilter from "./StyleFilter";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Expand } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { toast } from "react-toastify";
import { getValidImageSrc } from "@/lib/utils";

export default function MainGallery() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        const safeProducts = Array.isArray(data) ? data : data?.products ?? [];
        setProducts(safeProducts);
        setFilteredProducts(safeProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    const safeProducts = Array.isArray(products) ? products : [];
    if (category === "All") {
      setFilteredProducts(safeProducts);
    } else {
      setFilteredProducts(safeProducts.filter((product) => product.category === category));
    }
  };

  const visibleProducts = Array.isArray(filteredProducts) ? filteredProducts : [];

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <section className="py-32 bg-gallery-bg">
      <div className="w-11/12 mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gallery-text tracking-widest uppercase mb-4">
              Explore the Collection
            </h2>
            <div className="h-[1px] w-24 bg-gallery-gold" />
          </motion.div>

          <StyleFilter 
            activeCategory={activeCategory} 
            onFilter={handleFilter} 
          />
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
        >
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative"
              >
                {/* Image Container with Perspective Tilt Effect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gallery-soft mb-6 perspective-1000">
                  <motion.div
                    whileHover={{ rotateY: 10, rotateX: -10, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative w-full h-full shadow-lg group-hover:shadow-2xl transition-shadow duration-500"
                  >
                    <Image
                      src={getValidImageSrc(product.imageUrl)}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Hover Overlay: Blooming Details */}
                    <div className="absolute inset-0 bg-gallery-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          addToCart(product);
                          toast.success(`${product.title} added to cart`);
                        }}
                        className="w-14 h-14 bg-white text-gallery-primary rounded-full flex items-center justify-center hover:bg-gallery-gold hover:text-white transition-all transform translate-y-10 group-hover:translate-y-0 duration-500 delay-100"
                      >
                        <ShoppingCart size={20} />
                      </button>
                      <Link
                        href={`/products/${product._id}`}
                        className="w-14 h-14 bg-white text-gallery-primary rounded-full flex items-center justify-center hover:bg-gallery-gold hover:text-white transition-all transform translate-y-10 group-hover:translate-y-0 duration-500 delay-200"
                      >
                        <Expand size={20} />
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Product Info with Elegant Typography */}
                <div className="text-center px-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gallery-accent mb-2">{product.category}</p>
                  <h3 className="text-xl font-light text-gallery-text tracking-wider uppercase mb-1">{product.title}</h3>
                  <p className="text-gallery-muted text-sm mb-1">by {product.creator}</p>
                  <p className="text-gallery-gold font-light tracking-widest">${Number(product.price).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleProducts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-gallery-muted tracking-[0.2em] uppercase">No artworks found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
