"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";
import usePromotionStore from "@/store/promotionStore";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  const { isSliderVisible, toggleSlider, globalDiscount, setGlobalDiscount } = usePromotionStore();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // In a real app, you'd have an aggregate API endpoint.
      // Here we fetch arrays and compute to keep it simple.
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);
      
      const revenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
      
      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        users: 10, // Mock for now
        revenue: revenue,
      });
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-8">
      <h1 className="text-4xl font-light text-gallery-text mb-10">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Revenue</p>
            <p className="text-3xl font-light text-gallery-text">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Orders</p>
            <p className="text-3xl font-light text-gallery-text">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Products</p>
            <p className="text-3xl font-light text-gallery-text">{stats.products}</p>
          </div>
        </div>

        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Users</p>
            <p className="text-3xl font-light text-gallery-text">{stats.users}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Link href="/admin/orders" className="block p-8 bg-gallery-surface border border-gallery-border shadow-sm hover:border-gallery-primary transition-colors">
          <h2 className="text-2xl font-light text-gallery-text mb-2 tracking-tight uppercase">Order Archives</h2>
          <p className="text-gallery-muted text-sm font-light">View and update order statuses, generate invoices.</p>
        </Link>
        <Link href="/admin/products" className="block p-8 bg-gallery-surface border border-gallery-border shadow-sm hover:border-gallery-primary transition-colors">
          <h2 className="text-2xl font-light text-gallery-text mb-2 tracking-tight uppercase">Gallery Collection</h2>
          <p className="text-gallery-muted text-sm font-light">Add new artwork, edit details, and track inventory.</p>
        </Link>
      </div>

      {/* Promotion Controls */}
      <div className="bg-white border border-gallery-border p-10 shadow-sm">
        <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-8">Promotional Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-center justify-between p-6 border border-gallery-border">
            <div>
              <p className="text-sm font-bold text-gallery-text uppercase tracking-widest mb-1">Home Offer Slider</p>
              <p className="text-[10px] text-gallery-muted uppercase tracking-widest">Visibility on landing page</p>
            </div>
            <button 
              onClick={toggleSlider}
              className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase font-bold border ${isSliderVisible ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}
            >
              {isSliderVisible ? 'Active' : 'Hidden'}
            </button>
          </div>

          <div className="p-6 border border-gallery-border">
            <p className="text-sm font-bold text-gallery-text uppercase tracking-widest mb-4">Global Curator Discount</p>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={globalDiscount}
                onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                className="w-24 px-4 py-2 border border-gallery-border focus:outline-none focus:border-gallery-gold font-light"
              />
              <span className="text-xl font-light text-gallery-text">% OFF</span>
            </div>
            <p className="text-[9px] text-gallery-muted uppercase tracking-[0.2em] mt-3 font-bold">Applies to all non-discounted items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
