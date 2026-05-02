"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, SortAsc, DollarSign, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter & Sort States
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased for better 2-column flow

  const categories = ["All", "Abstract", "Landscape", "Modern", "Minimalism", "Expressionism", "Illustration"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : data?.products ?? []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    // Filter by Price Range
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [products, category, sortBy, priceRange]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, sortBy, priceRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gallery-bg py-12 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted mb-2 sm:mb-3">Bristiii</p>
          <h1 className="text-3xl sm:text-5xl font-light text-gallery-text tracking-tight uppercase">Curated Gallery</h1>
          <div className="w-10 h-[1px] bg-gallery-gold mx-auto mt-4 sm:mt-6" />
        </div>

        {/* Filter Toggle Button (Touch Optimized) */}
        <div className="flex justify-center mb-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            // 🚀 SM Fix: Massive touch target for filters
            className="flex items-center gap-3 px-10 py-4 bg-white border border-gallery-border/50 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group"
          >
            <Filter size={14} className="text-gallery-gold" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-black text-gallery-text">
              {isFilterOpen ? "Close Filters" : "Refine Collection"}
            </span>
            <ChevronDown size={14} className={`text-gallery-muted transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white p-6 sm:p-10 border border-gallery-border grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Category Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SortAsc size={14} className="text-gallery-gold" />
                    <span className="text-[9px] tracking-[0.4em] uppercase text-gallery-muted font-black">Medium</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        // 🚀 SM Fix: 44px min height for touch targets
                        className={`px-5 py-3 text-[10px] tracking-widest uppercase transition-all border ${
                          category === cat 
                          ? "bg-gallery-primary text-white border-gallery-primary" 
                          : "bg-transparent text-gallery-muted border-gallery-border hover:border-gallery-gold"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={14} className="text-gallery-gold" />
                    <span className="text-[9px] tracking-[0.4em] uppercase text-gallery-muted font-black">Valuation</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-gallery-gold bg-gallery-soft h-[3px] appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] tracking-widest text-gallery-muted uppercase font-black">
                    <span>$0</span>
                    <span className="text-gallery-accent">${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SortAsc size={14} className="text-gallery-gold" />
                    <span className="text-[9px] tracking-[0.4em] uppercase text-gallery-muted font-black">Sequence</span>
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gallery-soft/50 border border-gallery-border px-4 py-3 text-[10px] tracking-widest uppercase text-gallery-text focus:outline-none focus:border-gallery-gold transition-colors cursor-pointer appearance-none"
                  >
                    <option value="newest">Recent Acquisitions</option>
                    <option value="price-low">Valuation: Low to High</option>
                    <option value="price-high">Valuation: High to Low</option>
                  </select>
                </div>

                {/* Clear All Button */}
                <div className="md:col-span-3 flex justify-end pt-6 border-t border-gallery-border/30">
                  <button 
                    onClick={() => {
                      setCategory("All");
                      setPriceRange([0, 10000]);
                      setSortBy("newest");
                    }}
                    className="flex items-center gap-2 text-[9px] tracking-[0.5em] uppercase text-gallery-muted hover:text-red-500 transition-colors font-black"
                  >
                    <X size={12} />
                    Reset Curation
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Grid (2-column SM Optimized) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
            : paginatedProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {!loading && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-gallery-border">
            <p className="text-gallery-muted tracking-[0.3em] uppercase text-[10px] font-black">The archives are empty for this selection.</p>
            <button 
              onClick={() => {
                setCategory("All");
                setPriceRange([0, 10000]);
                setSortBy("newest");
              }}
              className="mt-6 text-[9px] tracking-[0.5em] uppercase text-gallery-gold border-b border-gallery-gold/30 hover:border-gallery-gold transition-all font-black"
            >
              Reset Curation
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 sm:mt-24 flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                // 🚀 SM Fix: 48px touch targets
                className={`w-12 h-12 flex items-center justify-center border border-gallery-border transition-all ${
                  currentPage === 1 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-white hover:border-gallery-gold text-gallery-text"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  // Only show current, first, last, and immediate neighbors on small screens if many pages
                  const isVisible = totalPages <= 5 || page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1;
                  
                  if (!isVisible) return <span key={page} className="text-gallery-muted">.</span>;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-12 h-12 text-[10px] tracking-widest transition-all ${
                        currentPage === page
                        ? "bg-gallery-primary text-white"
                        : "bg-white text-gallery-muted border border-gallery-border hover:border-gallery-gold"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className={`w-12 h-12 flex items-center justify-center border border-gallery-border transition-all ${
                  currentPage === totalPages 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-white hover:border-gallery-gold text-gallery-text"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <p className="text-[9px] tracking-[0.5em] uppercase text-gallery-muted font-black">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} / {filteredAndSortedProducts.length} Pieces
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
