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
  const itemsPerPage = 8;

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

    // Reset pagination when filters change
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
    <div className="min-h-screen bg-gallery-bg py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.3em] uppercase text-gallery-muted mb-3">Bristiii</p>
          <h1 className="text-5xl font-light text-gallery-text">Curated Gallery</h1>
          <div className="w-12 h-[2px] bg-gallery-gold mx-auto mt-6" />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 px-8 py-3 bg-white border border-gallery-gold/20 rounded-full shadow-sm hover:shadow-md transition-all group"
          >
            <Filter size={16} className="text-gallery-gold group-hover:rotate-12 transition-transform" />
            <span className="text-xs tracking-[0.2em] uppercase font-medium text-gallery-text">
              {isFilterOpen ? "Close Filters" : "Filter & Sort"}
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
              <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-gallery-gold/10 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Category Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SortAsc size={14} className="text-gallery-gold" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold">Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] tracking-widest uppercase transition-all border ${
                          category === cat 
                          ? "bg-gallery-text text-white border-gallery-text" 
                          : "bg-transparent text-gallery-muted border-gallery-gold/20 hover:border-gallery-gold"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={14} className="text-gallery-gold" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold">Max Price</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-gallery-gold bg-gallery-gold/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] tracking-widest text-gallery-muted uppercase">
                    <span>$0</span>
                    <span className="text-gallery-text font-bold">${priceRange[1]}</span>
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SortAsc size={14} className="text-gallery-gold" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold">Sort By</span>
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent border-b border-gallery-gold/20 py-2 text-xs tracking-widest uppercase text-gallery-text focus:outline-none focus:border-gallery-gold transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest Acquisitions</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Clear All Button */}
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={() => {
                      setCategory("All");
                      setPriceRange([0, 10000]);
                      setSortBy("newest");
                    }}
                    className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase text-gallery-muted hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
            : paginatedProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {!loading && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-[40px] border border-dashed border-gallery-gold/20">
            <p className="text-gallery-muted tracking-[0.2em] uppercase text-sm">No artworks match your selection.</p>
            <button 
              onClick={() => {
                setCategory("All");
                setPriceRange([0, 10000]);
                setSortBy("newest");
              }}
              className="mt-6 text-[10px] tracking-[0.5em] uppercase text-gallery-gold border-b border-gallery-gold/30 hover:border-gallery-gold transition-all"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`p-3 rounded-full border border-gallery-gold/20 transition-all ${
                  currentPage === 1 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-white hover:border-gallery-gold text-gallery-text"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-full text-xs tracking-widest transition-all ${
                        currentPage === page
                        ? "bg-gallery-text text-white shadow-lg"
                        : "hover:bg-white text-gallery-muted border border-transparent hover:border-gallery-gold/30"
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
                className={`p-3 rounded-full border border-gallery-gold/20 transition-all ${
                  currentPage === totalPages 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-white hover:border-gallery-gold text-gallery-text"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <p className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted font-light">
              Viewing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} Artworks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
