"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Shield, Save, Edit3, LogOut, Camera, Home, Tag, Trash2 } from "lucide-react";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function ProfileAside() {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data);
      toast.success("Profile appearance updated");
    } catch (error) {
      toast.error("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Restore default identity portrait?")) return;
    
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", { removeAvatar: true });
      updateUser(data);
      toast.success("Default appearance restored");
    } catch (error) {
      toast.error("Removal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", { name });
      updateUser(data);
      toast.success("Identity records updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <aside className="w-full lg:w-80 lg:sticky lg:top-32 h-fit mb-10 sm:mb-8 lg:mb-0">
      <div className="space-y-6 sm:space-y-8">
        {/* Profile Card */}
        <div className="bg-white border border-gallery-border p-6 sm:p-10 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gallery-gold/30" />
          
          <div className="flex flex-col items-center text-center">
            {/* Avatar Section */}
            <div className="relative w-28 h-28 mb-8">
              <div className="w-full h-full bg-gallery-soft/30 rounded-full flex items-center justify-center border-2 border-gallery-border overflow-hidden group-hover:border-gallery-gold transition-all duration-700 p-1 relative">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center border border-gallery-border overflow-hidden relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} strokeWidth={1} className="text-gallery-muted group-hover:text-gallery-gold transition-colors duration-700" />
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              {user.avatar && !loading && (
                <button 
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-8 h-8 bg-white border border-red-100 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:border-red-500 transition-all shadow-lg active:scale-90 z-10"
                  title="Remove Avatar"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-gallery-border rounded-full flex items-center justify-center hover:text-gallery-gold transition-all shadow-xl active:scale-95 group-hover:border-gallery-gold cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
                <Camera size={16} />
              </label>
            </div>

            <div className="w-full space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gallery-muted block">Identity Records</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-14 px-6 bg-gallery-soft/20 border border-gallery-gold text-center text-sm font-light focus:outline-none tracking-tight"
                      placeholder="Full Name"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex-1 h-12 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.3em] font-black disabled:opacity-50 active:scale-95 shadow-lg"
                    >
                      {loading ? "..." : "Commit"}
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setName(user.name); }}
                      className="flex-1 h-12 border border-gallery-border text-[10px] uppercase tracking-[0.3em] font-black active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-extralight text-gallery-text tracking-tighter flex items-center justify-center gap-3 group/name">
                    {user.name}
                    <button onClick={() => setIsEditing(true)} className="text-gallery-muted hover:text-gallery-gold transition-colors active:scale-90">
                      <Edit3 size={16} />
                    </button>
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gallery-soft/30 border border-gallery-border rounded-full">
                    <Shield size={10} className="text-gallery-gold" />
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gallery-gold font-black">
                      {user.role === 'admin' ? 'Head Curator' : 'Collector'}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gallery-soft space-y-5">
                <div className="flex items-center gap-4 text-gallery-muted bg-gallery-soft/10 p-3 border border-transparent hover:border-gallery-border transition-all">
                  <div className="w-8 h-8 rounded-full bg-white border border-gallery-border flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-gallery-gold" />
                  </div>
                  <span className="text-xs truncate font-medium tracking-tight">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gallery-soft/30 border-b border-gallery-border">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gallery-muted">Administrative Access</p>
          </div>
          <div className="divide-y divide-gallery-border">
            <Link href={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
              className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                  <Home size={18} strokeWidth={1.5} />
                </div>
                <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Command Overview</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
            </Link>
            
            {user.role === 'admin' ? (
              <>
                <Link href="/admin/products" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Edit3 size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Artworks Gallery</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
                <Link href="/admin/orders" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Save size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Order Archives</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
                <Link href="/admin/home" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Camera size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Home Curation</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
                <Link href="/admin/messages" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Mail size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Inquiry Center</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
                <Link href="/admin/promo" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-gold">
                      <Tag size={18} strokeWidth={2} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-gold">Promotions</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-100 transition-all" />
                </Link>
              </>
            ) : (
              <>
                <Link href="/orders" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Save size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Acquisitions</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
                <Link href="/wishlist" className="flex items-center justify-between px-6 h-16 hover:bg-gallery-soft transition-all group active:px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-gallery-muted group-hover:text-gallery-primary transition-colors">
                      <Edit3 size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs tracking-[0.15em] uppercase font-black text-gallery-text">Curation List</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Link>
              </>
            )}
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between px-6 h-16 hover:bg-red-50 transition-all group text-red-500 active:px-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <LogOut size={18} strokeWidth={2} />
                </div>
                <span className="text-xs tracking-[0.15em] uppercase font-black">Exit System</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
