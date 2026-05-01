"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Check, X, Download } from "lucide-react";

export default function AdminOrders() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      // Fetch the PDF blob
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
      console.error("Download failed", error);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-gallery-text mb-10 tracking-tighter uppercase">Order Archives</h1>
        
        <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gallery-soft/30 border-b border-gallery-border">
              <tr>
                <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Order Identifier</th>
                <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Collector</th>
                <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Acquisition Date</th>
                <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Total Value</th>
                <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Status</th>
                <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-bold text-gallery-text">Documentation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gallery-border">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gallery-soft/10 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gallery-text text-xs tracking-wider">#{order._id.toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gallery-text">{order.user?.name || "Anonymous Collector"}</p>
                    <p className="text-[10px] text-gallery-muted tracking-tight">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-light text-gallery-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gallery-accent">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1.5 text-green-600 border border-green-200 bg-green-50 px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
                        <Check size={12} /> Secured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-red-600 border border-red-200 bg-red-50 px-3 py-1 text-[9px] uppercase font-bold tracking-widest">
                        <X size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownloadInvoice(order._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gallery-border text-[9px] tracking-widest uppercase font-bold hover:bg-gallery-primary hover:text-white transition-all"
                    >
                      <Download size={12} /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-20 text-center uppercase tracking-[0.4em] text-gallery-muted text-xs">No order records found in the archive.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
