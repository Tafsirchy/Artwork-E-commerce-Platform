"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [creator, setCreator] = useState("");
  const [category, setCategory] = useState("Painting");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an artwork image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (offerPrice) formData.append("offerPrice", offerPrice);
    formData.append("stock", stock);
    formData.append("creator", creator);
    formData.append("category", category);

    setLoading(true);
    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Artwork added successfully!");
      setTitle(""); setDescription(""); setPrice(""); setOfferPrice(""); setStock(1);
      setCreator(""); setImage(null); setPreview(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add artwork");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Painting", "Sculpture", "Photography", "Digital Art", "Drawing", "Mixed Media"];

  return (
    <div className="min-h-screen bg-gallery-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-gallery-text mb-10 tracking-tighter uppercase">Gallery Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-8">Add New Artwork</h2>
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
                    <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2 font-bold">Description</label>
                    <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:border-gallery-gold rounded-none font-light resize-none" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-gold transition-all disabled:opacity-50 rounded-none">
                  {loading ? "Adding..." : "Add to Collection"}
                </button>
              </form>
            </div>
          </div>

          {/* List View */}
          <div className="lg:col-span-2">
            <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-8">Active Collection</h2>
            <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
              {fetchLoading ? (
                <div className="p-20 text-center text-gallery-muted uppercase tracking-widest text-xs">Loading Collection...</div>
              ) : (
                <table className="w-full text-left">
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
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="text-[9px] tracking-widest uppercase font-bold text-red-400 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}