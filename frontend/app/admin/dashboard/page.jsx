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
import { motion } from "framer-motion";
import AdminDashboardSkeleton from "@/components/ui/AdminDashboardSkeleton";

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
      const msg = error.response?.data?.message || "You do not have permission to view this page.";
      toast.error(msg);
    }
  };

  if (!_hasHydrated) return <AdminDashboardSkeleton />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg pt-12 sm:pt-24 pb-20 sm:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-8 sm:gap-12">

        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-gallery-muted text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-widest uppercase font-black mt-2">
              Site Management • Overview
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              { label: "Revenue", value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <TrendingUp size={20} />, title: `Total Revenue: $${stats.revenue.toLocaleString()}` },
              { label: "Orders", value: stats.orders, icon: <ShoppingBag size={20} />, title: `Total Orders: ${stats.orders}` },
              { label: "Stock", value: stats.products, icon: <Package size={20} />, title: `Stock: ${stats.products} items` },
              { label: "Users", value: stats.users, icon: <Users size={20} />, title: `Total Users: ${stats.users}` }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 sm:p-8 border border-gallery-border shadow-sm flex items-center gap-6 group hover:border-gallery-gold transition-all duration-500 overflow-hidden relative"
                title={stat.title}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full group-hover:bg-gallery-gold group-hover:text-white transition-colors shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-gallery-muted text-[10px] uppercase tracking-widest font-black truncate mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-light text-gallery-text truncate tracking-tight">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {[
              { title: "Order Records", desc: "View and update order statuses, generate invoices.", href: "/admin/orders" },
              { title: "Manage Art", desc: "Add new artwork, edit details, and track stock.", href: "/admin/products" },
              { title: "Blog Posts", desc: "Manage blog posts and news.", href: "/admin/blogs" },
              { title: "Messages", desc: "Respond to customer questions and inquiries.", href: "/admin/messages" }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                <Link
                  href={card.href}
                  className="block h-full p-8 sm:p-10 bg-white border border-gallery-border shadow-sm hover:border-gallery-gold hover:bg-gallery-soft/30 transition-all group relative overflow-hidden active:scale-95"
                >
                  <div className="relative z-10">
                    <h2 className="text-lg sm:text-xl font-extralight text-gallery-text mb-3 tracking-tight uppercase group-hover:text-gallery-gold transition-colors">{card.title}</h2>
                    <p className="text-gallery-muted text-xs font-light leading-relaxed group-hover:text-gallery-text transition-colors">{card.desc}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gallery-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Promotion Controls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white border border-gallery-border p-8 sm:p-10 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
              <TrendingUp size={200} />
            </div>
            <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black mb-8 border-b border-gallery-border pb-6">Sales Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 relative z-10">
              <div className="flex items-center justify-between p-6 sm:p-8 border border-gallery-border bg-gallery-soft/20 group hover:border-gallery-gold transition-colors">
                <div className="pr-4">
                  <p className="text-sm font-black text-gallery-text uppercase tracking-widest mb-1">Home Popup</p>
                  <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold">Show on home page</p>
                </div>
                <button
                  onClick={toggleSlider}
                  className={`h-12 px-8 text-[10px] tracking-[0.2em] uppercase font-black border transition-all active:scale-95 shadow-sm ${isSliderVisible ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'}`}
                >
                  {isSliderVisible ? 'Active' : 'Hidden'}
                </button>
              </div>

              <div className="p-6 sm:p-8 border border-gallery-border bg-gallery-soft/20 group hover:border-gallery-gold transition-colors">
                <p className="text-sm font-black text-gallery-text uppercase tracking-widest mb-6">Site-wide Discount</p>
                <div className="flex items-center gap-6">
                  <div className="relative w-28 sm:w-32">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={globalDiscount}
                      onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                      className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold font-light bg-white text-lg transition-colors"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none text-gallery-muted">%</div>
                  </div>
                  <span className="text-xl sm:text-2xl font-light text-gallery-text tracking-tighter uppercase leading-none">Off Global</span>
                </div>
                <p className="text-[9px] text-gallery-muted uppercase tracking-[0.2em] mt-4 font-black ">This discount applies to all items.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
