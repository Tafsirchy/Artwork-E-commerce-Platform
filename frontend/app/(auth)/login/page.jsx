"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Identity verified", {
        style: { backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px", fontWeight: "bold" }
      });
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gallery-bg p-6 sm:p-8 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gallery-gold/30" />

      <Link
        href="/"
        className="fixed top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gallery-muted hover:text-gallery-text transition-all z-50 group font-black"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-gallery-border flex items-center justify-center group-hover:border-gallery-gold transition-colors shadow-sm">
          <ArrowLeft size={16} />
        </div>
        <span className="hidden sm:inline">Back to Gallery</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-8 sm:p-12 lg:p-8 border border-gallery-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative"
      >
        <div className="text-center mb-10 sm:mb-12 lg:mb-4">
          <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-3 font-black">Authorized Access</p>
          <h2 className="text-3xl sm:text-4xl lg:text-2xl font-extralight text-gallery-text tracking-tighter uppercase mb-2">
            Welcome <span className="font-serif text-gallery-gold">Back</span>
          </h2>
          <p className="text-gallery-muted text-xs tracking-widest uppercase font-bold">Sign in to your curator collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-2">
          <div className="space-y-2 lg:space-y-1">
            <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
              <Mail size={14} className="text-gallery-gold" /> Email Address
            </label>
            <input
              type="email" required placeholder="collector@bristiii.com"
              className="w-full h-14 lg:h-12 px-5 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all placeholder:text-gallery-muted/30"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2 lg:space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                <Lock size={14} className="text-gallery-gold" /> Password
              </label>
              <Link href="/forgot-password" title="Recover Identity" className="text-[10px] uppercase tracking-widest text-gallery-gold hover:text-gallery-text transition-colors font-black">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} required
                className="w-full h-14 lg:h-12 px-5 pr-14 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-14 lg:h-12 w-14 flex items-center justify-center text-gallery-muted hover:text-gallery-gold transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2 lg:pt-1 space-y-4 lg:space-y-2">
            <button
              type="submit" disabled={isLoading}
              className="w-full h-16 lg:h-14 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {isLoading ? "Verifying..." : <><LogIn size={18} /> Access Gallery</>}
            </button>

            <div className="relative py-2 lg:py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gallery-border"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black"><span className="bg-white px-6 text-gallery-muted">Social Integration</span></div>
            </div>

            <button
              type="button"
              className="w-full h-14 lg:h-12 bg-white border border-gallery-border flex items-center justify-center gap-4 text-xs uppercase tracking-widest font-black hover:bg-gallery-soft/30 transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
              Sign in with Google
            </button>
          </div>
        </form>

        <p className="mt-12 lg:mt-4 text-center text-xs tracking-widest uppercase text-gallery-muted font-bold">
          New to the gallery?{" "}
          <Link href="/register" className="text-gallery-gold hover:text-gallery-text transition-colors font-black border-b border-gallery-gold pb-0.5">
            Create Identity
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
