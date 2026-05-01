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

  return (
    <section className="bg-gallery-bg min-h-screen py-24">
      <div className="container mx-auto px-6 max-w-[1600px] flex flex-col lg:flex-row items-start gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase mb-2">
                Collector Overview
              </h1>
              <p className="text-gallery-muted text-sm tracking-widest uppercase font-medium">
                BRISTIII Private Archive • Welcome Back, {user?.name}
              </p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white border border-gallery-border relative overflow-hidden group hover:border-gallery-gold transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex justify-between items-start mb-6">
                  <div className="text-gallery-gold">{stat.icon}</div>
                  <span className="text-3xl font-light text-gallery-text">{stat.value}</span>
                </div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2 space-y-8"
            >
              <div className="flex justify-between items-end border-b border-gallery-border pb-6">
                <h2 className="text-xs tracking-[0.6em] uppercase text-gallery-text font-bold">Recent Acquisitions</h2>
                <Link href="/orders" className="text-[9px] tracking-[0.2em] uppercase text-gallery-gold font-bold hover:gap-2 flex items-center gap-1 transition-all">
                  View All <ArrowRight size={10} />
                </Link>
              </div>
              
              {/* Latest Order Tracking */}
              {recentOrders.length > 0 && (
                <div className="bg-white border border-gallery-border p-8 pb-16">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold mb-8">Latest Order Journey</h3>
                  <OrderTracking order={recentOrders[0]} />
                </div>
              )}
              
              <div className="space-y-4">
                {loading ? (
                   <div className="p-10 text-center uppercase tracking-widest text-gallery-muted text-[10px]">Accessing Records...</div>
                ) : recentOrders.map((order) => (
                  <div 
                    key={order._id}
                    className="p-8 bg-white border border-gallery-border hover:border-gallery-gold/30 transition-all flex flex-col md:flex-row justify-between items-center gap-6 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gallery-soft flex items-center justify-center">
                        <Clock size={18} className="text-gallery-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gallery-text mb-1 uppercase tracking-wider">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-gallery-muted tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="text-center md:text-right">
                        <p className="text-lg font-light text-gallery-text mb-1">${order.totalPrice.toFixed(2)}</p>
                        <span className={`text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1 border ${order.isDelivered ? 'border-green-200 text-green-600 bg-green-50' : order.isTransit ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-gallery-gold/20 text-gallery-gold bg-gallery-gold/5'}`}>
                          {order.isDelivered ? "Delivered" : order.isTransit ? "In Transit" : "Processing"}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsTrackingOpen(true);
                        }}
                        className="px-6 py-3 border border-gallery-text text-gallery-text text-[8px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-primary hover:text-white transition-all group-hover:border-gallery-gold group-hover:text-gallery-gold"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                ))}
                {!loading && recentOrders.length === 0 && (
                  <div className="p-16 text-center border border-dashed border-gallery-border bg-white/50">
                    <p className="text-[10px] tracking-widest uppercase text-gallery-muted">No acquisitions recorded yet.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowRight size={14} className="rotate-180" />
                  </button>
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-gallery-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions / Shortcuts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8 lg:sticky lg:top-28 h-fit self-start"
            >
              <h2 className="text-xs tracking-[0.6em] uppercase text-gallery-text font-bold border-b border-gallery-border pb-6">Shortcuts</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <Link href="/wishlist" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                  <Heart size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold">My Wishlist</span>
                </Link>
                <Link href="/settings" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                  <Settings size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Security & Keys</span>
                </Link>
                <Link href="/contact" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                  <MapPin size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Shipping Address</span>
                </Link>
              </div>

              <div className="p-8 bg-gallery-primary text-white space-y-6">
                <h3 className="text-xs tracking-[0.3em] uppercase font-bold">Need Assistance?</h3>
                <p className="text-[10px] leading-relaxed text-white/60 tracking-wider">
                  Our VIP concierge service is available 24/7 for our distinguished collectors.
                </p>
                <Link href="/contact" className="inline-block text-[9px] tracking-[0.3em] uppercase font-bold border-b border-gallery-gold pb-1 text-gallery-gold">
                  Contact Concierge
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
