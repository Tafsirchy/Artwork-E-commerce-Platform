"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api, { setAuthToken } from "@/lib/api";
import Link from "next/link";
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";
import usePromotionStore from "@/store/promotionStore";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { user, token, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  const { isSliderVisible, toggleSlider, globalDiscount, setGlobalDiscount } = usePromotionStore();

  useEffect(() => {
    // Only act once hydration is complete
    if (!_hasHydrated) return;

    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      // Synchronize the API token state before fetching
      if (token) {
        setAuthToken(token);
      }
      fetchStats();
    }
  }, [user, token, _hasHydrated]);

  const fetchStats = async () => {
    try {
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
      const msg = error.response?.data?.message || "Unauthorized access to curatorial records";
      toast.error(msg);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-8 pt-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-4xl font-light text-gallery-text mb-10 tracking-tighter uppercase">Curator Command Center</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div 
              className="bg-white p-6 border border-gallery-border shadow-sm flex items-center gap-4 group hover:border-gallery-gold transition-colors overflow-hidden"
              title={`Total Revenue: $${stats.revenue.toLocaleString()}`}
            >
              <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full group-hover:bg-gallery-gold group-hover:text-white transition-colors shrink-0">
                <TrendingUp size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-gallery-muted text-[10px] uppercase tracking-widest font-bold truncate">Revenue</p>
                <p className="text-2xl font-light text-gallery-text truncate tracking-tight">
                  ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            <div 
              className="bg-white p-6 border border-gallery-border shadow-sm flex items-center gap-4 group hover:border-gallery-gold transition-colors overflow-hidden"
              title={`Total Orders: ${stats.orders}`}
            >
              <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full group-hover:bg-gallery-gold group-hover:text-white transition-colors shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-gallery-muted text-[10px] uppercase tracking-widest font-bold truncate">Orders</p>
                <p className="text-2xl font-light text-gallery-text">{stats.orders}</p>
              </div>
            </div>

            <div 
              className="bg-white p-6 border border-gallery-border shadow-sm flex items-center gap-4 group hover:border-gallery-gold transition-colors overflow-hidden"
              title={`Inventory: ${stats.products} items`}
            >
              <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full group-hover:bg-gallery-gold group-hover:text-white transition-colors shrink-0">
                <Package size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-gallery-muted text-[10px] uppercase tracking-widest font-bold truncate">Inventory</p>
                <p className="text-2xl font-light text-gallery-text">{stats.products}</p>
              </div>
            </div>

            <div 
              className="bg-white p-6 border border-gallery-border shadow-sm flex items-center gap-4 group hover:border-gallery-gold transition-colors overflow-hidden"
              title={`Active Collectors: ${stats.users}`}
            >
              <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full group-hover:bg-gallery-gold group-hover:text-white transition-colors shrink-0">
                <Users size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-gallery-muted text-[10px] uppercase tracking-widest font-bold truncate">Collectors</p>
                <p className="text-2xl font-light text-gallery-text">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link href="/admin/orders" className="block p-8 bg-white border border-gallery-border shadow-sm hover:border-gallery-gold transition-all group">
              <h2 className="text-2xl font-light text-gallery-text mb-2 tracking-tight uppercase group-hover:text-gallery-gold">Order Archives</h2>
              <p className="text-gallery-muted text-sm font-light">View and update order statuses, generate invoices.</p>
            </Link>
            <Link href="/admin/products" className="block p-8 bg-white border border-gallery-border shadow-sm hover:border-gallery-gold transition-all group">
              <h2 className="text-2xl font-light text-gallery-text mb-2 tracking-tight uppercase group-hover:text-gallery-gold">Gallery Collection</h2>
              <p className="text-gallery-muted text-sm font-light">Add new artwork, edit details, and track inventory.</p>
            </Link>
          </div>

          {/* Promotion Controls */}
          <div className="bg-white border border-gallery-border p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
              <TrendingUp size={200} />
            </div>
            <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-8">Promotional Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="flex items-center justify-between p-6 border border-gallery-border bg-gallery-soft/30">
                <div>
                  <p className="text-sm font-bold text-gallery-text uppercase tracking-widest mb-1">Entrance Offer Slider</p>
                  <p className="text-[10px] text-gallery-muted uppercase tracking-widest">Visibility on landing page</p>
                </div>
                <button 
                  onClick={toggleSlider}
                  className={`px-6 py-2 text-[10px] tracking-[0.2em] uppercase font-bold border transition-all ${isSliderVisible ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}
                >
                  {isSliderVisible ? 'Active' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 border border-gallery-border bg-gallery-soft/30">
                <p className="text-sm font-bold text-gallery-text uppercase tracking-widest mb-4">Global Curator Discount</p>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-gallery-border focus:outline-none focus:border-gallery-gold font-light bg-white"
                  />
                  <span className="text-xl font-light text-gallery-text">% OFF</span>
                </div>
                <p className="text-[9px] text-gallery-muted uppercase tracking-[0.2em] mt-3 font-bold">Applies to all non-discounted items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
