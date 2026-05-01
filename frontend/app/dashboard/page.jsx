"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  CreditCard, 
  MapPin, 
  Clock,
  ArrowRight,
  Shield
} from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: "Total Orders", value: "12", icon: <Package size={20} /> },
    { label: "Wishlist Items", value: "8", icon: <Heart size={20} /> },
    { label: "Account Status", value: "Verified", icon: <Shield size={20} /> },
  ];

  const recentOrders = [
    { id: "ORD-9921", date: "Oct 24, 2024", total: "$1,250.00", status: "In Transit" },
    { id: "ORD-8812", date: "Sep 15, 2024", total: "$450.00", status: "Delivered" },
    { id: "ORD-7703", date: "Aug 02, 2024", total: "$890.00", status: "Delivered" },
  ];

  return (
    <main className="bg-gallery-bg min-h-screen py-20">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase mb-2">
              Welcome Back, <span className="font-serif italic text-gallery-gold">{user?.name || "Collector"}</span>
            </h1>
            <p className="text-gallery-muted text-sm tracking-widest uppercase font-medium">
              Member since 2024 • Collector ID: #8291
            </p>
          </motion.div>
          
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-8 py-4 border border-gallery-border bg-white text-[10px] tracking-[0.4em] uppercase font-bold text-gallery-text hover:border-gallery-gold transition-all rounded-none"
          >
            <Settings size={14} /> Profile Settings
          </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex justify-between items-end border-b border-gallery-border pb-6">
              <h2 className="text-xs tracking-[0.6em] uppercase text-gallery-text font-bold">Recent Acquisitions</h2>
              <Link href="/orders" className="text-[9px] tracking-[0.2em] uppercase text-gallery-gold font-bold hover:gap-2 flex items-center gap-1 transition-all">
                View All <ArrowRight size={10} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  className="p-8 bg-white border border-gallery-border hover:border-gallery-gold/30 transition-all flex flex-col md:flex-row justify-between items-center gap-6 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gallery-soft flex items-center justify-center">
                      <Clock size={18} className="text-gallery-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gallery-text mb-1 uppercase tracking-wider">{order.id}</p>
                      <p className="text-[10px] text-gallery-muted tracking-widest">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className="text-lg font-light text-gallery-text mb-1">{order.total}</p>
                    <span className={`text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1 border ${order.status === 'Delivered' ? 'border-green-200 text-green-600 bg-green-50' : 'border-gallery-gold/20 text-gallery-gold bg-gallery-gold/5'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions / Shortcuts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <h2 className="text-xs tracking-[0.6em] uppercase text-gallery-text font-bold border-b border-gallery-border pb-6">Shortcuts</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Link href="/wishlist" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                <Heart size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold">My Wishlist</span>
              </Link>
              <Link href="/cart" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                <CreditCard size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Billing & Payments</span>
              </Link>
              <Link href="/shipping" className="p-6 bg-white border border-gallery-border hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-6 group">
                <MapPin size={18} className="text-gallery-gold group-hover:text-white transition-colors" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Shipping Addresses</span>
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
    </main>
  );
}
