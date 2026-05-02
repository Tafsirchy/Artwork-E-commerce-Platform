"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";

export default function AdminBlogsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchBlogs();
    }
  }, [user, _hasHydrated, router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      setBlogs(res.data.data);
    } catch (error) {
      toast.error("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success("Blog post deleted successfully.");
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog post.");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-6 sm:p-8 pt-12 sm:pt-20">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
        <ProfileAside />

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gallery-border pb-8 gap-8">
            <div>
              <Link href="/admin/dashboard" className="text-xs uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-text transition-colors flex items-center gap-3 mb-6 font-black">
                <ArrowLeft size={16} /> Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extralight text-gallery-text tracking-tighter uppercase leading-tight">Blog Posts</h1>
              <p className="text-gallery-muted text-[10px] sm:text-sm mt-2 uppercase tracking-[0.2em] font-bold">Manage all your blog posts.</p>
            </div>
            <Link
              href="/admin/blogs/new"
              className="w-full sm:w-auto h-14 px-8 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <Plus size={18} /> New Post
            </Link>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
              {/* Mobile Card Layout */}
              <div className="grid grid-cols-1 divide-y divide-gallery-border sm:hidden">
                {blogs.length === 0 ? (
                  <div className="p-20 text-center text-gallery-muted tracking-widest text-xs uppercase font-black">No entries found.</div>
                ) : (
                  blogs.map((blog) => (
                    <div key={blog._id} className="p-6 space-y-6">
                      <div className="space-y-2">
                        <p className="text-[10px] text-gallery-gold tracking-widest uppercase font-black">{blog.category}</p>
                        <h3 className="text-lg font-black text-gallery-text tracking-tight uppercase leading-tight">{blog.title}</h3>
                      </div>

                      <div className="flex justify-between items-center bg-gallery-soft/20 p-4 rounded-lg">
                        <div>
                          <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-black mb-1">Author</p>
                          <p className="text-xs font-black text-gallery-text uppercase">{blog.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-black mb-1">Published</p>
                          <p className="text-xs font-black text-gallery-text uppercase">
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <Link 
                          href={`/admin/blogs/edit/${blog._id}`} 
                          className="flex-1 h-14 flex items-center justify-center gap-3 border border-gallery-border text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-soft transition-all active:scale-95 shadow-sm"
                        >
                          <Edit size={16} /> Edit Post
                        </Link>
                        <button 
                          onClick={() => deleteBlog(blog._id)} 
                          className="w-14 h-14 flex items-center justify-center border border-gallery-border text-red-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gallery-border bg-gallery-soft/30 text-[10px] tracking-widest uppercase font-black text-gallery-text">
                      <th className="px-8 py-5">Post Title</th>
                      <th className="px-8 py-5">Author</th>
                      <th className="px-8 py-5">Date Published</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gallery-border">
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-20 text-center text-gallery-muted tracking-widest text-xs uppercase font-black">
                          No entries found.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-gallery-soft/10 transition-colors group">
                          <td className="px-8 py-6">
                            <p className="text-gallery-text font-black text-sm tracking-tight uppercase leading-tight mb-1">{blog.title}</p>
                            <p className="text-[10px] text-gallery-gold tracking-widest uppercase font-bold">{blog.category}</p>
                          </td>
                          <td className="px-8 py-6 text-xs text-gallery-muted uppercase tracking-widest font-bold">{blog.author}</td>
                          <td className="px-8 py-6 text-xs text-gallery-muted uppercase tracking-widest font-bold">
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/admin/blogs/edit/${blog._id}`} className="w-10 h-10 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-gallery-gold transition-all active:scale-95">
                                <Edit size={14} />
                              </Link>
                              <button onClick={() => deleteBlog(blog._id)} className="w-10 h-10 flex items-center justify-center border border-gallery-border text-red-400 hover:text-red-600 transition-all active:scale-95">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
