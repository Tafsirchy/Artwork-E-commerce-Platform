"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Star, Quote, Search, Image as ImageIcon, Check, X, Layout, Info } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";

export default function AdminHomeManagement() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [revRes, prodRes, featRes] = await Promise.all([
        api.get("/reviews"),
        api.get("/products"),
        api.get("/home-config/featured")
      ]);
      setReviews(revRes.data);
      setProducts(prodRes.data);
      setFeaturedIds(featRes.data.productIds.map(p => p._id));
    } catch (error) {
      toast.error("Failed to fetch gallery records");
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
        toast.success("Collector chronicle updated");
      } else {
        await api.post("/reviews", formData);
        toast.success("New chronicle added to history");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to strike this chronicle from history?")) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success("Chronicle removed");
        fetchData();
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
        toast.info("The Curator's Eye is limited to 4 masterpieces");
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

  return (
    <div className="min-h-screen bg-gallery-bg py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <ProfileAside />

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-2">Home Content Management</p>
                <h1 className="text-4xl font-light text-gallery-text tracking-tight uppercase">
                  Curatorial <span className="font-serif italic text-gallery-gold">Dashboard</span>
                </h1>
              </div>
              
              <div className="flex bg-white border border-gallery-border p-1 shadow-sm">
                <button 
                  onClick={() => setActiveTab("reviews")}
                  className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === "reviews" ? "bg-gallery-primary text-white" : "text-gallery-muted hover:text-gallery-text"}`}
                >
                  Collector Reviews
                </button>
                <button 
                  onClick={() => setActiveTab("featured")}
                  className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === "featured" ? "bg-gallery-primary text-white" : "text-gallery-muted hover:text-gallery-text"}`}
                >
                  Featured Selection
                </button>
              </div>
            </div>

            {activeTab === "reviews" ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white p-6 border border-gallery-border">
                  <div className="flex items-center gap-3">
                    <Quote className="text-gallery-gold" size={20} />
                    <span className="text-xs tracking-widest uppercase font-bold">Chronicles in History ({reviews.length})</span>
                  </div>
                  <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-2 bg-gallery-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-all"
                  >
                    <Plus size={14} /> New Chronicle
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gallery-soft animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <motion.div 
                        layout
                        key={review._id}
                        className="bg-white border border-gallery-border p-6 relative group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-1">
                            {Array.from({ length: review.stars }).map((_, s) => (
                              <Star key={s} size={10} fill="#C8A96A" color="#C8A96A" />
                            ))}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(review)} className="p-1.5 text-gallery-text hover:text-gallery-gold"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeleteReview(review._id)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                          </div>
                        </div>

                        <p className="text-sm font-light italic text-gallery-text leading-relaxed mb-6">"{review.content}"</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gallery-soft overflow-hidden border border-gallery-border">
                            <img src={review.artImage} className="w-full h-full object-cover" alt="Art" />
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest font-bold uppercase">{review.name}</p>
                            <p className="text-[8px] tracking-[0.2em] uppercase text-gallery-muted">{review.role}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-8 border border-gallery-border space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Layout className="text-gallery-gold" size={20} />
                      <span className="text-xs tracking-widest uppercase font-bold">Curator's Eye Selection</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] tracking-[0.2em] uppercase font-bold ${featuredIds.length === 4 ? 'text-green-600' : 'text-gallery-gold'}`}>
                        {featuredIds.length} / 4 Selected
                      </span>
                      <button 
                        onClick={handleSaveFeatured}
                        disabled={featuredIds.length !== 4}
                        className="px-8 py-2 bg-gallery-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-all disabled:opacity-50"
                      >
                        Publish Selection
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-gallery-soft/30 p-4 border-l-4 border-gallery-gold">
                    <Info size={16} className="text-gallery-gold shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gallery-muted leading-relaxed">
                      Select exactly 4 masterpieces for the "Opening the Doors to Hidden Beauty" board. 
                      The first selection will be the large top-left piece, followed by the others in order of selection.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map(product => (
                      <div 
                        key={product._id}
                        onClick={() => toggleFeatured(product._id)}
                        className={`relative aspect-square cursor-pointer border-2 transition-all ${featuredIds.includes(product._id) ? "border-gallery-gold scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        <img src={product.imageUrl} className="w-full h-full object-cover" />
                        {featuredIds.includes(product._id) && (
                          <div className="absolute top-2 right-2 bg-gallery-gold text-white p-1 rounded-full shadow-lg">
                            <Check size={12} />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-[7px] text-white uppercase tracking-widest truncate">{product.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for Reviews */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white p-10 shadow-2xl border border-gallery-border max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-light text-gallery-text mb-8 uppercase tracking-widest">
                {editingReview ? "Edit Chronicle" : "Draft New Chronicle"}
              </h2>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Collector Name</label>
                    <input 
                      required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Profession/Role</label>
                    <input 
                      required type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Testimonial Content</label>
                  <textarea 
                    required rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 bg-gallery-soft/30 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted block">Select Acquired Artwork (Avatar)</label>
                  <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto p-2 border border-gallery-border">
                    {products.map(p => (
                      <div 
                        key={p._id}
                        onClick={() => setFormData({...formData, artImage: p.imageUrl})}
                        className={`relative aspect-square cursor-pointer border-2 transition-all ${formData.artImage === p.imageUrl ? "border-gallery-gold scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                        {formData.artImage === p.imageUrl && (
                          <div className="absolute top-1 right-1 bg-gallery-gold text-white p-0.5 rounded-full">
                            <Check size={8} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 py-4 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all">
                    {editingReview ? "Commit Changes" : "Inscribe Chronicle"}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 border border-gallery-border text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gallery-soft">
                    Discard
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
