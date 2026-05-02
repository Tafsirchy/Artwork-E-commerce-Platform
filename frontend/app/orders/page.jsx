"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, ChevronRight, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import OrdersSkeleton from "@/components/ui/OrdersSkeleton";
import { toast } from "react-toastify";

export default function UserOrdersPage() {
  const { user, _hasHydrated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else if (_hasHydrated && !user) {
      setLoading(false);
    }
  }, [user, _hasHydrated]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch personal orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      
      // Ensure the browser knows this is a PDF, otherwise it might fail to load.
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Invoice Download Error:", error);
      toast.error("Invoice not available yet");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchId]);

  const filteredOrders = orders.filter((order) => {
    // In Transit: Must be paid AND not delivered
    if (filter === "transit") {
      return order.isPaid && !order.isDelivered;
    }
    // Processing: Not paid yet (and not delivered)
    if (filter === "processing") {
      return !order.isPaid && !order.isDelivered;
    }
    // Delivered: Must be delivered
    if (filter === "delivered") {
      return order.isDelivered;
    }
    
    if (searchId && !order._id.toLowerCase().includes(searchId.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Render skeleton until Zustand has finished reading localStorage
  if (!_hasHydrated) return <OrdersSkeleton />;

  return (
    <main className="bg-gallery-bg min-h-screen py-20 pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <Link 
            href="/dashboard" 
            className="text-[9px] tracking-[0.4em] uppercase text-gallery-gold mb-4 inline-block font-bold"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase">My Acquisitions</h1>
          <p className="text-gallery-muted text-sm mt-2 font-light">A chronological record of your artistic journey.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gallery-border pb-6">
          <div className="flex gap-8">
            <button 
              onClick={() => setFilter("all")} 
              className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${filter === "all" ? "text-gallery-accent border-b border-gallery-accent pb-1" : "text-gallery-muted hover:text-gallery-text"}`}
            >
              All Orders
            </button>
            <button 
              onClick={() => setFilter("processing")} 
              className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${filter === "processing" ? "text-gallery-accent border-b border-gallery-accent pb-1" : "text-gallery-muted hover:text-gallery-text"}`}
            >
              Processing
            </button>
            <button 
              onClick={() => setFilter("transit")} 
              className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${filter === "transit" ? "text-gallery-accent border-b border-gallery-accent pb-1" : "text-gallery-muted hover:text-gallery-text"}`}
            >
              In Transit
            </button>
            <button 
              onClick={() => setFilter("delivered")} 
              className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${filter === "delivered" ? "text-gallery-accent border-b border-gallery-accent pb-1" : "text-gallery-muted hover:text-gallery-text"}`}
            >
              Delivered
            </button>
          </div>
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gallery-muted" />
            <input 
              type="text" 
              placeholder="Search ID..." 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gallery-border text-[10px] tracking-widest uppercase focus:outline-none focus:border-gallery-gold w-64"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center uppercase tracking-[0.5em] text-gallery-muted text-xs">Accessing Archives...</div>
          ) : filteredOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gallery-border group hover:border-gallery-gold transition-all duration-500 overflow-hidden"
              >
                <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                  {/* Order Info */}
                  <div className="space-y-4 md:w-1/3">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-1">Order Identifier</p>
                      <p className="text-sm font-bold text-gallery-text">#{order._id.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-1">Acquisition Date</p>
                      <p className="text-sm font-light text-gallery-text">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="md:w-1/3 flex items-center">
                    <div className="flex -space-x-4">
                      {order.orderItems.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="w-16 h-16 border-2 border-white bg-gallery-soft shadow-sm grayscale group-hover:grayscale-0 transition-all overflow-hidden relative">
                          <Image src={item.image || item.imageUrl} alt={item.name || item.title} fill className="object-cover" sizes="64px" />
                        </div>
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="w-16 h-16 border-2 border-white bg-gallery-primary text-white flex items-center justify-center text-xs font-bold relative z-10">
                          +{order.orderItems.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="ml-8">
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gallery-text">{order.orderItems.length} {order.orderItems.length === 1 ? 'Artwork' : 'Artworks'}</p>
                      <p className="text-xs text-gallery-muted font-light">Investment: ${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="md:w-1/3 flex flex-col md:items-end justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
                      <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-gallery-text">
                        {order.isPaid ? 'Acquisition Secured' : 'Payment Required'}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="flex-1 md:flex-none px-6 py-3 border border-gallery-border text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-gallery-soft transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={14} /> Invoice
                      </button>
                      <Link href={`/orders/${order._id}`} className="flex-1 md:flex-none px-6 py-3 bg-gallery-primary text-white text-[9px] tracking-[0.2em] uppercase font-bold hover:bg-gold transition-all flex items-center justify-center gap-2">
                        Details <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 bg-white border border-gallery-border text-center">
              <Package size={48} className="mx-auto text-gallery-soft mb-6" />
              <h2 className="text-xl font-light text-gallery-text uppercase tracking-widest mb-2">No Acquisitions Found</h2>
              <p className="text-gallery-muted text-sm font-light mb-8 italic">No orders match your current filters.</p>
              <Link href="/products" className="inline-block px-12 py-4 border border-gallery-gold text-gallery-gold text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-gold hover:text-white transition-all">
                Explore Collection
              </Link>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 text-[10px] font-bold uppercase tracking-widest border transition-all ${currentPage === i + 1 ? 'bg-gallery-primary text-white border-gallery-primary' : 'bg-white text-gallery-muted border-gallery-border hover:border-gallery-gold'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 border border-gallery-border hover:border-gallery-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
