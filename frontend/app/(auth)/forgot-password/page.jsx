"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Recovery link dispatched", {
        style: { backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px", fontWeight: "bold" }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Recovery request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gallery-bg p-6 sm:p-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gallery-gold/30" />

      <Link
        href="/login"
        className="fixed top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-text transition-all z-50 group font-black"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-gallery-border flex items-center justify-center group-hover:border-gallery-gold transition-colors shadow-sm">
          <ArrowLeft size={16} />
        </div>
        <span className="hidden sm:inline">Back to Login</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-8 sm:p-12 border border-gallery-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative"
      >
        {!submitted ? (
          <>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-3 font-black">Identity Recovery</p>
              <h2 className="text-3xl sm:text-4xl font-extralight text-gallery-text tracking-tighter uppercase mb-2">
                Lost <span className="font-serif text-gallery-gold">Identity</span>
              </h2>
              <p className="text-gallery-muted text-xs tracking-widest uppercase font-bold">Enter your registered email to recover access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                  <Mail size={14} className="text-gallery-gold" /> Email Address
                </label>
                <input
                  type="email" required placeholder="collector@bristiii.com"
                  className="w-full h-14 px-5 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full h-16 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
              >
                {isLoading ? "Dispatching..." : <><Send size={18} /> Dispatch Recovery Link</>}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-gallery-soft/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-gallery-gold/20"
            >
              <Send className="text-gallery-gold" size={32} />
            </motion.div>
            <h2 className="text-2xl font-light text-gallery-text tracking-widest uppercase mb-4">Dispatched</h2>
            <p className="text-sm text-gallery-muted leading-relaxed mb-8 font-light italic">
              A recovery transmission has been sent to <span className="text-gallery-text font-black not-italic">{email}</span>. Please verify your inbox to proceed.
            </p>
            <Link href="/login" className="inline-block h-14 px-10 border border-gallery-border text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-3 hover:bg-gallery-soft/30 transition-all active:scale-95 mx-auto">
              Return to Authentication
            </Link>
          </div>
        )}

        {!submitted && (
          <div className="mt-12 pt-6 border-t border-gallery-border text-center">
            <Link href="/login" className="text-xs tracking-[0.2em] uppercase text-gallery-muted hover:text-gallery-gold transition-colors flex items-center justify-center gap-3 font-black">
              <ArrowLeft size={14} /> Remembered? Authenticate
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
