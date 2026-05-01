"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Identity verified", { style: { backgroundColor: "#1a1a1a", color: "#fff" } });
      router.push("/products");
    } catch (error) {
      toast.error(error.message || "Verification failed");
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-gallery-text tracking-tight uppercase mb-1">Welcome <span className="font-serif">Back</span></h2>
          <p className="text-gallery-muted text-[8px] tracking-[0.3em] uppercase">Sign in to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
              <Mail size={10} /> Email
            </label>
            <input
              type="email" required placeholder="collector@bristiii.com"
              className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
                <Lock size={10} /> Password
              </label>
              <Link href="/forgot-password" size={10} className="text-[7px] uppercase tracking-widest text-gallery-gold hover:text-gallery-text transition-colors">
                Forgot?
              </Link>
            </div>
            <input
              type="password" required
              className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 bg-gallery-primary text-white text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Verifying..." : <><LogIn size={14} /> Access Gallery</>}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gallery-border"></div></div>
              <div className="relative flex justify-center text-[7px] uppercase tracking-[0.3em]"><span className="bg-white px-3 text-gallery-muted">Or</span></div>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-white border border-gallery-border flex items-center justify-center gap-3 text-[9px] uppercase tracking-widest font-bold hover:bg-gallery-soft transition-all"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-3 h-3" alt="Google" />
              Sign in with Google
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-[9px] tracking-widest uppercase text-gallery-muted">
          New to the gallery?{" "}
          <Link href="/register" className="text-gallery-gold hover:text-gallery-text transition-colors font-bold">
            Create Identity
          </Link>
        </p>
      </div>
    </div>
  );
}
