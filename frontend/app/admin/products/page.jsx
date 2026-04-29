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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [creator, setCreator] = useState("");
  const [category, setCategory] = useState("Painting");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "admin") {
    router.push("/");
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
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
    formData.append("stock", stock);
    formData.append("creator", creator);
    formData.append("category", category);

    setLoading(true);
    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Artwork added successfully!");
      setTitle(""); setDescription(""); setPrice(""); setStock(1);
      setCreator(""); setImage(null); setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add artwork");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Painting", "Sculpture", "Photography", "Digital Art", "Drawing", "Mixed Media"];

  return (
    <div className="min-h-screen bg-gallery-bg p-8">
      <h1 className="text-4xl font-light text-gallery-text mb-10">Add New Artwork</h1>

      <div className="max-w-3xl bg-gallery-surface border border-gallery-border p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-3">Artwork Image</label>
            <div
              className="border-2 border-dashed border-gallery-border rounded p-8 text-center cursor-pointer hover:border-gallery-primary transition-colors"
              onClick={() => document.getElementById("image-input").click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gallery-muted">
                  <Upload size={32} />
                  <p className="text-sm">Click to upload artwork image</p>
                  <p className="text-xs">JPG, PNG, WebP supported</p>
                </div>
              )}
              <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Artist / Creator</label>
              <input type="text" required value={creator} onChange={e => setCreator(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Price ($)</label>
              <input type="number" required min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Stock</label>
              <input type="number" required min="0" value={stock} onChange={e => setStock(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border bg-white focus:outline-none focus:ring-1 focus:ring-gallery-gold">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm uppercase tracking-widest text-gallery-muted mb-2">Description</label>
              <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold resize-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gallery-primary text-white text-sm tracking-widest uppercase rounded hover:bg-black transition-colors disabled:opacity-50">
            {loading ? "Adding Artwork..." : "Add Artwork to Gallery"}
          </button>
        </form>
      </div>
    </div>
  );
}
