"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import Image from "next/image";

export default function BlogPage() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        if (res.data && res.data.success) {
          setPosts(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <main className="bg-gallery-bg min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gallery-gold border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Header Section */}
      <section className="py-16 sm:py-24 border-b border-gallery-border bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.4em] sm:tracking-[0.8em] uppercase text-gallery-gold mb-4 sm:mb-6 block font-black">
              The Chronicle
            </span>
            <h1 className="text-4xl sm:text-7xl font-extralight text-gallery-text tracking-tighter leading-[1.1] sm:leading-none mb-6 sm:mb-8">
              Artistic <br />
              <span className="font-serif text-gallery-accent">Perspectives.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-base sm:text-lg font-light leading-relaxed">
              Stories from the studio, insights from the gallery, and the philosophy behind every curated fragment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post._id}`}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-gallery-soft mb-6 sm:mb-8 border border-gallery-border shadow-sm">
                    <Image
                      src={post.image || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop"}
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                      <span className="px-3 py-1.5 sm:px-4 bg-white/90 backdrop-blur-md text-[8px] sm:text-[10px] tracking-[0.2em] uppercase font-black text-gallery-text border border-gallery-border shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">
                      <span className="flex items-center gap-2">
                        <Calendar size={12} className="text-gallery-gold" /> {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-2">
                        <User size={12} className="text-gallery-gold" /> {post.author}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-light text-gallery-text group-hover:text-gallery-accent transition-colors tracking-tight leading-tight sm:leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gallery-muted font-light leading-relaxed text-sm max-w-lg">
                      {post.excerpt}
                    </p>
                    <div className="pt-2 sm:pt-4">
                      <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-black text-gallery-text border-b border-gallery-gold pb-1 group-hover:gap-6 transition-all active:translate-x-2">
                        Read Journal <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-gallery-border flex justify-center">
            <button className="w-full sm:w-auto px-10 py-5 border border-gallery-border text-[10px] tracking-[0.4em] uppercase text-gallery-muted hover:text-gallery-text hover:border-gallery-text transition-all rounded-none font-black active:scale-95 shadow-sm">
              Explore Older Archives
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 sm:py-32 bg-gallery-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10 sm:space-y-12">
            <h2 className="text-2xl sm:text-4xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-tight">
              Subscribe to <span className="font-serif italic text-gallery-gold">The Chronicle.</span>
            </h2>
            <p className="text-white/60 font-light tracking-wide max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Receive curated insights and early access to upcoming series directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 bg-white/5 border border-white/20 px-6 py-4 focus:outline-none focus:border-white/50 text-[10px] tracking-[0.2em] rounded-none h-14"
              />
              <button className="h-14 px-10 bg-white text-gallery-primary text-[10px] tracking-[0.3em] font-black uppercase hover:bg-gallery-gold hover:text-white transition-all rounded-none active:scale-95 shadow-2xl">
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
