"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Phone, Mail, User, Lock, Globe, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Basic password strength logic
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
    try {
      await register(name, email, password, phone);
      toast.success("Registration successful!", { style: { backgroundColor: "#1a1a1a", color: "#fff" } });
      router.push("/products");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "Too weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Moderate";
    if (strength === 3) return "Strong";
    return "Very Strong";
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

      <div className="w-full max-w-2xl bg-white p-8 border border-gallery-border shadow-2xl relative">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-light text-gallery-text tracking-tight uppercase mb-1">Create <span className="font-serif">Identity</span></h2>
          <p className="text-gallery-muted text-[8px] tracking-[0.3em] uppercase">Join the collective</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
                <User size={10} /> Name
              </label>
              <input
                type="text" required placeholder="Elias Vance"
                className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
                <Phone size={10} /> Phone
              </label>
              <input
                type="tel" required placeholder="+1 234..."
                className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
              <Mail size={10} /> Email
            </label>
            <input
              type="email" required placeholder="elias@gallery.com"
              className="w-full px-3 py-2 bg-gallery-soft/20 border border-gallery-border focus:border-gallery-gold outline-none text-xs font-light"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-gallery-muted flex items-center gap-2">
                <Lock size={10} /> Password
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
                <ShieldCheck size={10} /> Confirm
              </label>
              <input
                type="password" required
                className={`w-full px-3 py-2 bg-gallery-soft/20 border outline-none text-xs font-light ${confirmPassword ? (password === confirmPassword ? 'border-green-200' : 'border-red-200') : 'border-gallery-border'}`}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit" disabled={isLoading}
              className="w-full py-3 bg-gallery-primary text-white text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Inscribe Account"}
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
              Join with Google
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[9px] tracking-widest uppercase text-gallery-muted">
          Already a member?{" "}
          <Link href="/login" className="text-gallery-gold hover:text-gallery-text transition-colors font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
