"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Heart, 
  Settings, 
  MapPin, 
  Clock,
  ArrowRight,
  Shield
} from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useWishlistStore from "@/store/wishlistStore";
import api from "@/lib/api";
import ProfileAside from "@/components/dashboard/ProfileAside";
import OrderTracking from "@/components/orders/OrderTracking";
import TrackingModal from "@/components/orders/TrackingModal";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

export default function CustomerDashboard() {
  const { user, _hasHydrated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else if (_hasHydrated && !user) {
      // Hydrated but no user — stop the loading spinner
      setLoading(false);
    }
  }, [user, _hasHydrated]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), icon: <Package size={20} /> },
    { label: "Wishlist Items", value: wishlistItems.length.toString(), icon: <Heart size={20} /> },
    { label: "Account Status", value: user?.role === 'admin' ? "Admin" : "Verified", icon: <Shield size={20} /> },
  ];

  const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const recentOrders = sortedOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  // Show skeleton until Zustand has rehydrated from localStorage.
  // Without this guard, `user` is null for ~100ms and pages flash empty.
  if (!_hasHydrated) return <DashboardSkeleton />;
  if (!user) return null;

  return (
    <section className="bg-gallery-bg min-h-screen pt-12 sm:pt-24 pb-20 sm:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          {/* Header Section */}
          <div className="mb-8 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase mb-2">
                Account Overview
              </h1>
              <p className="text-gallery-muted text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-widest uppercase font-black">
                Your Account • Welcome Back, {user?.name}
              </p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 sm:p-10 bg-white border border-gallery-border relative overflow-hidden group hover:border-gallery-gold transition-all duration-500 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="text-gallery-gold">{stat.icon}</div>
                  <span className="text-2xl sm:text-3xl font-light text-gallery-text">{stat.value}</span>
                </div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-black">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2 space-y-6 sm:space-y-8"
            >
              <div className="flex justify-between items-end border-b border-gallery-border pb-6">
                <h2 className="text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase text-gallery-text font-black">Recent Orders</h2>
                <Link href="/orders" className="text-xs tracking-[0.2em] uppercase text-gallery-gold font-black hover:gap-2 flex items-center gap-2 transition-all">
                  View All <ArrowRight size={12} />
                </Link>
              </div>
              
              {/* Latest Order Tracking */}
              {recentOrders.length > 0 && (
                <div className="bg-white border border-gallery-border p-6 sm:p-8 pb-12 sm:pb-16 shadow-sm">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-black mb-6 sm:mb-8">Last Order Status</h3>
                  <OrderTracking order={recentOrders[0]} />
                </div>
              )}
              
              <div className="space-y-4">
                {loading ? (
                   <div className="p-10 text-center uppercase tracking-widest text-gallery-muted text-xs">Loading...</div>
                ) : recentOrders.map((order) => (
                  <div 
                    key={order._id}
                    className="p-6 sm:p-8 bg-white border border-gallery-border hover:border-gallery-gold/30 transition-all flex flex-col sm:flex-row justify-between items-center gap-6 group shadow-sm"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-12 h-12 bg-gallery-soft flex items-center justify-center shrink-0">
                        <Clock size={18} className="text-gallery-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gallery-text mb-1 uppercase tracking-wider">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gallery-muted tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gallery-border">
                      <div className="text-left sm:text-right">
                        <p className="text-xl font-black text-gallery-text tracking-tighter leading-none mb-1">${order.totalPrice.toFixed(2)}</p>
                        <span className={`text-[9px] tracking-[0.2em] uppercase font-black px-3 py-1 border ${order.isDelivered ? 'border-green-200 text-green-600 bg-green-50' : order.isTransit ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-gallery-gold/20 text-gallery-gold bg-gallery-gold/5'}`}>
                          {order.isDelivered ? "Delivered" : order.isTransit ? "In Transit" : "Processing"}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsTrackingOpen(true);
                        }}
                        className="h-12 px-8 border border-gallery-text text-gallery-text text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-primary hover:text-white transition-all group-hover:border-gallery-gold group-hover:text-gallery-gold active:scale-95"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && recentOrders.length === 0 && (
                  <div className="p-16 text-center border border-dashed border-gallery-border bg-white/50">
                    <p className="text-xs tracking-widest uppercase text-gallery-muted">No orders found.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-gallery-soft shadow-sm"
                  >
                    <ArrowRight size={16} className="rotate-180" />
                  </button>
                  <span className="text-xs tracking-[0.3em] uppercase font-black text-gallery-muted">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-gallery-soft shadow-sm"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions / Shortcuts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 sm:space-y-8 lg:sticky lg:top-28 h-fit self-start w-full"
            >
              <h2 className="text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase text-gallery-text font-black border-b border-gallery-border pb-6">Shortcuts</h2>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <Link href="/wishlist" className="h-20 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group px-8 shadow-sm">
                  <Heart size={20} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-xs tracking-[0.3em] uppercase font-black">My Wishlist</span>
                </Link>
                <Link href="/settings" className="h-20 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group px-8 shadow-sm">
                  <Settings size={20} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-xs tracking-[0.3em] uppercase font-black">Security Settings</span>
                </Link>
                <Link href="/contact" className="h-20 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group px-8 shadow-sm">
                  <MapPin size={20} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-xs tracking-[0.3em] uppercase font-black">Shipping Address</span>
                </Link>
              </div>

              <div className="p-8 bg-gallery-primary text-white space-y-6 shadow-2xl">
                <h3 className="text-xs tracking-[0.3em] uppercase font-black">Need Help?</h3>
                <p className="text-[11px] leading-relaxed text-white/60 tracking-wider font-light uppercase">
                  Our support team is available 24/7 to help you.
                </p>
                <Link href="/contact" className="inline-block text-[10px] tracking-[0.3em] uppercase font-black border-b border-gallery-gold pb-1 text-gallery-gold hover:text-white hover:border-white transition-all">
                  Contact Support
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <TrackingModal 
        isOpen={isTrackingOpen} 
        onClose={() => setIsTrackingOpen(false)} 
        order={selectedOrder} 
      />
    </section>
  );
}
