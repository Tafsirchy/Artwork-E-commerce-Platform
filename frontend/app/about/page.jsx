"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Original Artworks", value: "2,500+" },
    { label: "Global Artists", value: "180+" },
    { label: "Collectors", value: "12,000+" },
    { label: "Exhibitions", value: "45" },
  ];

  const features = [
    {
      icon: <Sparkles className="text-gallery-gold" size={24} />,
      title: "Curated Excellence",
      description: "Every piece in our gallery is hand-selected by experts to ensure the highest standards of artistic integrity.",
    },
    {
      icon: <Shield className="text-gallery-gold" size={24} />,
      title: "Secure Ownership",
      description: "We provide blockchain-backed certificates of authenticity for every original acquisition.",
    },
    {
      icon: <Heart className="text-gallery-gold" size={24} />,
      title: "Artist First",
      description: "Our platform ensures fair compensation and global exposure for emerging and established creators.",
    },
  ];

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden border-b border-gallery-border py-20 sm:py-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gallery-gold/5 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gallery-accent/5 rounded-full blur-[80px] sm:blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[9px] sm:text-[10px] tracking-[0.6em] sm:tracking-[0.8em] uppercase text-gallery-gold mb-4 sm:mb-6 block font-medium">
              EST. 2024
            </span>
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extralight text-gallery-text tracking-tighter leading-[1.1] sm:leading-none mb-6 sm:mb-8">
              The Architecture <br />
              <span className="font-serif text-gallery-accent">of Soul.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-base sm:text-lg font-light leading-relaxed">
              BRISTIII is a digital sanctuary where the boundaries between creator and collector dissolve into a shared aesthetic journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] bg-gallery-soft overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop"
                alt="Artist Studio"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border-[10px] sm:border-[20px] border-white/10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light text-gallery-text tracking-tight mb-6 sm:mb-8 uppercase leading-tight">
                Crafting a <span className="font-serif text-gallery-gold">New Legacy</span> <br className="hidden sm:block" />
                for Digital Artisans.
              </h2>
              <div className="space-y-4 sm:space-y-6 text-gallery-muted font-light leading-relaxed text-base">
                <p>
                  Founded on the belief that art is a fundamental human connection, BRISTIII bridges the gap between traditional craftsmanship and digital innovation. We curate experiences that challenge the status quo.
                </p>
                <p>
                  Every artwork on our platform is a testament to the artist's journey—a fragment of a vision meticulously captured and preserved.
                </p>
              </div>

              <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-6 sm:gap-8 border-t border-gallery-border pt-10 sm:pt-12">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-light text-gallery-text mb-1">{stat.value}</div>
                    <div className="text-[9px] tracking-[0.2em] uppercase text-gallery-muted font-black">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy / Features */}
      <section className="py-16 sm:py-32 bg-gallery-soft/30 border-y border-gallery-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-[10px] tracking-[0.4em] sm:tracking-[0.6em] uppercase text-gallery-gold font-black mb-3 sm:mb-4">Our Philosophy</h2>
            <p className="text-2xl sm:text-3xl font-light text-gallery-text uppercase tracking-widest leading-tight">Principles of the Gallery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 sm:p-10 bg-white border border-gallery-border hover:shadow-xl transition-all duration-500 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-base sm:text-lg tracking-widest uppercase text-gallery-text mb-4 font-black">{feature.title}</h3>
                <p className="text-gallery-muted font-light leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 sm:py-32 bg-gallery-primary text-white text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-5xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-10 sm:mb-12">
              Ready to <span className="font-serif italic text-gallery-gold">Explore?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <Link
                href="/products"
                className="group relative w-full sm:w-auto px-12 py-5 bg-white text-gallery-primary text-[10px] tracking-[0.5em] uppercase font-black overflow-hidden transition-all rounded-none active:scale-95 shadow-2xl"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">View Collection</span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              <Link
                href="/register"
                className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-black border-b border-white/30 hover:border-gallery-gold transition-colors pb-1"
              >
                Become a Member
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
