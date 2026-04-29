"use client";

import { motion } from "framer-motion";
import { Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Welcome to our private circle.");
    setEmail("");
  };

  return (
    <section className="py-40 bg-gallery-bg relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gallery-gold/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gallery-accent/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-gallery-gold"
            >
              <Star size={40} strokeWidth={1} />
            </motion.div>
          </div>

          <p className="text-gallery-accent text-sm tracking-[0.6em] uppercase mb-8">
            📩 Invitation to the Infinite
          </p>
          <h2 className="text-5xl md:text-7xl font-light text-gallery-text mb-12 leading-none">
            Join Our <span className="italic">Private Circle</span>
          </h2>
          <p className="text-gallery-muted text-lg max-w-xl mx-auto mb-16 leading-relaxed font-light">
            Become part of a global collective. Receive exclusive early access to new collections and private gallery viewings.
          </p>

          <form 
            onSubmit={handleSubscribe}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gallery-gold/0 via-gallery-gold/30 to-gallery-gold/0 opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
            <div className="relative flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                required
                placeholder="Enter your email for inspiration"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-10 py-6 bg-white border border-gallery-border focus:outline-none focus:border-gallery-gold transition-all text-gallery-text tracking-[0.2em] text-sm uppercase placeholder:text-gallery-muted/50"
              />
              <button
                type="submit"
                className="px-12 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase flex items-center justify-center gap-4 hover:bg-gallery-gold transition-colors group/btn"
              >
                Connect <Send size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-10 text-[9px] text-gallery-muted uppercase tracking-[0.3em]"
          >
            By subscribing, you enter a commitment to artistic discovery.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
