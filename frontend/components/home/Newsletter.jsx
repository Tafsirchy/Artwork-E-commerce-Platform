"use client";

import { motion } from "framer-motion";
import { Send, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Welcome to our Newsletter.", {
      position: "top-center",
      autoClose: 3000,
      theme: "dark"
    });
    setEmail("");
  };

  return (
    <section className="py-20 sm:py-28 bg-gallery-bg relative overflow-hidden group">
      {/* 🎭 Premium Atmospheric Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Infinite Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gallery-gold/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gallery-accent/5 rounded-full"
        />

        {/* Soft Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gallery-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gallery-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center mb-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-gallery-gold flex flex-col items-center gap-4"
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gallery-gold to-transparent" />
              <Star size={32} strokeWidth={1} fill="currentColor" fillOpacity={0.1} />
            </motion.div>
          </div>

          <p className="text-gallery-accent text-[10px] sm:text-xs tracking-[0.5em] sm:tracking-[0.8em] uppercase mb-8 sm:mb-12">
            📩 Join Our Mailing List
          </p>

          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-light text-gallery-text tracking-[0.1em] sm:tracking-widest uppercase mb-6 sm:mb-8 leading-none">
            Join Our <br />
            <span className="font-serif text-gallery-gold font-light lowercase sm:uppercase">
              Newsletter
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="text-gallery-muted text-sm sm:text-lg max-w-xl mx-auto mb-16 leading-relaxed font-light "
          >
            Join our community. Get early access to new art, expert tips, and private viewings.
          </motion.p>

          <form
            onSubmit={handleSubscribe}
            className="max-w-2xl mx-auto relative group px-2 sm:px-0"
          >
            {/* Input Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gallery-gold/0 via-gallery-gold/20 to-gallery-gold/0 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-700" />

            <div className="relative flex flex-col sm:flex-row shadow-2xl">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-8 sm:px-10 py-6 bg-white/80 backdrop-blur-md border border-gallery-border focus:outline-none focus:border-gallery-gold transition-all text-gallery-text tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm uppercase placeholder:text-gallery-muted/40 rounded-none"
              />
              <button
                type="submit"
                className="px-10 sm:px-12 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase flex items-center justify-center gap-4 hover:bg-black transition-all group/btn active:scale-[0.98]"
              >
                Subscribe <Send size={14} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-1 transition-transform duration-500" />
              </button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-px bg-gallery-gold/20" />
            <p className="text-[9px] text-gallery-muted uppercase tracking-[0.4em] font-medium">
              By joining, you will receive updates about our new art collections.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
