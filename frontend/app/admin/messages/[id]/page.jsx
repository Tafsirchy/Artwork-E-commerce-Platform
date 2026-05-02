"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Trash2, Mail, Tag, Clock, User, Reply, Archive, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import ProfileAside from "@/components/dashboard/ProfileAside";
import { motion, AnimatePresence } from "framer-motion";

export default function MessageDetailsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchMessage();
    }
  }, [user, _hasHydrated]);

  const fetchMessage = async () => {
    try {
      const res = await api.get(`/contacts/${params.id}`);
      setMessage(res.data.data);
    } catch (error) {
      toast.error("Failed to load message.");
      router.push("/admin/messages");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/contacts/${params.id}`, { status });
      setMessage({ ...message, status });
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const deleteMessage = async () => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api.delete(`/contacts/${params.id}`);
      toast.success("Message deleted.");
      router.push("/admin/messages");
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-4 sm:p-8 pt-12 sm:pt-24 pb-32 sm:pb-12">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start gap-8 sm:gap-12">
        <ProfileAside />

        <main className="flex-1 w-full">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 border-b border-gallery-border pb-8">
            <Link href="/admin/messages" className="text-xs uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-text transition-colors flex items-center gap-3 mb-6 font-black group">
              <div className="w-8 h-8 rounded-full bg-white border border-gallery-border flex items-center justify-center group-hover:border-gallery-gold transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span>Messages</span>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extralight text-gallery-text tracking-tighter uppercase leading-tight">Message Detail</h1>
                <p className="text-gallery-muted text-[10px] sm:text-xs mt-3 tracking-[0.4em] uppercase font-black flex items-center gap-2">
                  Reference <span className="text-gallery-gold">#{params.id.toUpperCase().slice(-8)}</span>
                </p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={deleteMessage}
                  className="h-14 w-14 sm:h-16 sm:w-16 border border-gallery-border text-gallery-muted hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center bg-white shadow-sm active:scale-95 group"
                >
                  <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center">
              <div className="w-12 h-12 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : message && (
            <div className="bg-white border border-gallery-border relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gallery-gold/30" />

              <div className="p-6 sm:p-16">
                {/* Expandable Collector Metadata for Mobile */}
                <div className="mb-12 sm:mb-20">
                  <button
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="w-full flex items-center justify-between p-5 bg-gallery-soft/30 border border-gallery-border sm:hidden mb-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-gallery-border flex items-center justify-center">
                        <User size={14} className="text-gallery-gold" />
                      </div>
                      <span className="text-[10px] tracking-[0.3em] uppercase font-black text-gallery-text">Customer Info</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform duration-500 text-gallery-muted ${isInfoExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`grid-cols-1 md:grid-cols-4 gap-10 sm:gap-16 pb-10 sm:pb-16 border-b border-gallery-border/50 transition-all duration-700 ${isInfoExpanded ? 'grid opacity-100' : 'hidden sm:grid opacity-0 sm:opacity-100'}`}>
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted font-black block">Customer</span>
                      <p className="text-lg sm:text-xl font-black text-gallery-text uppercase tracking-tight leading-none">{message.name}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted font-black block">Email Address</span>
                      <p className="text-lg sm:text-xl font-light text-gallery-text tracking-tight break-all flex items-center gap-3">
                        <Mail size={18} className="text-gallery-gold shrink-0" />
                        {message.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted font-black block">Subject</span>
                      <p className="text-lg sm:text-xl font-black text-gallery-gold uppercase tracking-tight">{message.subject}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gallery-muted font-black block">Sent Date</span>
                      <p className="text-sm sm:text-lg font-light text-gallery-text tracking-tight ">
                        {new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Narrative Body */}
                <article className=" mx-auto sm:mx-0">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="h-px bg-gallery-gold/30 flex-1" />
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gallery-gold" />
                      <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-gold font-black whitespace-nowrap">Message</span>
                    </div>
                    <div className="h-px bg-gallery-gold/30 flex-1" />
                  </div>
                  <div className="text-gallery-text font-light text-lg sm:text-2xl leading-relaxed sm:leading-[1.8] whitespace-pre-wrap selection:bg-gallery-gold selection:text-white">
                    {message.message}
                  </div>
                </article>

                {/* Desktop Action Suite */}
                <div className="hidden sm:flex mt-24 pt-12 border-t border-gallery-border gap-6">
                  <button
                    onClick={() => updateStatus('archived')}
                    className="h-16 px-10 bg-gallery-soft text-gallery-text text-[10px] tracking-[0.4em] uppercase font-black hover:bg-gallery-primary hover:text-white transition-all flex items-center gap-4 active:scale-95 shadow-sm"
                  >
                    <Archive size={18} /> Archive
                  </button>
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject} - Bristiii Gallery`}
                    className="h-16 px-10 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-black hover:bg-black transition-all flex items-center gap-4 shadow-2xl active:scale-95"
                  >
                    <Mail size={18} /> Reply via Email
                  </a>
                  <button
                    onClick={() => updateStatus('replied')}
                    className={`h-16 px-10 border text-[10px] tracking-[0.4em] uppercase font-black flex items-center gap-4 active:scale-95 ml-auto transition-all ${message.status === 'replied' ? 'bg-green-50 border-green-200 text-green-600' : 'border-gallery-gold text-gallery-gold hover:bg-gallery-gold hover:text-white'}`}
                  >
                    <Reply size={18} /> {message.status === 'replied' ? 'Resolved' : 'Mark Replied'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tactile Mobile Command Bar (Sticky Bottom) */}
      <AnimatePresence>
        {!loading && message && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-gallery-border p-5 z-50 sm:hidden flex gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <button
              onClick={() => updateStatus('replied')}
              className={`flex-1 h-14 border text-[10px] tracking-[0.3em] uppercase font-black flex items-center justify-center gap-3 active:scale-95 transition-all ${message.status === 'replied' ? 'bg-green-50 border-green-200 text-green-600' : 'border-gallery-gold text-gallery-gold'}`}
            >
              <Reply size={18} /> {message.status === 'replied' ? 'Done' : 'Mark'}
            </button>
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="flex-[2] h-14 bg-gallery-primary text-white text-[10px] tracking-[0.4em] uppercase font-black flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
            >
              <Mail size={18} strokeWidth={2.5} /> Reply
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
