"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { Mail, Trash2, ArrowLeft, Eye, Clock, User, Tag } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { motion } from "framer-motion";

export default function AdminMessagesPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchMessages();
    }
  }, [user, _hasHydrated, router]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contacts");
      setMessages(res.data.data);
    } catch (error) {
      toast.error("Failed to load inquiry records.");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success("Inquiry removed.");
      setMessages(messages.filter((m) => m._id !== id));
    } catch (error) {
      toast.error("Failed to delete inquiry.");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-6 sm:p-8 pt-12 sm:pt-20">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
        <ProfileAside />

        <div className="flex-1 w-full">
          <div className="mb-6 sm:mb-8 border-b border-gallery-border pb-6 sm:pb-8">
            <Link href="/admin/dashboard" className="text-xs uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-text transition-colors flex items-center gap-3 mb-6 font-black">
              <ArrowLeft size={16} /> Command Center
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extralight text-gallery-text tracking-tighter uppercase">Message Center</h1>
            <p className="text-gallery-muted text-[10px] sm:text-xs mt-2 uppercase tracking-[0.2em] font-bold">Manage inquiries and art consultations.</p>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {messages.length === 0 ? (
                <div className="bg-white border border-gallery-border p-20 text-center shadow-sm">
                  <p className="text-gallery-muted tracking-widest text-sm uppercase font-light">No inquiries recorded.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={message._id} 
                    className={`bg-white border transition-all duration-500 group relative overflow-hidden ${message.status === 'new' ? 'border-gallery-gold shadow-lg ring-1 ring-gallery-gold/10' : 'border-gallery-border shadow-sm'}`}
                  >
                    {message.status === 'new' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold" />
                    )}
                    <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            {message.status === 'new' && (
                              <span className="w-2 h-2 rounded-full bg-gallery-gold animate-pulse shrink-0" />
                            )}
                            <h3 className="text-base sm:text-lg font-black text-gallery-text tracking-tight uppercase truncate">
                              {message.name}
                            </h3>
                          </div>
                          <span className={`text-[9px] px-3 py-1 border uppercase tracking-widest font-black shrink-0 ${
                            message.status === 'new' ? 'bg-gallery-gold text-white border-gallery-gold' : 
                            message.status === 'read' ? 'bg-gallery-soft text-gallery-text border-gallery-border' : 
                            'bg-gallery-primary text-white border-gallery-primary'
                          }`}>
                            {message.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] tracking-widest uppercase text-gallery-muted font-black border-t border-gallery-soft pt-4 sm:pt-0 sm:border-0">
                          <div className="flex items-center gap-2"><Mail size={12} className="text-gallery-gold" /> <span className="truncate">{message.email}</span></div>
                          <div className="flex items-center gap-2"><Tag size={12} className="text-gallery-gold" /> <span className="truncate">{message.subject}</span></div>
                          <div className="flex items-center gap-2 ml-auto sm:ml-0"><Clock size={12} className="text-gallery-gold" /> {new Date(message.createdAt).toLocaleDateString()}</div>
                        </div>

                        <p className="text-gallery-muted text-sm font-light line-clamp-1 max-w-2xl italic">
                          "{message.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gallery-soft">
                        <Link 
                          href={`/admin/messages/${message._id}`}
                          className="flex-1 sm:flex-none h-14 px-8 border border-gallery-border text-[10px] tracking-[0.3em] uppercase font-black hover:bg-gallery-primary hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                        >
                          <Eye size={16} /> Open Records
                        </Link>
                        <button 
                          onClick={() => deleteMessage(message._id)}
                          className="w-14 h-14 flex items-center justify-center text-gallery-muted hover:text-red-500 hover:bg-red-50 transition-all active:scale-95 shrink-0 border border-gallery-border sm:border-0"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
