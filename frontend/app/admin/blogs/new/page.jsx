"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Save, Camera } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";

export default function BlogFormPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const isEditing = !!params?.id;

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    author: "Admin",
    role: "Curator",
    category: "",
    image: "",
    image2: "",
    content: []
  });
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== "admin") {
      router.push("/");
    } else if (isEditing) {
      fetchBlog();
    }
  }, [user, _hasHydrated, isEditing]);

  const fetchBlog = async () => {
    try {
      const res = await api.get(`/blogs/${params.id}`);
      setFormData(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch journal data.");
      router.push("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("excerpt", formData.excerpt);
    data.append("author", formData.author);
    data.append("role", formData.role);
    data.append("category", formData.category);
    data.append("content", JSON.stringify(formData.content));

    // Only append if it's a file object (new upload)
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }
    if (formData.image2 instanceof File) {
      data.append("image2", formData.image2);
    }

    try {
      if (isEditing) {
        await api.put(`/blogs/${params.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Journal updated successfully.");
      } else {
        await api.post("/blogs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Journal created successfully.");
      }
      router.push("/admin/blogs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save journal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg pt-12 sm:pt-24 pb-20 sm:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-12">
        <ProfileAside />

        <div className="flex-1">
          <div className="mb-8 border-b border-gallery-border pb-6">
            <Link href="/admin/blogs" className="text-[10px] uppercase tracking-widest text-gallery-muted hover:text-gallery-text flex items-center gap-2 mb-4">
              <ArrowLeft size={14} /> Back to Records
            </Link>
            <h1 className="text-3xl font-light text-gallery-text tracking-tighter uppercase">
              {isEditing ? "Edit Journal Entry" : "New Journal Entry"}
            </h1>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gallery-border p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    required
                    className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gallery-border p-3 text-sm focus:outline-none focus:border-gallery-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted">Primary Visual</label>
                  <div className="relative border border-gallery-border bg-gallery-soft/30 p-4 hover:border-gallery-gold transition-colors group">
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      required={!isEditing}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 text-gallery-muted group-hover:text-gallery-gold transition-colors">
                      <Camera size={20} />
                      <span className="text-xs font-light">
                        {formData.image instanceof File ? formData.image.name : (formData.image ? "Current Image Preserved" : "Select Primary Image")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-gallery-muted">Secondary Visual (Optional)</label>
                  <div className="relative border border-gallery-border bg-gallery-soft/30 p-4 hover:border-gallery-gold transition-colors group">
                    <input
                      type="file"
                      name="image2"
                      onChange={handleChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-3 text-gallery-muted group-hover:text-gallery-gold transition-colors">
                      <Camera size={20} />
                      <span className="text-xs font-light">
                        {formData.image2 instanceof File ? formData.image2.name : (formData.image2 ? "Current Image Preserved" : "Select Secondary Image")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gallery-border flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gallery-primary text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2 hover:bg-gallery-gold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : (
                    <>
                      <Save size={16} /> Save Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
