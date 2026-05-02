"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Star, Quote, Search, Image as ImageIcon, Check, X, Layout, Info } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import ProfileAside from "@/components/dashboard/ProfileAside";

export default function AdminHomeManagement() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredIds, setFeaturedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews"); // "reviews" or "featured"

  // Form State for Reviews
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    stars: 5,
    artImage: "",
  });

  // Pagination for Reviews
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsPerPage = 4;
  const totalReviewsPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice((reviewsPage - 1) * reviewsPerPage, reviewsPage * reviewsPerPage);

  // Pagination for Products (Featured Selection tab)
  const [productsPage, setProductsPage] = useState(1);
  const productsPerPage = 10;
  const totalProductsPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice((productsPage - 1) * productsPerPage, productsPage * productsPerPage);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchInitialData();
    }
  }, [user, _hasHydrated]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [revs, prods, feat] = await Promise.all([
        api.get("/home-config/reviews"),
        api.get("/products"),
        api.get("/home-config/featured")
      ]);
      setReviews(revs.data);
      setProducts(prods.data);
      setFeaturedIds(feat.data.productIds || []);
    } catch (error) {
      toast.error("Failed to fetch archive records");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        name: review.name,
        role: review.role,
        content: review.content,
        stars: review.stars,
        artImage: review.artImage,
      });
    } else {
      setEditingReview(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        stars: 5,
        artImage: products[0]?.imageUrl || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, formData);
        toast.success("Review updated");
      } else {
        await api.post("/reviews", formData);
        toast.success("New review added");
      }
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success("Review removed");
        fetchInitialData();
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  const toggleFeatured = (productId) => {
    setFeaturedIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) {
        toast.info("You can only select 4 artworks");
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleSaveFeatured = async () => {
    if (featuredIds.length !== 4) {
      toast.warning("Please select exactly 4 artworks for the featured board");
      return;
    }
    try {
      await api.post("/home-config", {
        section: "featured",
        productIds: featuredIds
      });
      toast.success("Featured collection updated");
    } catch (error) {
      toast.error("Failed to update featured selection");
    }
  };

  if (!_hasHydrated) return null;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg py-12 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          {/* Sidebar */}
          <ProfileAside />

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-8">
              <div>
                <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-2 font-black">Home Content Management</p>
                <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tight uppercase leading-tight">
                  Admin <span className="font-serif text-gallery-gold">Dashboard</span>
                </h1>
              </div>

              <div className="flex w-full md:w-auto bg-white border border-gallery-border p-1 shadow-sm overflow-hidden">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 md:flex-none h-12 px-6 text-[10px] uppercase tracking-widest font-black transition-all active:scale-95 ${activeTab === "reviews" ? "bg-gallery-primary text-white" : "text-gallery-muted hover:text-gallery-text"}`}
                >
                  Customer Reviews
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`flex-1 md:flex-none h-12 px-6 text-[10px] uppercase tracking-widest font-black transition-all active:scale-95 ${activeTab === "featured" ? "bg-gallery-primary text-white" : "text-gallery-muted hover:text-gallery-text"}`}
                >
                  Featured Art
                </button>
              </div>
            </div>

            {activeTab === "reviews" ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 border border-gallery-border gap-6">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Quote className="text-gallery-gold" size={20} />
                    <span className="text-xs tracking-widest uppercase font-black">Reviews ({reviews.length})</span>
                  </div>
                  <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto h-12 px-8 bg-gallery-primary text-white text-[10px] uppercase tracking-widest font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Plus size={14} /> New Review
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gallery-soft animate-pulse" />)}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentReviews.map((review) => (
                        <motion.div
                          layout
                          key={review._id}
                          className="bg-white border border-gallery-border p-6 sm:p-8 relative group hover:border-gallery-gold transition-all duration-500"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-1">
                              {Array.from({ length: review.stars }).map((_, s) => (
                                <Star key={s} size={12} fill="#C8A96A" color="#C8A96A" />
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => handleOpenModal(review)} className="w-10 h-10 flex items-center justify-center border border-gallery-soft text-gallery-text hover:text-gallery-gold transition-colors active:scale-95"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteReview(review._id)} className="w-10 h-10 flex items-center justify-center border border-gallery-soft text-red-400 hover:text-red-600 transition-colors active:scale-95"><Trash2 size={16} /></button>
                            </div>
                          </div>

                          <p className="text-sm sm:text-base font-light text-gallery-text leading-relaxed mb-8">"{review.content}"</p>

                          <div className="flex items-center gap-5 pt-6 border-t border-gallery-soft">
                            <div className="w-12 h-12 bg-gallery-soft overflow-hidden border border-gallery-border rounded-full shrink-0">
                              <img src={review.artImage} className="w-full h-full object-cover" alt="Art" />
                            </div>
                            <div>
                              <p className="text-xs tracking-widest font-black uppercase text-gallery-text">{review.name}</p>
                              <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">{review.role}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Reviews Pagination */}
                    {totalReviewsPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gallery-border">
                        <p className="text-xs tracking-widest uppercase text-gallery-muted font-black">
                          Review Page {reviewsPage} of {totalReviewsPages}
                        </p>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            disabled={reviewsPage === 1}
                            onClick={() => setReviewsPage(prev => prev - 1)}
                            className="flex-1 sm:flex-none h-12 px-8 border border-gallery-border text-[10px] tracking-widest uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                          >
                            Previous
                          </button>
                          <button
                            disabled={reviewsPage === totalReviewsPages}
                            onClick={() => setReviewsPage(prev => prev + 1)}
                            className="flex-1 sm:flex-none h-12 px-8 border border-gallery-border text-[10px] tracking-widest uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-white p-6 sm:p-10 border border-gallery-border space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Layout className="text-gallery-gold" size={20} />
                      <span className="text-xs tracking-widest uppercase font-black">Featured Art Selection</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                      <span className={`text-[10px] tracking-[0.2em] uppercase font-black ${featuredIds.length === 4 ? 'text-green-600' : 'text-gallery-gold'}`}>
                        {featuredIds.length} / 4 Selected
                      </span>
                      <button
                        onClick={handleSaveFeatured}
                        disabled={featuredIds.length !== 4}
                        className="w-full sm:w-auto h-12 px-8 bg-gallery-primary text-white text-[10px] uppercase tracking-widest font-black hover:bg-black transition-all disabled:opacity-50 shadow-xl active:scale-95"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-gallery-soft/30 p-5 border-l-4 border-gallery-gold">
                    <Info size={18} className="text-gallery-gold shrink-0 mt-0.5" />
                    <p className="text-xs text-gallery-muted leading-relaxed uppercase tracking-wider font-bold">
                      Select exactly 4 masterpieces for the "Opening the Doors to Hidden Beauty" board.
                      The first selection will be the large top-left piece.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentProducts.map(product => (
                      <div
                        key={product._id}
                        onClick={() => toggleFeatured(product._id)}
                        className={`relative aspect-square cursor-pointer border-2 transition-all overflow-hidden group active:scale-90 ${featuredIds.includes(product._id) ? "border-gallery-gold scale-95 shadow-xl" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        <img src={product.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={product.title} />
                        {featuredIds.includes(product._id) && (
                          <div className="absolute top-2 right-2 bg-gallery-gold text-white p-1.5 rounded-full shadow-lg">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-[8px] text-white uppercase tracking-widest truncate font-black">{product.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Products Pagination */}
                  {totalProductsPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gallery-border">
                      <p className="text-xs tracking-widest uppercase text-gallery-muted font-black">
                        Art Page {productsPage} of {totalProductsPages}
                      </p>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          disabled={productsPage === 1}
                          onClick={() => setProductsPage(prev => prev - 1)}
                          className="flex-1 sm:flex-none h-12 px-8 border border-gallery-border text-[10px] tracking-widest uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Previous
                        </button>
                        <button
                          disabled={productsPage === totalProductsPages}
                          onClick={() => setProductsPage(prev => prev + 1)}
                          className="flex-1 sm:flex-none h-12 px-8 border border-gallery-border text-[10px] tracking-widest uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for Reviews */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gallery-primary/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white p-6 sm:p-10 shadow-2xl border-t sm:border border-gallery-border max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-none no-scrollbar"
            >
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-xl sm:text-2xl font-extralight text-gallery-text uppercase tracking-widest">
                  {editingReview ? "Edit Review" : "Add New Review"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Customer Name</label>
                    <input
                      required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 px-6 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Job/Role</label>
                    <input
                      required type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full h-14 px-6 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Review Text</label>
                  <textarea
                    required rows={5} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-6 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light resize-none transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest font-black text-gallery-muted block">Select Artwork</label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-3 border border-gallery-border no-scrollbar bg-gallery-soft/10">
                    {products.map(p => (
                      <div
                        key={p._id}
                        onClick={() => setFormData({ ...formData, artImage: p.imageUrl })}
                        className={`relative aspect-square cursor-pointer border-2 transition-all active:scale-90 ${formData.artImage === p.imageUrl ? "border-gallery-gold scale-95 shadow-xl" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        <img src={p.imageUrl} className="w-full h-full object-cover" alt="Choice" />
                        {formData.artImage === p.imageUrl && (
                          <div className="absolute top-1 right-1 bg-gallery-gold text-white p-1 rounded-full">
                            <Check size={8} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 pb-8 sm:pb-0">
                  <button type="submit" className="flex-1 h-16 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black transition-all shadow-xl active:scale-95">
                    {editingReview ? "Save Changes" : "Add Review"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="h-16 px-10 border border-gallery-border text-[10px] uppercase tracking-[0.4em] font-black hover:bg-gallery-soft transition-all active:scale-95">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
