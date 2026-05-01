"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, X, Tag, Calendar, Check, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AdminPromoManagement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    discount: "",
    type: "Global",
    expiryDate: "",
    isActive: true
  });

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPromos();
    } else if (user) {
      router.push("/");
    }
  }, [user]);

  const fetchPromos = async () => {
    try {
      const { data } = await api.get("/promotions/all");
      setPromos(data);
    } catch (error) {
      toast.error("Failed to fetch campaign records");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        title: promo.title,
        code: promo.code,
        discount: promo.discount,
        type: promo.type,
        expiryDate: promo.expiryDate ? new Date(promo.expiryDate).toISOString().split('T')[0] : "",
        isActive: promo.isActive
      });
    } else {
      setEditingPromo(null);
      setFormData({
        title: "",
        code: "",
        discount: "",
        type: "Global",
        expiryDate: "",
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingPromo) {
        await api.put(`/promotions/${editingPromo._id}`, formData);
        toast.success("Campaign record updated");
      } else {
        await api.post("/promotions", formData);
        toast.success("New promotion inscribed into history");
      }
      setIsModalOpen(false);
      fetchPromos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to strike this promotion from history?")) {
      try {
        await api.delete(`/promotions/${id}`);
        toast.success("Promotion removed");
        fetchPromos();
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  const toggleStatus = async (promo) => {
    try {
      await api.put(`/promotions/${promo._id}`, { isActive: !promo.isActive });
      toast.success(`Campaign ${!promo.isActive ? 'activated' : 'deactivated'}`);
      fetchPromos();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gallery-bg py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <ProfileAside />

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-2">Campaign Management</p>
                <h1 className="text-4xl font-light text-gallery-text tracking-tight uppercase">
                  Promo <span className="font-serif italic text-gallery-gold">Records</span>
                </h1>
              </div>
              
              <button 
                onClick={() => handleOpenModal()}
                className="px-10 py-4 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gallery-gold transition-all flex items-center gap-3"
              >
                <Plus size={16} /> New Promo Code
              </button>
            </div>

            <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-gallery-muted uppercase tracking-widest text-xs">Accessing Records...</div>
              ) : promos.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <Tag className="mx-auto text-gallery-soft" size={48} />
                  <p className="text-gallery-muted uppercase tracking-widest text-[10px] font-bold">No active campaigns found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                      <tr>
                        <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Campaign & Code</th>
                        <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Benefit</th>
                        <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Expiry</th>
                        <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-bold text-gallery-text">Status</th>
                        <th className="px-8 py-5 text-right text-[10px] tracking-widest uppercase font-bold text-gallery-text">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gallery-border">
                      {promos.map((promo) => (
                        <tr key={promo._id} className="hover:bg-gallery-soft/10 transition-colors group">
                          <td className="px-8 py-6">
                            <div>
                              <p className="text-sm font-medium text-gallery-text mb-1">{promo.title}</p>
                              <code className="text-[10px] px-2 py-0.5 bg-gallery-soft text-gallery-primary font-bold tracking-widest uppercase border border-gallery-border/50">
                                {promo.code}
                              </code>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-xs font-bold text-gallery-accent uppercase tracking-wider">{promo.discount}</span>
                            <p className="text-[9px] text-gallery-muted uppercase mt-1 tracking-widest">{promo.type}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gallery-muted">
                              <Calendar size={12} />
                              <span className="text-[10px] uppercase tracking-widest font-bold">
                                {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Perpetual"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <button 
                              onClick={() => toggleStatus(promo)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-bold transition-all ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                              {promo.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleOpenModal(promo)} className="p-2 text-gallery-text hover:text-gallery-gold transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(promo._id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Promo Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gallery-primary/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white shadow-2xl border border-gallery-border overflow-hidden"
            >
              {/* Header */}
              <div className="px-10 py-5 border-b border-gallery-border bg-gallery-soft/30 flex justify-between items-center">
                <div>
                  <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-1">
                    {editingPromo ? "Edit Campaign" : "New Promotion"}
                  </h2>
                  <p className="text-[10px] text-gallery-muted uppercase tracking-widest">Inscribe discount records</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gallery-muted hover:text-gallery-text transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="px-10 py-8 space-y-5">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Campaign Title</label>
                    <input 
                      required type="text" value={formData.title} 
                      placeholder="e.g. Grand Spring Opening"
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-5 py-3 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Access Code</label>
                      <input 
                        required type="text" value={formData.code} 
                        placeholder="SPRING20"
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="w-full px-5 py-3 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-bold tracking-widest"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Benefit Value</label>
                      <input 
                        required type="text" value={formData.discount} 
                        placeholder="e.g. 20% OFF or $50 OFF"
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        className="w-full px-5 py-3 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Campaign Scope</label>
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light appearance-none cursor-pointer"
                      >
                        <option value="Global">Global Reach</option>
                        <option value="New Member">New Acquisition</option>
                        <option value="Category">Targeted Medium</option>
                        <option value="Flash Sale">Ephemeral Sale</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">Expiry Date</label>
                      <input 
                        type="date" value={formData.expiryDate} 
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full px-5 py-3 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`w-12 h-6 flex items-center transition-all px-1 ${formData.isActive ? 'bg-gallery-primary' : 'bg-gallery-soft'}`}
                    >
                      <div className={`w-4 h-4 bg-white shadow-sm transition-all transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gallery-muted">
                      {formData.isActive ? 'Campaign Active' : 'Campaign Suspended'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 pt-3">
                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    className="flex-1 py-4 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-black transition-all disabled:opacity-50"
                  >
                    {actionLoading ? "Synchronizing..." : (editingPromo ? "Commit Changes" : "Publish Campaign")}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-10 py-4 border border-gallery-border text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-gallery-soft transition-all"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
