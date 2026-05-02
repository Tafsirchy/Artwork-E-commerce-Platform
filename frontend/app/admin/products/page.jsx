"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/store/authStore";
import api, { setAuthToken } from "@/lib/api";
import { toast } from "react-toastify";
import { Upload, Edit2, Trash2, X } from "lucide-react";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { motion } from "framer-motion";
import AdminTableSkeleton from "@/components/ui/AdminTableSkeleton";

export default function AdminProductsPage() {
  const { user, token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [creator, setCreator] = useState("");
  const [category, setCategory] = useState("Painting");
  const [colorConcept, setColorConcept] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!_hasHydrated) return;

    if (user?.role === "admin") {
      if (token) setAuthToken(token);
      fetchProducts();
    } else if (user) {
      router.push("/");
    }
  }, [user, _hasHydrated, token]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      const msg = error.response?.data?.message || "Failed to fetch products";
      toast.error(msg);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Artwork removed");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete artwork");
    }
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setOfferPrice(p.offerPrice || "");
    setStock(p.stock);
    setCreator(p.creator);
    setCategory(p.category);
    setColorConcept(p.colorConcept ? p.colorConcept.join(", ") : "");
    setPreview(p.imageUrl);
    setImage(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setOfferPrice("");
    setStock(1);
    setCreator("");
    setCategory("Painting");
    setColorConcept("");
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !isEditing) {
      toast.error("Please select an artwork image");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (offerPrice) formData.append("offerPrice", offerPrice);
    formData.append("stock", stock);
    formData.append("creator", creator);
    formData.append("category", category);
    formData.append("colorConcept", colorConcept);

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork updated successfully!");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Artwork added successfully!");
      }
      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Painting", "Sculpture", "Photography", "Digital Art", "Drawing", "Mixed Media"];

  return (
    <div className="min-h-screen bg-gallery-bg p-6 sm:p-8 pt-12 sm:pt-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12">

        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-6">
            <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase">Manage Art</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="w-full sm:w-auto h-14 px-8 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl active:scale-95"
            >
              Add New Art
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12">
            {/* List View */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-gallery-border pb-4">
                <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black">Current Art List</h2>
                <div className="text-xs tracking-[0.2em] uppercase text-gallery-muted font-black">
                  {products.length} Artworks
                </div>
              </div>
              
              {fetchLoading ? (
                <AdminTableSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* Mobile Card Layout */}
                  <div className="grid grid-cols-1 gap-4 sm:hidden">
                    {currentItems.map((p) => (
                      <motion.div 
                        key={p._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gallery-border p-4 shadow-sm space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 border border-gallery-border overflow-hidden bg-gallery-bg shrink-0">
                            <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-gallery-text truncate uppercase tracking-tight">{p.title}</p>
                            <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold">{p.creator}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-end border-t border-gallery-soft pt-4">
                          <div>
                            <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold mb-1">Price</p>
                            <p className="text-lg font-black text-gallery-accent">${p.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-gold hover:bg-gallery-soft transition-all active:scale-95"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-red-400 hover:bg-red-50 transition-all active:scale-95"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block bg-white border border-gallery-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                          <tr>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Art</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Artist</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Price</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Stock</th>
                            <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-black text-gallery-text">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gallery-border">
                          {currentItems.map((p) => (
                            <tr key={p._id} className="hover:bg-gallery-soft/10 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-12 h-12 border border-gallery-border overflow-hidden bg-gallery-bg shrink-0">
                                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" sizes="48px" />
                                  </div>
                                  <span className="text-sm font-medium text-gallery-text truncate max-w-[200px]">{p.title}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gallery-muted">{p.creator}</td>
                              <td className="px-6 py-4 text-sm font-bold text-gallery-accent">${p.price.toFixed(2)}</td>
                              <td className="px-6 py-4 text-sm text-gallery-text">{p.stock}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-6">
                                  <button
                                    onClick={() => handleEdit(p)}
                                    className="text-xs tracking-widest uppercase font-black text-gallery-gold hover:text-gallery-primary transition-colors flex items-center gap-2"
                                  >
                                    <Edit2 size={14} /> <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(p._id)}
                                    className="text-xs tracking-widest uppercase font-black text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> <span>Remove</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gallery-border">
                      <p className="text-xs tracking-widest uppercase text-gallery-muted font-black">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="flex-1 sm:flex-none h-12 px-6 border border-gallery-border text-xs tracking-[0.2em] uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Previous
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="flex-1 sm:flex-none h-12 px-6 border border-gallery-border text-xs tracking-[0.2em] uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { resetForm(); setShowModal(false); }}
            className="absolute inset-0 bg-gallery-primary/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-2xl border-t sm:border border-gallery-border shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-none"
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-gallery-border flex items-center justify-between bg-gallery-soft/30">
              <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black">
                {isEditing ? "Edit Art" : "Add New Art"}
              </h2>
              <button onClick={() => { resetForm(); setShowModal(false); }} className="w-10 h-10 flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              <form id="artwork-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div
                  className="border-2 border-dashed border-gallery-border p-8 text-center cursor-pointer hover:border-gallery-gold transition-colors bg-gallery-soft/10 group rounded-xl"
                  onClick={() => document.getElementById("image-input").click()}
                >
                  {preview ? (
                    <div className="relative h-64 w-full">
                      <Image src={preview} alt="Preview" fill className="object-contain shadow-2xl" sizes="(max-width: 768px) 100vw, 600px" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-gallery-muted group-hover:text-gallery-gold transition-colors py-4">
                      <Upload size={40} strokeWidth={1} />
                      <p className="text-[10px] uppercase tracking-widest font-black">Select Art Image</p>
                    </div>
                  )}
                  <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light bg-gallery-soft/5 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Artist</label>
                    <input type="text" required value={creator} onChange={e => setCreator(e.target.value)}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light bg-gallery-soft/5 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Price ($)</label>
                    <input type="number" required min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Offer Price ($)</label>
                    <input type="number" min="0" step="0.01" value={offerPrice} onChange={e => setOfferPrice(e.target.value)}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light bg-gallery-accent/5"
                      placeholder="Optional" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Stock</label>
                    <input type="number" required min="0" value={stock} onChange={e => setStock(e.target.value)}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Category</label>
                    <div className="relative">
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full h-14 px-6 border border-gallery-border bg-white focus:outline-none focus:border-gallery-gold text-sm font-light appearance-none cursor-pointer">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gallery-muted">
                        <Upload size={14} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Colors</label>
                    <input type="text" value={colorConcept} onChange={e => setColorConcept(e.target.value)}
                      placeholder="#000000, #FFFFFF"
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">Description</label>
                  <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full p-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-sm font-light resize-none bg-gallery-soft/5" />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-6 border-t border-gallery-border flex flex-col sm:flex-row gap-4 bg-gallery-soft/30 pb-10 sm:pb-6">
              <button
                type="submit"
                form="artwork-form"
                disabled={loading}
                className="flex-1 h-16 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all disabled:opacity-50 shadow-xl active:scale-95"
              >
                {loading ? "Saving..." : (isEditing ? "Save Art" : "Add Art")}
              </button>
              <button
                onClick={() => { resetForm(); setShowModal(false); }}
                className="h-16 px-10 border border-gallery-border text-[10px] tracking-[0.3em] uppercase font-black hover:bg-white transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}