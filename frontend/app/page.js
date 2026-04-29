"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gallery-bg">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Subtle radial gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(201,169,106,0.12) 0%, transparent 65%), radial-gradient(ellipse at 30% 70%, rgba(217,119,87,0.08) 0%, transparent 55%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm tracking-[0.35em] uppercase text-gallery-muted mb-6"
          >
            Modern Art Gallery
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-6xl md:text-8xl font-light text-gallery-text leading-none mb-8"
          >
            Where Art Finds
            <span className="block italic text-gallery-accent">Its Home</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gallery-muted max-w-xl mx-auto mb-12 leading-relaxed"
          >
            A curated collection of original artworks from emerging and established artists worldwide. Discover pieces that speak to you.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="flex items-center gap-2 px-10 py-4 bg-gallery-primary text-white text-sm tracking-widest uppercase rounded hover:bg-black transition-colors group"
            >
              Explore Gallery
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="px-10 py-4 border border-gallery-border text-gallery-text text-sm tracking-widest uppercase rounded hover:border-gallery-primary transition-colors"
            >
              Join Bristiii
            </Link>
          </motion.div>
        </div>

        {/* Decorative gold line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gallery-gold origin-center"
        />
      </section>

      {/* Features Strip */}
      <section className="border-y border-gallery-border bg-gallery-surface py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Original Artworks", desc: "Every piece is a one-of-a-kind original, directly from the artist." },
            { title: "Secure Checkout", desc: "Powered by Stripe. Your payment and data are always protected." },
            { title: "Worldwide Delivery", desc: "We ship carefully packaged artwork to galleries and homes globally." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-8 h-[2px] bg-gallery-gold mx-auto mb-4" />
              <h3 className="text-gallery-text font-light text-lg mb-2">{item.title}</h3>
              <p className="text-gallery-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-light text-gallery-text mb-6">
            Start Your Collection Today
          </h2>
          <p className="text-gallery-muted mb-10">
            Browse hundreds of curated artworks and find the perfect piece for your space.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gallery-accent text-white text-sm tracking-widest uppercase rounded hover:opacity-90 transition-opacity group"
          >
            View All Works
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
