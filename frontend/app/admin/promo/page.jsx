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
      toast.error("Failed to load promotions");
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
        toast.success("Promotion updated");
      } else {
        await api.post("/promotions", formData);
        toast.success("New promotion added");
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
    if (window.confirm("Are you sure you want to delete this promotion?")) {
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
      toast.success(`Promotion ${!promo.isActive ? 'activated' : 'deactivated'}`);
      fetchPromos();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gallery-bg py-12 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          {/* Sidebar */}
          <ProfileAside />

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 gap-8">
              <div>
                <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-2 font-black">Promotion Management</p>
                <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tight uppercase leading-tight">
                  Promotions
                </h1>
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto h-14 px-8 bg-gallery-primary text-white text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                <Plus size={16} /> Add Promo
              </button>
            </div>

            <div className="bg-white border border-gallery-border shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-gallery-muted uppercase tracking-widest text-xs">Loading...</div>
              ) : promos.length === 0 ? (
                <div className="p-20 text-center space-y-6">
                  <Tag className="mx-auto text-gallery-soft" size={64} strokeWidth={1} />
                  <p className="text-gallery-muted uppercase tracking-widest text-xs font-black">No promotions found</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {/* Mobile Card Layout */}
                  <div className="grid grid-cols-1 divide-y divide-gallery-border sm:hidden">
                    {promos.map((promo) => (
                      <motion.div
                        key={promo._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 space-y-6"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-black text-gallery-text uppercase tracking-tight mb-2">{promo.title}</p>
                            <code className="text-[10px] px-3 py-1 bg-gallery-soft text-gallery-primary font-black tracking-widest uppercase border border-gallery-border/50">
                              {promo.code}
                            </code>
                          </div>
                          <button
                            onClick={() => toggleStatus(promo)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black transition-all ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${promo.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            {promo.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-gallery-soft/20 p-4 rounded-lg">
                          <div>
                            <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-black mb-1">Discount</p>
                            <p className="text-base font-black text-gallery-accent uppercase">{promo.discount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-black mb-1">Type</p>
                            <p className="text-xs text-gallery-text uppercase tracking-widest font-black">{promo.type}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2 text-gallery-muted">
                            <Calendar size={14} />
                            <span className="text-[10px] uppercase tracking-widest font-black">
                              {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Perpetual"}
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => handleOpenModal(promo)} className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-text hover:text-gallery-gold transition-colors active:scale-95 shadow-sm">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(promo._id)} className="w-12 h-12 flex items-center justify-center border border-gallery-border text-red-400 hover:text-red-600 transition-colors active:scale-95 shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                        <tr>
                          <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-black text-gallery-text">Promotion & Code</th>
                          <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-black text-gallery-text">Discount</th>
                          <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-black text-gallery-text">Expires</th>
                          <th className="px-8 py-5 text-[10px] tracking-widest uppercase font-black text-gallery-text">Status</th>
                          <th className="px-8 py-5 text-right text-[10px] tracking-widest uppercase font-black text-gallery-text">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gallery-border">
                        {promos.map((promo) => (
                          <tr key={promo._id} className="hover:bg-gallery-soft/10 transition-colors group">
                            <td className="px-8 py-6">
                              <div>
                                <p className="text-sm font-medium text-gallery-text mb-2 uppercase tracking-tight">{promo.title}</p>
                                <code className="text-[10px] px-2 py-0.5 bg-gallery-soft text-gallery-primary font-bold tracking-widest uppercase border border-gallery-border/50">
                                  {promo.code}
                                </code>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-black text-gallery-accent uppercase tracking-wider">{promo.discount}</span>
                              <p className="text-[10px] text-gallery-muted uppercase mt-1 tracking-widest font-bold">{promo.type}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-gallery-muted">
                                <Calendar size={12} />
                                <span className="text-[10px] uppercase tracking-widest font-black">
                                  {promo.expiryDate ? new Date(promo.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Never"}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <button
                                onClick={() => toggleStatus(promo)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-black transition-all ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                {promo.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(promo)} className="w-10 h-10 flex items-center justify-center border border-gallery-border text-gallery-text hover:text-gallery-gold transition-colors active:scale-95">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(promo._id)} className="w-10 h-10 flex items-center justify-center border border-gallery-border text-red-400 hover:text-red-600 transition-colors active:scale-95">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Promo Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gallery-primary/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-xl bg-white shadow-2xl border-t sm:border border-gallery-border overflow-hidden rounded-t-3xl sm:rounded-none max-h-[95vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 sm:px-10 py-6 border-b border-gallery-border bg-gallery-soft/30 flex justify-between items-center">
                <div>
                  <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black mb-1">
                    {editingPromo ? "Edit Promotion" : "New Promotion"}
                  </h2>
                  <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold">Add promotion details</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-6 no-scrollbar">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Title</label>
                    <input
                      required type="text" value={formData.title}
                      placeholder="e.g. Grand Spring Opening"
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full h-14 px-6 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Code</label>
                      <input
                        required type="text" value={formData.code}
                        placeholder="SPRING20"
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="w-full h-14 px-6 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-black tracking-widest"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Discount</label>
                      <input
                        required type="text" value={formData.discount}
                        placeholder="e.g. 20% OFF or $50 OFF"
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        className="w-full h-14 px-6 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Type</label>
                      <div className="relative">
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full h-14 px-6 bg-white border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light appearance-none cursor-pointer"
                        >
                          <option value="Global">All Items</option>
                          <option value="New Member">New Users</option>
                          <option value="Category">Specific Art</option>
                          <option value="Flash Sale">Flash Sale</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gallery-muted">
                          <Plus size={14} className="rotate-45" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-black text-gallery-muted">Expiry Date</label>
                      <input
                        type="date" value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full h-14 px-6 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-sm font-light"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                      className={`w-14 h-7 flex items-center transition-all px-1 rounded-full ${formData.isActive ? 'bg-gallery-primary shadow-inner' : 'bg-gallery-soft'}`}
                    >
                      <motion.div
                        animate={{ x: formData.isActive ? 28 : 0 }}
                        className="w-5 h-5 bg-white shadow-lg rounded-full"
                      />
                    </button>
                    <span className="text-xs uppercase tracking-widest font-black text-gallery-muted">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-8 sm:pb-0">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 h-16 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black transition-all disabled:opacity-50 shadow-xl active:scale-95"
                  >
                    {actionLoading ? "Saving..." : (editingPromo ? "Save Changes" : "Add Promotion")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-16 px-10 border border-gallery-border text-[10px] uppercase tracking-[0.4em] font-black hover:bg-gallery-soft transition-all active:scale-95"
                  >
                    Cancel
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
