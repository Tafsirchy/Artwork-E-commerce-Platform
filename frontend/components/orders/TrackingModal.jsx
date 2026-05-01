"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Package } from "lucide-react";
import OrderTracking from "./OrderTracking";

export default function TrackingModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white w-full max-w-4xl border border-gallery-border shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-gallery-border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gallery-soft flex items-center justify-center text-gallery-gold">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-[10px] tracking-[0.5em] uppercase text-gallery-muted font-bold mb-1">Live Acquisition Tracker</h2>
                <p className="text-sm font-bold text-gallery-text tracking-wider uppercase">Order Record #{order._id.slice(-12).toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gallery-soft transition-colors"
            >
              <X size={20} className="text-gallery-muted" />
            </button>
          </div>

          {/* Tracking Body */}
          <div className="p-12 bg-gallery-bg/30">
            <OrderTracking order={order} />
          </div>

          {/* Footer Info */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gallery-border">
            <div className="flex gap-4">
              <MapPin size={20} className="text-gallery-gold shrink-0" />
              <div>
                <p className="text-[9px] tracking-widest uppercase text-gallery-muted font-bold mb-2">Delivery Destination</p>
                <p className="text-xs text-gallery-text leading-relaxed">
                  {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-right">
                <p className="text-[9px] tracking-widest uppercase text-gallery-muted font-bold mb-1">Final Status Update</p>
                <p className="text-xs font-bold text-gallery-text uppercase">
                    {order.isDelivered ? "Successfully Delivered" : "Processing and Quality Assurance"}
                </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
