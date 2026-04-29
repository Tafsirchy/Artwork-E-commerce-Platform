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
      <h1 className="text-4xl font-light text-gallery-text mb-10">Order Management</h1>
      
      <div className="bg-gallery-surface border border-gallery-border overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gallery-soft text-gallery-muted border-b border-gallery-border text-sm uppercase tracking-wider">
              <th className="p-4">Order ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gallery-border hover:bg-gallery-soft transition-colors">
                <td className="p-4 text-gallery-text text-sm font-medium">{order._id}</td>
                <td className="p-4 text-gallery-text">{order.user?.name || "Unknown"}</td>
                <td className="p-4 text-gallery-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-gallery-text">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">
                  {order.isPaid ? (
                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">
                      <Check size={14} /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium">
                      <X size={14} /> Unpaid
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDownloadInvoice(order._id)}
                    className="flex items-center gap-2 px-3 py-1 bg-gallery-primary text-white rounded text-sm hover:bg-black transition-colors"
                  >
                    <Download size={14} /> Invoice
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gallery-muted">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
