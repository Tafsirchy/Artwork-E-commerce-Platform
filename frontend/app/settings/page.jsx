"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, CreditCard, Save, Eye, EyeOff, Settings, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { user, updateUser, _hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    addresses: [],
    preferences: {
      exhibitions: true,
      receipts: true,
      curated: false,
    }
  });

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        addresses: user.addresses || [],
        preferences: user.preferences || {
          exhibitions: true,
          receipts: true,
          curated: false,
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Access keyphrases do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
        addresses: formData.addresses,
        preferences: formData.preferences,
      });
      
      updateUser(data);
      toast.success("Archive records synchronized successfully");
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to synchronize records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.zipCode) {
      toast.error("Please provide essential location markers");
      return;
    }
    
    const updatedAddresses = [...formData.addresses, { ...newAddress, _id: Date.now().toString() }];
    if (newAddress.isDefault) {
      updatedAddresses.forEach(addr => { if (addr._id !== updatedAddresses[updatedAddresses.length-1]._id) addr.isDefault = false; });
    }
    
    setFormData({ ...formData, addresses: updatedAddresses });
    setShowAddressForm(false);
    setNewAddress({ street: "", city: "", state: "", zipCode: "", country: "", isDefault: false });
    
    // Auto-save
    setTimeout(() => handleSubmit(), 0);
  };

  const removeAddress = (id) => {
    const updatedAddresses = formData.addresses.filter(addr => addr._id !== id);
    setFormData({ ...formData, addresses: updatedAddresses });
    setTimeout(() => handleSubmit(), 0);
  };

  const togglePreference = (key) => {
    const updatedPrefs = { ...formData.preferences, [key]: !formData.preferences[key] };
    setFormData({ ...formData, preferences: updatedPrefs });
    setTimeout(() => handleSubmit(), 0);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your account and all collections?")) {
      return;
    }
    
    setLoading(true);
    try {
      await api.delete("/auth/profile");
      toast.success("Account erased successfully.");
      useAuthStore.getState().logout();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to erase account");
      setLoading(false);
    }
  };

  const sections = [
    { id: "profile", label: "Identity", icon: <User size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
    { id: "addresses", label: "Shipment", icon: <MapPin size={16} /> },
    { id: "notifications", label: "Journal", icon: <Bell size={16} /> },
    { id: "billing", label: "Payments", icon: <CreditCard size={16} /> },
  ];

  const [activeSection, setActiveSection] = useState("profile");

  if (!_hasHydrated) {
    return <main className="bg-gallery-bg min-h-screen py-20 pb-32 animate-pulse" />;
  }

  if (!user) return null;

  return (
    <main className="bg-gallery-bg min-h-screen py-10 sm:py-20 pb-20 sm:pb-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <Link 
            href="/dashboard" 
            className="text-[10px] tracking-[0.4em] uppercase text-gallery-gold mb-4 inline-block font-black hover:gap-2 transition-all flex items-center gap-2"
          >
            <ArrowRight size={12} className="rotate-180" /> Back to Archive
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase leading-tight">Curator Settings</h1>
          <p className="text-gallery-muted text-xs sm:text-sm mt-2 font-light uppercase tracking-widest leading-relaxed">Manage your presence and security within the BRISTIII archives.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 items-start gap-8 sm:gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-2 lg:sticky lg:top-28 h-fit no-scrollbar">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-black transition-all border-b-2 lg:border-b-0 lg:border-l-2 ${
                  activeSection === section.id 
                    ? "bg-white border-gallery-gold text-gallery-text shadow-sm" 
                    : "border-transparent text-gallery-muted hover:bg-gallery-soft/50 hover:text-gallery-text bg-white/50 lg:bg-transparent"
                }`}
              >
                <span className="shrink-0">{section.icon}</span>
                <span className="whitespace-nowrap">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gallery-border p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                <Settings size={200} />
              </div>

              {activeSection === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-xl relative z-10"
                >
                  <h2 className="text-lg sm:text-xl font-extralight text-gallery-text uppercase tracking-widest mb-8 sm:mb-10 border-b border-gallery-border pb-6">Account Identity</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div className="space-y-5 sm:space-y-6">
                      <div className="relative group">
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-3">Display Name</label>
                        <div className="flex items-center border border-gallery-border focus-within:border-gallery-gold transition-colors bg-gallery-soft/10">
                          <div className="px-4 text-gallery-soft border-r border-gallery-border shrink-0"><User size={16} /></div>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-6 h-14 bg-transparent text-sm font-light focus:outline-none"
                            placeholder="Enter full name"
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-3">Electronic Mail</label>
                        <div className="flex items-center border border-gallery-border focus-within:border-gallery-gold transition-colors opacity-50 bg-gallery-soft/10">
                          <div className="px-4 text-gallery-soft border-r border-gallery-border shrink-0"><Mail size={16} /></div>
                          <input 
                            type="email" 
                            readOnly
                            value={formData.email}
                            className="w-full px-6 h-14 bg-transparent text-sm font-light focus:outline-none cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-2 text-[9px] text-gallery-muted uppercase tracking-widest italic font-bold">Email cannot be changed after registration.</p>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 h-14 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl disabled:opacity-50 active:scale-95"
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
                  className="max-w-xl relative z-10 space-y-10 sm:space-y-12"
                >
                  <div>
                    <h2 className="text-lg sm:text-xl font-extralight text-gallery-text uppercase tracking-widest mb-8 sm:mb-10 border-b border-gallery-border pb-6">Secure Access</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      <p className="text-xs text-gallery-muted font-light leading-relaxed mb-6 sm:mb-8 italic uppercase tracking-widest">
                        Enhance your vault protection by rotating your access credentials periodically. Leave blank if you don't wish to change.
                      </p>

                      <div className="space-y-5 sm:space-y-6">
                        <div className="relative group">
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-3">New Keyphrase</label>
                          <div className="flex items-center border border-gallery-border focus-within:border-gallery-gold transition-colors bg-gallery-soft/10">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full px-6 h-14 bg-transparent text-sm font-light focus:outline-none"
                              placeholder="Minimum 6 characters"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="px-4 text-gallery-soft hover:text-gallery-gold shrink-0"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="relative group">
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-3">Confirm New Keyphrase</label>
                          <input 
                            type="password" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full px-6 h-14 bg-transparent border border-gallery-border focus:border-gallery-gold text-sm font-light focus:outline-none bg-gallery-soft/10"
                            placeholder="Re-type keyphrase"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || !formData.password}
                        className="w-full sm:w-auto px-10 h-14 border border-gallery-text text-gallery-text text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-primary hover:text-white transition-all shadow-sm disabled:opacity-50 active:scale-95"
                      >
                        Rotate Access Key
                      </button>
                    </form>
                  </div>

                  <div className="pt-10 sm:pt-12 border-t border-gallery-border">
                    <h2 className="text-lg sm:text-xl font-extralight text-red-900/80 uppercase tracking-widest mb-6">Danger Zone</h2>
                    <p className="text-xs text-gallery-muted font-light leading-relaxed mb-6 uppercase tracking-widest">
                      Permanently erase your identity and collection records from the BRISTIII archives. This action cannot be undone.
                    </p>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="w-full sm:w-auto px-10 h-14 border border-red-200 text-red-600 text-[10px] tracking-[0.4em] uppercase font-black hover:bg-red-50 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                    >
                      Erase Account
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === "addresses" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-2xl relative z-10"
                >
                  <div className="flex justify-between items-end mb-8 sm:mb-10 border-b border-gallery-border pb-6">
                    <h2 className="text-lg sm:text-xl font-extralight text-gallery-text uppercase tracking-widest">Shipment Registry</h2>
                    <button 
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-[10px] tracking-[0.2em] uppercase text-gallery-gold font-black hover:underline"
                    >
                      {showAddressForm ? "Cancel" : "+ New Location"}
                    </button>
                  </div>

                  {showAddressForm && (
                    <div className="mb-10 sm:mb-12 p-6 sm:p-8 bg-gallery-soft/20 border border-gallery-border space-y-5 sm:space-y-6 shadow-inner">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-2">Street Address</label>
                          <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-white border border-gallery-border focus:border-gallery-gold text-sm font-light focus:outline-none"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-2">City</label>
                          <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-white border border-gallery-border focus:border-gallery-gold text-sm font-light focus:outline-none"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black mb-2">Postal Code</label>
                          <input 
                            type="text" 
                            className="w-full h-12 px-4 bg-white border border-gallery-border focus:border-gallery-gold text-sm font-light focus:outline-none"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id="default-addr" 
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          className="w-5 h-5 accent-gallery-gold"
                        />
                        <label htmlFor="default-addr" className="text-[10px] tracking-widest uppercase font-black text-gallery-muted">Primary Point</label>
                      </div>
                      <button 
                        onClick={handleAddAddress}
                        className="w-full h-14 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all active:scale-95 shadow-xl"
                      >
                        Register Address
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {formData.addresses.map((addr) => (
                      <div key={addr._id} className="p-6 border border-gallery-border relative group hover:border-gallery-gold/30 transition-all bg-gallery-soft/5 shadow-sm">
                        {addr.isDefault && (
                          <span className="absolute top-0 right-0 px-3 py-1 bg-gallery-gold text-white text-[8px] tracking-widest uppercase font-black">Primary</span>
                        )}
                        <p className="text-sm font-black text-gallery-text mb-2 uppercase tracking-tight">{addr.street}</p>
                        <p className="text-xs text-gallery-muted font-light mb-4 uppercase tracking-wider">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-gallery-border/50">
                          <button 
                            onClick={() => removeAddress(addr._id)}
                            className="text-[9px] tracking-widest uppercase text-red-400 hover:text-red-600 font-black transition-colors"
                          >
                            Erase
                          </button>
                          {!addr.isDefault && (
                            <button 
                              onClick={() => {
                                const updated = formData.addresses.map(a => ({ ...a, isDefault: a._id === addr._id }));
                                setFormData({ ...formData, addresses: updated });
                                setTimeout(() => handleSubmit(), 0);
                              }}
                              className="text-[9px] tracking-widest uppercase text-gallery-gold hover:text-gallery-text font-black transition-colors"
                            >
                              Set Primary
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {formData.addresses.length === 0 && !showAddressForm && (
                      <div className="col-span-2 p-12 text-center border border-dashed border-gallery-border bg-gallery-soft/5">
                        <p className="text-xs tracking-[0.4em] uppercase text-gallery-muted italic">No shipment markers recorded.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeSection === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-xl relative z-10"
                >
                  <h2 className="text-lg sm:text-xl font-extralight text-gallery-text uppercase tracking-widest mb-8 sm:mb-10 border-b border-gallery-border pb-6">Journal Subscriptions</h2>
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { key: 'exhibitions', label: 'Exhibitions', desc: 'New gallery openings.' },
                      { key: 'receipts', label: 'Certificates', desc: 'Digital acquisition records.' },
                      { key: 'curated', label: 'Curated Picks', desc: 'Monthly arrival digest.' }
                    ].map((pref) => (
                      <div 
                        key={pref.key} 
                        className="flex items-center justify-between p-6 border border-gallery-border hover:border-gallery-gold transition-colors cursor-pointer group bg-gallery-soft/5 shadow-sm"
                        onClick={() => togglePreference(pref.key)}
                      >
                        <div className="flex-1 pr-4">
                          <p className="text-sm text-gallery-text font-black uppercase tracking-widest mb-1 group-hover:text-gallery-gold transition-colors">{pref.label}</p>
                          <p className="text-[10px] text-gallery-muted font-light uppercase tracking-widest leading-relaxed">{pref.desc}</p>
                        </div>
                        <div className={`w-14 h-7 rounded-full relative transition-colors duration-500 shrink-0 ${formData.preferences[pref.key] ? 'bg-gallery-gold' : 'bg-gallery-soft'}`}>
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500 ${formData.preferences[pref.key] ? 'left-8' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-gallery-muted italic uppercase tracking-widest pt-4 font-bold">Your preferences are synchronized in real-time.</p>
                  </div>
                </motion.div>
              )}

              {activeSection === "billing" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-xl relative z-10"
                >
                  <h2 className="text-lg sm:text-xl font-extralight text-gallery-text uppercase tracking-widest mb-8 sm:mb-10 border-b border-gallery-border pb-6">Vault Billing</h2>
                  <div className="space-y-6 sm:space-y-8">
                    <div className="p-6 sm:p-8 border border-gallery-border bg-gallery-soft/10 shadow-inner">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <CreditCard className="text-gallery-gold" size={24} />
                          <span className="text-sm uppercase tracking-[0.2em] font-black">Primary Card</span>
                        </div>
                        <span className="text-[10px] tracking-widest uppercase bg-gallery-gold/10 text-gallery-gold px-3 py-1 font-black">Default</span>
                      </div>
                      <p className="font-mono text-xl sm:text-2xl tracking-widest mb-4 text-gallery-text">**** **** **** 4242</p>
                      <p className="text-xs text-gallery-muted uppercase tracking-widest font-bold">Expires 12/28</p>
                    </div>
                    
                    <button className="h-16 px-10 border border-gallery-text text-gallery-text text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-primary hover:text-white transition-all w-full text-center active:scale-95 shadow-sm">
                      + Add Payment Method
                    </button>
                    <p className="text-center text-[10px] text-gallery-muted uppercase tracking-[0.3em] italic font-bold">Payments are secured via AES-256 encryption.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
