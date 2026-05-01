"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  FileText,
  ShieldCheck,
  Truck
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-toastify";
import OrderTracking from "@/components/orders/OrderTracking";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      toast.error("Failed to retrieve acquisition records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Invoice generation failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gallery-bg flex items-center justify-center">
      <div className="text-[10px] tracking-[0.5em] uppercase text-gallery-muted animate-pulse">Decrypting Records...</div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-gallery-bg flex flex-col items-center justify-center p-6 text-center">
      <ShieldCheck size={48} className="text-gallery-soft mb-6" />
      <h1 className="text-2xl font-light text-gallery-text uppercase tracking-widest mb-4">Acquisition Not Found</h1>
      <Link href="/orders" className="text-gallery-gold text-[10px] tracking-widest uppercase font-bold border-b border-gallery-gold pb-1">Return to Archives</Link>
    </div>
  );

  return (
    <main className="bg-gallery-bg min-h-screen py-20 pb-32">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <Link 
              href="/orders" 
              className="text-[9px] tracking-[0.4em] uppercase text-gallery-gold mb-4 inline-block font-bold"
            >
              ← Back to Archives
            </Link>
            <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase mb-2">Acquisition Detail</h1>
            <p className="text-gallery-muted text-[10px] tracking-[0.2em] uppercase font-bold">Record ID: #{order._id.toUpperCase()}</p>
          </div>
          <button 
            onClick={downloadInvoice}
            className="px-8 py-4 border border-gallery-border text-gallery-text text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-soft transition-all flex items-center gap-3"
          >
            <FileText size={14} /> Download Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Status Stepper */}
            <section className="bg-white border border-gallery-border p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
                    <Truck size={120} />
                </div>
                <h2 className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold mb-10 border-b border-gallery-border pb-4">Live Logistics Status</h2>
                <OrderTracking order={order} />
            </section>

            {/* Artworks List */}
            <section className="bg-white border border-gallery-border">
              <h2 className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold p-8 border-b border-gallery-border">Acquired Masterpieces</h2>
              <div className="divide-y divide-gallery-border">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="p-8 flex items-center gap-8 group">
                    <div className="w-24 h-32 bg-gallery-soft border border-gallery-border overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-light text-gallery-text uppercase tracking-wide">{item.title}</h3>
                      <p className="text-[10px] tracking-widest text-gallery-muted uppercase">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gallery-accent pt-2">${item.price.toFixed(2)} per unit</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-lg font-light text-gallery-text">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Shipping Info */}
            <div className="bg-white border border-gallery-border p-8">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-gold font-bold mb-6 flex items-center gap-3">
                <MapPin size={14} /> Destination
              </h3>
              <div className="space-y-4 text-sm font-light text-gallery-text leading-relaxed">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="uppercase tracking-widest text-[10px] font-bold">{order.shippingAddress.country}</p>
                <div className="pt-4 border-t border-gallery-border mt-4">
                    <p className="text-[9px] tracking-widest uppercase text-gallery-muted mb-1">Contact</p>
                    <p className="font-mono text-xs">{order.shippingAddress.phone || "No contact provided"}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gallery-primary text-white p-8">
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-gold font-bold mb-8 flex items-center gap-3">
                <CreditCard size={14} /> Financial Record
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-light text-white/70">
                  <span>Subtotal</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-light text-white/70">
                  <span>Logistics</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-light">
                  <span>Total</span>
                  <span className="text-gallery-gold">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
                  <span className="text-[9px] tracking-[0.2em] uppercase font-bold">
                    {order.isPaid ? 'Payment Cleared' : 'Pending Transaction'}
                  </span>
                </div>
                <p className="text-[8px] tracking-widest uppercase text-white/40 italic">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white border border-gallery-border p-8">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-gallery-muted font-bold mb-6 flex items-center gap-3">
                    <Clock size={14} /> Timeline
                </h3>
                <div className="space-y-4 text-[10px] tracking-widest uppercase">
                    <div className="flex justify-between">
                        <span className="text-gallery-muted">Archived</span>
                        <span className="text-gallery-text">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {order.isPaid && (
                        <div className="flex justify-between">
                            <span className="text-gallery-muted">Verified</span>
                            <span className="text-gallery-text">{new Date(order.paidAt).toLocaleDateString()}</span>
                        </div>
                    )}
                    {order.isDelivered && (
                        <div className="flex justify-between text-green-600">
                            <span>Delivered</span>
                            <span>{new Date(order.deliveredAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
