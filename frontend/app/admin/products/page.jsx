"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { Upload, Edit2, Trash2, X } from "lucide-react";
import ProfileAside from "@/components/dashboard/ProfileAside";

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
    } else if (user) {
      router.push("/");
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Painting", "Sculpture", "Photography", "Digital Art", "Drawing", "Mixed Media"];

  return (
    <div className="min-h-screen bg-gallery-bg p-8 pt-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-4xl font-light text-gallery-text mb-10 tracking-tighter uppercase">Gallery Management</h1>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Add/Edit Form */}
            <div className="xl:col-span-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold">
                  {isEditing ? "Edit Masterpiece" : "Add New Artwork"}
                </h2>
                {isEditing && (
                  <button onClick={resetForm} className="text-gallery-muted hover:text-gallery-text">
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="bg-white border border-gallery-border p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div
                      className="border-2 border-dashed border-gallery-border p-6 text-center cursor-pointer hover:border-gallery-gold transition-colors bg-gallery-soft/30"
                      onClick={() => document.getElementById("image-input").click()}
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="max-h-32 mx-auto object-contain" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gallery-muted">
                          <Upload size={24} />
                          <p className="text-[10px] uppercase tracking-widest">Upload Artwork</p>
                        </div>
                      )}
                      <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Title</label>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Artist</label>
                      <input type="text" required value={creator} onChange={e => setCreator(e.target.value)}
                        className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Base Price ($)</label>
                        <input type="number" required min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                          className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Offer Price ($)</label>
                        <input type="number" min="0" step="0.01" value={offerPrice} onChange={e => setOfferPrice(e.target.value)}
                          className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light bg-gallery-accent/5 placeholder:text-gallery-muted/50" 
                          placeholder="Optional" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Stock Inventory</label>
                        <input type="number" required min="0" value={stock} onChange={e => setStock(e.target.value)}
                          className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gallery-border bg-white focus:outline-none focus:border-gallery-gold rounded-none font-light appearance-none">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Color Concept (Hex codes)</label>
                      <input type="text" value={colorConcept} onChange={e => setColorConcept(e.target.value)}
                        placeholder="#000000, #FFFFFF"
                        className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light placeholder:text-[9px]" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Description</label>
                      <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light resize-none" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-gold transition-all disabled:opacity-50 rounded-none">
                    {loading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Save Changes" : "Add to Collection")}
                  </button>
                </form>
              </div>
            </div>

            {/* List View */}
            <div className="xl:col-span-2">
              <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-8">Active Collection</h2>
              <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
                {fetchLoading ? (
                  <div className="p-20 text-center text-gallery-muted uppercase tracking-widest text-xs">Loading Collection...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                        <tr>
                          <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Artwork</th>
                          <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Artist</th>
                          <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Price</th>
                          <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Stock</th>
                          <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-bold text-gallery-text">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gallery-border">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-gallery-soft/10 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border border-gallery-border overflow-hidden bg-gallery-bg shrink-0">
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                                <span className="text-sm font-medium text-gallery-text truncate max-w-[150px]">{p.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gallery-muted">{p.creator}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gallery-accent">${p.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-sm text-gallery-text">{p.stock}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-4">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="text-[9px] tracking-widest uppercase font-bold text-gallery-gold hover:text-gallery-primary transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(p._id)}
                                  className="text-[9px] tracking-widest uppercase font-bold text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}