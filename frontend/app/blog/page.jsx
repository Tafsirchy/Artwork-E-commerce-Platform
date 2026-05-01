"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Silent Evolution of Digital Minimalism",
      excerpt: "How the intersection of code and canvas is redefining the boundaries of contemporary art in the 21st century.",
      author: "Elena Vance",
      date: "May 12, 2024",
      category: "Perspective",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Curation in the Age of Algorithms",
      excerpt: "Exploring the delicate balance between human intuition and machine precision in gallery management.",
      author: "Marcus Thorne",
      date: "April 28, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Echoes of the Renaissance: Modern Shards",
      excerpt: "A deep dive into our latest series 'The Living Canvas' and its connection to classical form.",
      author: "Julian Artwell",
      date: "April 15, 2024",
      category: "Exhibition",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800",
    },
    {
      id: 4,
      title: "The Collector's Soul: A Journey into Acquisition",
      excerpt: "Understanding the emotional resonance that drives the modern art collector in a digital landscape.",
      author: "Sophia Chen",
      date: "March 22, 2024",
      category: "Collection",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Header Section */}
      <section className="py-24 border-b border-gallery-border bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.8em] uppercase text-gallery-gold mb-6 block font-medium">
              The Chronicle
            </span>
            <h1 className="text-5xl md:text-7xl font-extralight text-gallery-text tracking-tighter leading-none mb-8">
              Artistic <br />
              <span className="font-serif text-gallery-accent">Perspectives.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-lg font-light leading-relaxed">
              Stories from the studio, insights from the gallery, and the philosophy behind every curated fragment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-gallery-soft mb-8 border border-gallery-border">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[9px] tracking-[0.2em] uppercase font-bold text-gallery-text border border-gallery-border rounded-none shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">
                      <span className="flex items-center gap-2"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-2"><User size={12} /> {post.author}</span>
                    </div>
                    <h2 className="text-2xl font-light text-gallery-text group-hover:text-gallery-accent transition-colors tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gallery-muted font-light leading-relaxed text-sm max-w-lg">
                      {post.excerpt}
                    </p>
                    <div className="pt-4">
                      <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-bold text-gallery-text border-b border-gallery-gold pb-1 group-hover:gap-6 transition-all">
                        Read Journal <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-24 pt-12 border-t border-gallery-border flex justify-center">
            <button className="px-10 py-4 border border-gallery-border text-[10px] tracking-[0.4em] uppercase text-gallery-muted hover:text-gallery-text hover:border-gallery-text transition-all rounded-none">
              Explore Older Archives
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gallery-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase">
              Subscribe to <span className="font-serif italic text-gallery-gold">The Chronicle.</span>
            </h2>
            <p className="text-white/60 font-light tracking-wide max-w-lg mx-auto">
              Receive curated insights and early access to upcoming series directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-white/5 border border-white/20 px-6 py-4 focus:outline-none focus:border-white/50 text-[10px] tracking-[0.2em] rounded-none"
              />
              <button className="px-10 py-4 bg-white text-gallery-primary text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-gallery-gold hover:text-white transition-all rounded-none">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
      </section>
    </main>
  );
}
