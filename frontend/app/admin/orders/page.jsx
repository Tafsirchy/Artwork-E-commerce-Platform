"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Check, X, Download, Truck, PackageCheck } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";

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
    <div className="min-h-screen bg-gallery-bg p-8 pt-24">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-4xl font-light text-gallery-text mb-10 tracking-tighter uppercase">Order Archives</h1>
          
          <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
            {loading ? (
               <div className="p-20 text-center uppercase tracking-[0.4em] text-gallery-muted text-xs">Accessing Records...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                    <tr>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Acquisition ID</th>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Collector</th>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Date</th>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Total Value</th>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Payment</th>
                      <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Delivery Status</th>
                      <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-bold text-gallery-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gallery-border">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gallery-soft/10 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gallery-text text-xs tracking-wider">#{order._id.toUpperCase().slice(-8)}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gallery-text font-medium">{order.user?.name || "Anonymous"}</p>
                          <p className="text-[10px] text-gallery-muted tracking-tight">{order.user?.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm font-light text-gallery-muted">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gallery-accent">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {order.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-green-600 text-[9px] uppercase font-bold tracking-widest">
                              <Check size={10} /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 text-[9px] uppercase font-bold tracking-widest">
                              <X size={10} /> Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1.5 text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
                              <PackageCheck size={12} /> Received
                            </span>
                          ) : order.isTransit ? (
                            <span className="inline-flex items-center gap-1.5 text-amber-600 border border-amber-100 bg-amber-50 px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
                              <Truck size={12} /> In Transit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-gallery-muted border border-gallery-border bg-gallery-soft/30 px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
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
                                className="p-2 border border-gallery-border text-gallery-muted hover:text-amber-600 hover:border-amber-600 transition-all"
                              >
                                <Truck size={14} />
                              </button>
                            )}
                            {order.isTransit && !order.isDelivered && (
                              <button 
                                onClick={() => handleDeliver(order._id)}
                                title="Mark as Delivered"
                                className="p-2 border border-gallery-border text-gallery-muted hover:text-blue-600 hover:border-blue-600 transition-all"
                              >
                                <PackageCheck size={14} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDownloadInvoice(order._id)}
                              title="Download Invoice"
                              className="p-2 border border-gallery-border text-gallery-muted hover:text-gallery-primary hover:border-gallery-primary transition-all"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-20 text-center uppercase tracking-[0.4em] text-gallery-muted text-xs">No records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
