"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ShieldCheck, Check, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    let s = 0;
    if (password.length > 6) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-400";
    if (strength === 3) return "bg-blue-400";
    return "bg-green-500";
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
          <h2 className="text-3xl font-light text-gallery-text tracking-tight uppercase mb-1">New <span className="font-serif text-gallery-gold">Password</span></h2>
          <p className="text-gallery-muted text-[8px] tracking-[0.3em] uppercase">Choose a strong password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
              <Lock size={10} /> New Password
            </label>
            <input
              type="password" required
              className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <div className="pt-1">
                <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
                  <motion.div className={`h-full ${getStrengthColor()}`} initial={{ width: 0 }} animate={{ width: `${(strength / 4) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
              <ShieldCheck size={10} /> Confirm Password
            </label>
            <input
              type="password" required
              className={`w-full px-3 py-2 bg-gallery-soft/20 border outline-none text-xs font-light ${confirmPassword ? (password === confirmPassword ? 'border-green-200' : 'border-red-200') : 'border-gallery-border'}`}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full py-3 bg-gallery-primary text-white text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
