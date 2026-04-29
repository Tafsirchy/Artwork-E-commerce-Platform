"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thank you for joining our private circle.");
    setEmail("");
  };

  return (
    <section className="py-32 bg-gallery-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gallery-accent text-sm tracking-[0.4em] uppercase mb-4">
                📩 Stay Connected
              </p>
              <h2 className="text-4xl font-light text-gallery-text mb-6">Join Our Private Circle</h2>
              <p className="text-gallery-muted leading-relaxed max-w-md">
                Receive exclusive invites to new collection launches, artist interviews, and private viewing events. No spam, just pure inspiration.
              </p>
            </motion.div>
          </div>

          <div>
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 bg-gallery-soft border border-gallery-border focus:outline-none focus:border-gallery-gold transition-colors text-gallery-text tracking-widest"
              />
              <button
                type="submit"
                className="px-10 py-4 bg-gallery-primary text-white text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-black transition-colors"
              >
                Join <Send size={14} />
              </button>
            </motion.form>
            <p className="mt-4 text-[10px] text-gallery-muted uppercase tracking-[0.2em]">
              By joining, you agree to our Privacy Policy.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
