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
      toast.success("Recovery link dispatched");
    } catch (error) {
      toast.error(error.response?.data?.message || "Recovery request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gallery-bg p-4 overflow-hidden">
      <Link
        href="/"
        className="fixed top-8 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-gold transition-all z-50 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Gallery
      </Link>

      <div className="w-full max-w-sm bg-white p-8 border border-gallery-border shadow-2xl relative">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gallery-text tracking-tight uppercase mb-1">Lost <span className="font-serif">Identity</span></h2>
              <p className="text-gallery-muted text-[8px] tracking-[0.3em] uppercase">Enter your email to recover access</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
                  <Mail size={10} /> Email Address
                </label>
                <input
                  type="email" required placeholder="collector@bristiii.com"
                  className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full py-3 bg-gallery-primary text-white text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Sending..." : <><Send size={14} /> Send Link</>}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-gallery-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-gallery-gold" size={20} />
            </div>
            <h2 className="text-xl font-light text-gallery-text tracking-widest uppercase mb-2">Dispatched</h2>
            <p className="text-[10px] text-gallery-muted leading-relaxed mb-4">
              Check your inbox for {email} to proceed.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gallery-border text-center">
          <Link href="/login" className="text-[9px] tracking-[0.2em] uppercase text-gallery-muted hover:text-gallery-gold transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={10} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
