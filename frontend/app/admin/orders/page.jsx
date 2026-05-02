"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Check, X, Download, Truck, PackageCheck } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      const msg = error.response?.data?.message || "Failed to fetch order archive";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTransit = async (orderId) => {
    if (!window.confirm("Mark this acquisition as in transit?")) return;
    try {
      await api.put(`/orders/${orderId}/transit`);
      toast.success("Order status updated to In Transit");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status to Transit");
    }
  };

  const handleDeliver = async (orderId) => {
    if (!window.confirm("Mark this acquisition as delivered?")) return;
    try {
      await api.put(`/orders/${orderId}/deliver`);
      toast.success("Order status updated to Delivered");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status to Delivered");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Invoice documentation not available");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-6 sm:p-8 pt-12 sm:pt-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase leading-tight">Order Archives</h1>
            <p className="text-gallery-muted text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-widest uppercase font-black mt-2">
              Logistics & Acquisitions • Global Registry
            </p>
          </motion.div>
          
          <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
            {loading ? (
               <div className="p-20 text-center uppercase tracking-[0.4em] text-gallery-muted text-xs">Accessing Records...</div>
            ) : (
              <div className="space-y-0">
                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 divide-y divide-gallery-border sm:hidden">
                  {orders.map((order) => (
                    <motion.div 
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 space-y-6"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-gallery-text tracking-widest uppercase mb-1">#{order._id.toUpperCase().slice(-8)}</p>
                          <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-gallery-accent leading-none mb-2">${order.totalPrice.toFixed(2)}</p>
                          {order.isPaid ? (
                            <span className="text-[9px] text-green-600 uppercase font-black tracking-widest border border-green-100 bg-green-50 px-2 py-0.5">Paid</span>
                          ) : (
                            <span className="text-[9px] text-red-400 uppercase font-black tracking-widest border border-red-100 bg-red-50 px-2 py-0.5">Unpaid</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-gallery-soft/20 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-white border border-gallery-border flex items-center justify-center rounded-full shrink-0">
                          <PackageCheck size={18} className="text-gallery-muted" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gallery-text truncate uppercase tracking-tight">{order.user?.name || "Anonymous"}</p>
                          <p className="text-[10px] text-gallery-muted truncate uppercase tracking-widest font-bold">{order.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1.5 text-blue-600 text-[9px] uppercase font-black tracking-widest">
                              <PackageCheck size={12} /> Received
                            </span>
                          ) : order.isTransit ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-600 text-[9px] uppercase font-black tracking-widest">
                              <Truck size={12} /> In Transit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-gallery-muted text-[9px] uppercase font-black tracking-widest">
                              <X size={12} /> Processing
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {!order.isTransit && !order.isDelivered && (
                            <button 
                              onClick={() => handleTransit(order._id)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-amber-600 hover:border-amber-600 transition-all active:scale-95 shadow-sm"
                            >
                              <Truck size={18} />
                            </button>
                          )}
                          {order.isTransit && !order.isDelivered && (
                            <button 
                              onClick={() => handleDeliver(order._id)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-blue-600 hover:border-blue-600 transition-all active:scale-95 shadow-sm"
                            >
                              <PackageCheck size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-gallery-primary hover:border-gallery-primary transition-all active:scale-95 shadow-sm"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                      <tr>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Acquisition ID</th>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Collector</th>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Date</th>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Total Value</th>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Payment</th>
                        <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Delivery Status</th>
                        <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-black text-gallery-text">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gallery-border">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gallery-soft/10 transition-colors group">
                          <td className="px-6 py-4 font-black text-gallery-text text-xs tracking-wider">#{order._id.toUpperCase().slice(-8)}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gallery-text font-black uppercase tracking-tight">{order.user?.name || "Anonymous"}</p>
                            <p className="text-[10px] text-gallery-muted tracking-widest uppercase font-bold">{order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-light text-gallery-muted uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-gallery-accent">${order.totalPrice.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {order.isPaid ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-[9px] uppercase font-black tracking-widest">
                                <Check size={10} /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-400 text-[9px] uppercase font-black tracking-widest">
                                <X size={10} /> Unpaid
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {order.isDelivered ? (
                              <span className="inline-flex items-center gap-1.5 text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1 text-[9px] uppercase font-black tracking-widest">
                                <PackageCheck size={12} /> Received
                              </span>
                            ) : order.isTransit ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-600 border border-amber-100 bg-amber-50 px-3 py-1 text-[9px] uppercase font-black tracking-widest">
                                <Truck size={12} /> In Transit
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-gallery-muted border border-gallery-border bg-gallery-soft/30 px-3 py-1 text-[9px] uppercase font-black tracking-widest">
                                <X size={12} /> Processing
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {!order.isTransit && !order.isDelivered && (
                                <button 
                                  onClick={() => handleTransit(order._id)}
                                  title="Mark as In Transit"
                                  className="w-10 h-10 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-amber-600 hover:border-amber-600 transition-all active:scale-95"
                                >
                                  <Truck size={14} />
                                </button>
                              )}
                              {order.isTransit && !order.isDelivered && (
                                <button 
                                  onClick={() => handleDeliver(order._id)}
                                  title="Mark as Delivered"
                                  className="w-10 h-10 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-blue-600 hover:border-blue-600 transition-all active:scale-95"
                                >
                                  <PackageCheck size={14} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDownloadInvoice(order._id)}
                                title="Download Invoice"
                                className="w-10 h-10 flex items-center justify-center border border-gallery-border text-gallery-muted hover:text-gallery-primary hover:border-gallery-primary transition-all active:scale-95"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!loading && orders.length === 0 && (
                  <div className="p-20 text-center uppercase tracking-[0.4em] text-gallery-muted text-xs">No records found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
