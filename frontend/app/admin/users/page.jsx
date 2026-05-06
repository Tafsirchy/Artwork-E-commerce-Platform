"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api, { setAuthToken } from "@/lib/api";
import { toast } from "react-toastify";
import { Edit2, Trash2, X, User as UserIcon, Shield, ChevronDown } from "lucide-react";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { motion } from "framer-motion";
import AdminTableSkeleton from "@/components/ui/AdminTableSkeleton";

export default function AdminUsersPage() {
  const { user: currentUser, token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [originalRole, setOriginalRole] = useState(null);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (currentUser?.role === "admin") {
      if (token) setAuthToken(token);
      fetchUsers();
    } else if (currentUser) {
      router.push("/");
    }
  }, [currentUser, _hasHydrated, token]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      const msg = error.response?.data?.message || "Failed to fetch users";
      toast.error(msg);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) {
      toast.error("You cannot delete your own admin account");
      return;
    }
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleEdit = (u) => {
    setIsEditing(true);
    setEditId(u._id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setOriginalRole(u.role);
    setPhone(u.phone || "");
    setShowModal(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setEmail("");
    setRole("customer");
    setOriginalRole(null);
    setPhone("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${editId}`, { name, email, role, phone });
      toast.success("User updated successfully!");
      resetForm();
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!_hasHydrated) return null;
  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg pt-12 sm:pt-24 pb-20 sm:pb-32">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 sm:gap-12">

        {/* Sidebar Profile */}
        <ProfileAside />

        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 gap-6">
            <h1 className="text-2xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase">User Records</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12">
            {/* List View */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-gallery-border pb-4">
                <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black">System Users</h2>
                <div className="text-xs tracking-[0.2em] uppercase text-gallery-muted font-black">
                  {users.length} Total Users
                </div>
              </div>
              
              {fetchLoading ? (
                <AdminTableSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* Mobile Card Layout */}
                  <div className="grid grid-cols-1 gap-4 sm:hidden">
                    {currentItems.map((u) => (
                      <motion.div 
                        key={u._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gallery-border p-4 shadow-sm space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gallery-soft/30 rounded-full flex items-center justify-center border border-gallery-border overflow-hidden shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={20} className="text-gallery-muted" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-gallery-text truncate uppercase tracking-tight">{u.name}</p>
                            <p className="text-[10px] text-gallery-muted truncate font-bold">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-gallery-soft pt-4">
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-gallery-gold/10 text-gallery-gold border border-gallery-gold/20' : 'bg-gallery-soft text-gallery-muted border border-gallery-border'}`}>
                            {u.role}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(u)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-gallery-gold hover:bg-gallery-soft transition-all active:scale-95 shadow-sm"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(u._id)}
                              className="w-12 h-12 flex items-center justify-center border border-gallery-border text-red-400 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block bg-white border border-gallery-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gallery-soft/30 border-b border-gallery-border">
                          <tr>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">User</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Email</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Role</th>
                            <th className="px-6 py-4 text-[10px] tracking-widest uppercase font-black text-gallery-text">Joined</th>
                            <th className="px-6 py-4 text-right text-[10px] tracking-widest uppercase font-black text-gallery-text">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gallery-border">
                          {currentItems.map((u) => (
                            <tr key={u._id} className="hover:bg-gallery-soft/10 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gallery-soft/30 rounded-full flex items-center justify-center border border-gallery-border overflow-hidden shrink-0">
                                    {u.avatar ? (
                                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <UserIcon size={16} className="text-gallery-muted" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-gallery-text truncate max-w-[150px]">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gallery-muted">{u.email}</td>
                              <td className="px-6 py-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-gallery-gold/10 text-gallery-gold border border-gallery-gold/20' : 'bg-gallery-soft text-gallery-muted border border-gallery-border'}`}>
                                  {u.role === 'admin' && <Shield size={10} />}
                                  {u.role}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gallery-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-6">
                                  <button
                                    onClick={() => handleEdit(u)}
                                    className="text-xs tracking-widest uppercase font-black text-gallery-gold hover:text-gallery-primary transition-colors flex items-center gap-2"
                                  >
                                    <Edit2 size={14} /> <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(u._id)}
                                    className="text-xs tracking-widest uppercase font-black text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                                  >
                                    <Trash2 size={14} /> <span>Remove</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gallery-border">
                      <p className="text-xs tracking-widest uppercase text-gallery-muted font-black">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="flex-1 sm:flex-none h-12 px-6 border border-gallery-border text-xs tracking-[0.2em] uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Previous
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="flex-1 sm:flex-none h-12 px-6 border border-gallery-border text-xs tracking-[0.2em] uppercase font-black hover:bg-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { resetForm(); setShowModal(false); }}
            className="absolute inset-0 bg-gallery-primary/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-lg border-t sm:border border-gallery-border shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] rounded-t-3xl sm:rounded-none"
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-gallery-border flex items-center justify-between bg-gallery-soft/30">
              <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-black">
                Edit User Details
              </h2>
              <button onClick={() => { resetForm(); setShowModal(false); }} className="w-10 h-10 flex items-center justify-center text-gallery-muted hover:text-gallery-text transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 no-scrollbar">
              <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] sm:text-xs uppercase tracking-widest text-gallery-muted font-black">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full h-16 sm:h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-base sm:text-sm font-light bg-gallery-soft/5 transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[11px] sm:text-xs uppercase tracking-widest text-gallery-muted font-black">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-16 sm:h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-base sm:text-sm font-light bg-gallery-soft/5 transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] sm:text-xs uppercase tracking-widest text-gallery-muted font-black">Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full h-16 sm:h-14 px-6 border border-gallery-border focus:outline-none focus:border-gallery-gold text-base sm:text-sm font-light bg-gallery-soft/5 transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-gallery-muted font-black">User Role</label>
                  <div className="relative group">
                    <select 
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                      disabled={originalRole === "admin"}
                      className="w-full h-16 sm:h-14 px-6 border border-gallery-border bg-white focus:outline-none focus:border-gallery-gold text-base sm:text-sm font-light appearance-none cursor-pointer disabled:bg-gallery-soft/30 disabled:cursor-not-allowed transition-all">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gallery-muted group-focus-within:text-gallery-gold transition-colors">
                      <ChevronDown size={18} strokeWidth={1.5} />
                    </div>
                  </div>
                  {originalRole === "admin" ? (
                    <p className="text-[10px] text-gallery-gold uppercase tracking-widest font-black mt-2">🛡️ Admin roles are protected and cannot be changed.</p>
                  ) : (
                    <p className="text-[10px] text-gallery-muted uppercase tracking-widest font-bold mt-2">Caution: Changing a user to Admin gives them full site access.</p>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-6 border-t border-gallery-border flex flex-col sm:flex-row gap-4 bg-gallery-soft/30 pb-10 sm:pb-6">
              <button
                type="submit"
                form="user-form"
                disabled={loading}
                className="w-full sm:flex-1 h-16 bg-gallery-primary text-white text-[11px] sm:text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-gold transition-all disabled:opacity-50 shadow-xl active:scale-95 flex items-center justify-center"
              >
                {loading ? "Saving..." : "Update User"}
              </button>
              <button
                onClick={() => { resetForm(); setShowModal(false); }}
                className="w-full sm:w-auto sm:px-10 h-16 border border-gallery-border text-[11px] sm:text-[10px] tracking-[0.3em] uppercase font-black hover:bg-white transition-all active:scale-95 flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
