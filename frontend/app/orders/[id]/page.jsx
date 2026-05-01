"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Download
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import OrderTracking from "@/components/orders/OrderTracking";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
      toast.error("Order details not found");
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Invoice not available yet");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gallery-bg flex items-center justify-center">
      <div className="text-[10px] tracking-[0.5em] uppercase text-gallery-muted animate-pulse">Consulting Archives...</div>
    </div>
  );

  if (!order) return null;

  return (
    <main className="bg-gallery-bg min-h-screen py-24 pb-40">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <Link
              href="/orders"
              className="text-[9px] tracking-[0.4em] uppercase text-gallery-gold mb-4 inline-block font-bold hover:gap-2 transition-all"
            >
              ← Back to My Acquisitions
            </Link>
            <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase mb-2">
              Acquisition <span className="font-serif">Details</span>
            </h1>
            <p className="text-gallery-muted text-[10px] tracking-[0.3em] uppercase font-medium">
              Order #{order._id.toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownloadInvoice}
              className="px-8 py-4 border border-gallery-border bg-white text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-gallery-soft transition-all flex items-center gap-3"
            >
              <Download size={14} /> Download Certificate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">

            {/* 📍 Order Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gallery-border p-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gallery-gold/10" />
              <h3 className="text-[10px] tracking-[0.4em] uppercase text-gallery-text font-bold mb-10 flex items-center gap-3">
                <Truck size={14} className="text-gallery-gold" /> Order Journey
              </h3>
              <OrderTracking order={order} />
            </motion.div>

            {/* 🖼️ Artworks list */}
            <div className="space-y-6">
              <h3 className="text-[10px] tracking-[0.4em] uppercase text-gallery-text font-bold mb-8">Items in this Collection</h3>
              {order.orderItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-8 p-6 bg-white border border-gallery-border group hover:border-gallery-gold transition-all"
                >
                  <div className="w-24 h-24 bg-gallery-soft overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <img src={item.image || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gallery-text uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gallery-muted uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light text-gallery-text">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-gallery-primary p-8 text-white space-y-6">
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-gallery-gold">Acquisition Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] tracking-widest uppercase">
                  <span className="text-white/60">Payment</span>
                  <span className={order.isPaid ? "text-green-400" : "text-red-400"}>{order.isPaid ? "Secured" : "Pending"}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] tracking-widest uppercase">
                  <span className="text-white/60">Delivery</span>
                  <span className={order.isDelivered ? "text-green-400" : (order.isPaid ? "text-gallery-gold" : "text-white/40")}>
                    {order.isDelivered ? "Received" : (order.isPaid ? "In Transit" : "Processing")}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white border border-gallery-border p-8 space-y-6">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-text font-bold flex items-center gap-2">
                <MapPin size={14} className="text-gallery-gold" /> Destination
              </h3>
              <div className="text-[11px] leading-relaxed text-gallery-muted tracking-widest uppercase font-medium">
                <p className="text-gallery-text mb-2">{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-4 border-t border-gallery-border pt-4">Contact: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="bg-white border border-gallery-border p-8 space-y-4">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-text font-bold flex items-center gap-2 mb-2">
                <CreditCard size={14} className="text-gallery-gold" /> Investment Summary
              </h3>
              <div className="space-y-3 text-[10px] tracking-widest uppercase text-gallery-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="pt-3 border-t border-gallery-border flex justify-between text-gallery-text font-bold">
                  <span>Total</span>
                  <span className="text-lg">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
