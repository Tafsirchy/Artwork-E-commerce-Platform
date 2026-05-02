"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Phone, Mail, User, Lock, Globe, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, googleLogin, isLoading } = useAuthStore();
  const router = useRouter();

  const handleGoogleSuccess = async (tokenId) => {
    try {
      await googleLogin(tokenId);
      toast.success("Account created with Google!", {
        style: { backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px", fontWeight: "bold" }
      });
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Google registration failed");
    }
  };

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
    try {
      await register(name, email, password, phone);
      toast.success("Account created successfully!", {
        style: { backgroundColor: "#1a1a1a", color: "#fff", fontSize: "14px", fontWeight: "bold" }
      });
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gallery-soft";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-amber-400";
    if (strength === 3) return "bg-blue-400";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gallery-bg p-6 sm:p-8 overflow-x-hidden relative">
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[600px] bg-white p-8 sm:p-14 lg:p-8 border border-gallery-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative my-12 lg:my-4"
      >
        <div className="text-center mb-10 sm:mb-12 lg:mb-4">
          <p className="text-gallery-gold text-[10px] tracking-[0.5em] uppercase mb-3 font-black">Create Account</p>
          <h2 className="text-3xl sm:text-4xl lg:text-2xl font-extralight text-gallery-text tracking-tighter uppercase mb-2">
            Sign <span className="font-serif text-gallery-gold">Up</span>
          </h2>
          <p className="text-gallery-muted text-xs tracking-widest uppercase font-bold">Create Your Account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-2">
          <div className="space-y-2 lg:space-y-1">
            <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
              <User size={14} className="text-gallery-gold" /> Personal Name
            </label>
            <input
              type="text" required placeholder="Elias Vance"
              className="w-full h-14 lg:h-12 px-5 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-3">
            <div className="space-y-2 lg:space-y-1">
              <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                <Phone size={14} className="text-gallery-gold" /> Contact Number
              </label>
              <input
                type="tel" required placeholder="+1 234..."
                className="w-full h-14 lg:h-12 px-5 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all"
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2 lg:space-y-1">
              <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                <Mail size={14} className="text-gallery-gold" /> Email Address
              </label>
              <input
                type="email" required placeholder="elias@gallery.com"
                className="w-full h-14 lg:h-12 px-5 bg-gallery-soft/10 border border-gallery-border focus:border-gallery-gold outline-none text-base font-light transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-3">
            <div className="space-y-2 lg:space-y-1">
              <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                <Lock size={14} className="text-gallery-gold" /> Password
              </label>
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
              {password && (
                <div className="pt-1">
                  <div className="h-1 w-full bg-gallery-soft overflow-hidden">
                    <motion.div className={`h-full ${getStrengthColor()}`} initial={{ width: 0 }} animate={{ width: `${(strength / 4) * 100}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 lg:space-y-1">
              <label className="text-xs uppercase tracking-widest font-black text-gallery-muted flex items-center gap-3">
                <ShieldCheck size={14} className="text-gallery-gold" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"} required
                  className={`w-full h-14 lg:h-12 px-5 pr-14 bg-gallery-soft/10 border outline-none text-base font-light transition-all ${confirmPassword ? (password === confirmPassword ? 'border-green-200 focus:border-green-400' : 'border-red-200 focus:border-red-400') : 'border-gallery-border focus:border-gallery-gold'}`}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-14 lg:h-12 w-14 flex items-center justify-center text-gallery-muted hover:text-gallery-gold transition-colors"
                  aria-label={showConfirmPassword ? "Hide confirmation" : "Show confirmation"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 lg:pt-3 space-y-4 lg:space-y-2">
            <button
              type="submit" disabled={isLoading}
              className="w-full h-16 lg:h-14 bg-gallery-primary text-white text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <div className="relative py-4 lg:py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gallery-border"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black"><span className="bg-white px-6 text-gallery-muted">Or continue with</span></div>
            </div>

            <div className="flex justify-center relative min-h-[40px]">
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] flex items-center justify-center pointer-events-none transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] uppercase tracking-widest font-black text-gallery-gold">Creating account...</span>
                  </div>
                </div>
              )}
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSuccess(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Google Authentication Failed");
                }}
                useOneTap
                theme="outline"
                shape="square"
                width="350"
              />
            </div>
          </div>
        </form>

        <p className="mt-12 lg:mt-4 text-center text-xs tracking-widest uppercase text-gallery-muted font-bold">
          Already have an account?{" "}
          <Link href="/login" className="text-gallery-gold hover:text-gallery-text transition-colors font-black border-b border-gallery-gold pb-0.5">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
