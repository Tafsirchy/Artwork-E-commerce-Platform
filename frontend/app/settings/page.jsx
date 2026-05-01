"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, CreditCard, Save, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile records updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "profile", label: "Identity", icon: <User size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
    { id: "notifications", label: "Journal", icon: <Bell size={16} /> },
    { id: "billing", label: "Payments", icon: <CreditCard size={16} /> },
  ];

  const [activeSection, setActiveSection] = useState("profile");

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
          <h1 className="text-4xl font-light text-gallery-text tracking-tighter uppercase">Curator Settings</h1>
          <p className="text-gallery-muted text-sm mt-2 font-light">Manage your presence and security within the BRISTIII archives.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-[0.3em] uppercase font-bold transition-all border-l-2 ${
                  activeSection === section.id 
                    ? "bg-white border-gallery-gold text-gallery-text shadow-sm" 
                    : "border-transparent text-gallery-muted hover:bg-gallery-soft/50 hover:text-gallery-text"
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gallery-border p-10 lg:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                <Settings size={200} />
              </div>

              {activeSection === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-xl relative z-10"
                >
                  <h2 className="text-xl font-light text-gallery-text uppercase tracking-widest mb-10 border-b border-gallery-border pb-6">Account Identity</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="relative group">
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-3">Display Name</label>
                        <div className="flex items-center border border-gallery-border focus-within:border-gallery-gold transition-colors">
                          <div className="px-4 text-gallery-soft border-r border-gallery-border"><User size={16} /></div>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-6 py-4 bg-transparent text-sm font-light focus:outline-none"
                            placeholder="Enter full name"
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-3">Electronic Mail</label>
                        <div className="flex items-center border border-gallery-border focus-within:border-gallery-gold transition-colors">
                          <div className="px-4 text-gallery-soft border-r border-gallery-border"><Mail size={16} /></div>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-6 py-4 bg-transparent text-sm font-light focus:outline-none"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-gold transition-all rounded-none disabled:opacity-50"
                    >
                      <Save size={14} /> {loading ? "Updating..." : "Commit Changes"}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-xl relative z-10"
                >
                  <h2 className="text-xl font-light text-gallery-text uppercase tracking-widest mb-10 border-b border-gallery-border pb-6">Secure Access</h2>
                  
                  <div className="space-y-8">
                    <p className="text-sm text-gallery-muted font-light leading-relaxed mb-8 italic">
                      Enhance your vault protection by rotating your access credentials periodically.
                    </p>

                    <div className="space-y-6">
                      <div className="relative group">
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-3">Current Keyphrase</label>
                        <div className="flex items-center border border-gallery-border">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            className="w-full px-6 py-4 bg-transparent text-sm font-light focus:outline-none"
                            placeholder="••••••••••••"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-4 text-gallery-soft hover:text-gallery-gold"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="block text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-bold mb-3">New Keyphrase</label>
                        <input 
                          type="password" 
                          className="w-full px-6 py-4 bg-transparent border border-gallery-border focus:border-gallery-gold text-sm font-light focus:outline-none"
                          placeholder="••••••••••••"
                        />
                      </div>
                    </div>

                    <button className="px-10 py-4 border border-gallery-text text-gallery-text text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-gallery-primary hover:text-white transition-all rounded-none">
                      Rotate Access Key
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "notifications" && (
                <div className="text-center py-20">
                  <Bell size={40} className="mx-auto text-gallery-soft mb-6" />
                  <p className="text-[10px] tracking-widest uppercase font-bold text-gallery-muted">Journal Subscriptions Coming Soon</p>
                </div>
              )}

              {activeSection === "billing" && (
                <div className="text-center py-20">
                  <CreditCard size={40} className="mx-auto text-gallery-soft mb-6" />
                  <p className="text-[10px] tracking-widest uppercase font-bold text-gallery-muted">Vault Billing Methods Coming Soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
