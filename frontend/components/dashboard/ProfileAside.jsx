"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Shield, Save, Edit3, LogOut, Camera, Home, Tag } from "lucide-react";
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
    <aside className="w-full lg:w-80 lg:sticky lg:top-32 h-fit mb-8 lg:mb-0">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white border border-gallery-border p-8 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gallery-gold/20" />
          
          <div className="flex flex-col items-center text-center">
            {/* Avatar Placeholder */}
            <div className="relative w-24 h-24 mb-6">
              <div className="w-full h-full bg-gallery-soft rounded-full flex items-center justify-center border border-gallery-border overflow-hidden group-hover:border-gallery-gold transition-colors">
                <User size={40} className="text-gallery-muted" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white border border-gallery-border rounded-full hover:text-gallery-gold transition-all shadow-sm">
                <Camera size={14} />
              </button>
            </div>

            <div className="w-full space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gallery-gold bg-gallery-soft/30 text-center text-sm font-light focus:outline-none"
                    placeholder="Full Name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex-1 py-2 bg-gallery-primary text-white text-[9px] uppercase tracking-widest font-bold disabled:opacity-50"
                    >
                      {loading ? "..." : "Save"}
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setName(user.name); }}
                      className="flex-1 py-2 border border-gallery-border text-[9px] uppercase tracking-widest font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg font-light text-gallery-text tracking-tight flex items-center justify-center gap-2">
                    {user.name}
                    <button onClick={() => setIsEditing(true)} className="text-gallery-muted hover:text-gallery-gold">
                      <Edit3 size={14} />
                    </button>
                  </h3>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-gold font-bold">
                    {user.role === 'admin' ? 'Head Curator' : 'Collector'}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-gallery-border space-y-4">
                <div className="flex items-center gap-3 text-gallery-muted">
                  <Mail size={14} />
                  <span className="text-xs truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gallery-muted">
                  <Shield size={14} />
                  <span className="text-[10px] tracking-widest uppercase font-bold text-gallery-soft">Verified Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Links */}
        <div className="bg-white border border-gallery-border shadow-sm divide-y divide-gallery-border">
          <Link href={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} 
            className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">Overview</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          {user.role === 'admin' ? (
            <>
              <Link href="/admin/products" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">Artworks</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/admin/orders" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">Orders</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/admin/home" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">Home Content</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/admin/promo" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text text-gallery-gold">Promotions</span>
                <Tag size={14} className="text-gallery-gold" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/orders" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">My Orders</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/wishlist" className="flex items-center justify-between px-6 py-4 hover:bg-gallery-soft transition-colors group">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">Wishlist</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </>
          )}
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition-colors group text-red-500"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Sign Out</span>
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
