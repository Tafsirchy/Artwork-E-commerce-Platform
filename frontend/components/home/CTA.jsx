"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-40 bg-gallery-primary relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        background: "radial-gradient(circle at 50% 50%, #C8A96A 0%, transparent 70%)"
      }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gallery-gold text-sm tracking-[0.5em] uppercase mb-8">
            📦 Start Your Journey
          </p>
          <h2 className="text-5xl md:text-7xl font-light text-white mb-10 leading-none">
            Find the Piece That <br />
            <span className="italic">Speaks to Your Soul</span>
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
            Our curators are adding new masterpieces every week. Don't miss out on the perfect addition to your home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="px-12 py-4 bg-white text-gallery-primary text-sm tracking-widest uppercase rounded hover:bg-gallery-gold transition-all group"
            >
              Start Collecting
            </Link>
            <Link
              href="/register"
              className="px-12 py-4 border border-white/30 text-white text-sm tracking-widest uppercase rounded hover:bg-white/10 transition-all"
            >
              Join the Gallery
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
