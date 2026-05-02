"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

export default function BlogListClient({ initialPosts }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts || []);
  const [loading, setLoading] = useState(false);

  // 🔄 Client-side Fallback: If server failed to fetch (or returned empty), try once on mount
  useEffect(() => {
    if (posts.length === 0) {
      const fetchBlogs = async () => {
        setLoading(true);
        try {
          const res = await api.get("/blogs");
          if (res.data && res.data.success) {
            setPosts(res.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch blogs on client:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBlogs();
    }
  }, [posts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <section className="py-16 sm:py-24 border-b border-gallery-border bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.4em] sm:tracking-[0.8em] uppercase text-gallery-gold mb-4 sm:mb-6 block font-black">
              Our Blog
            </span>
            <h1 className="text-4xl sm:text-7xl font-extralight text-gallery-text tracking-tighter leading-[1.1] sm:leading-none mb-6 sm:mb-8">
              Art <br />
              <span className="font-serif text-gallery-accent">Stories.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-base sm:text-lg font-light leading-relaxed">
              Read stories from our artists and news about our latest art collections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-32 min-h-[400px]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-gallery-gold" size={40} />
              <p className="text-gallery-muted text-xs tracking-widest uppercase">Fetching stories...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => router.prefetch(`/blog/${post._id}`)}
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
                          Read Story <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gallery-border">
              <p className="text-gallery-muted font-light">No art stories found in the collection.</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-gallery-border flex justify-center">
              <button className="w-full sm:w-auto px-10 py-5 border border-gallery-border text-[10px] tracking-[0.4em] uppercase text-gallery-muted hover:text-gallery-text hover:border-gallery-text transition-all rounded-none font-black active:scale-95 shadow-sm">
                See Older Posts
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 sm:py-32 bg-gallery-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-gold mb-8 block font-black">
            Our Newsletter
          </span>
          <h2 className="text-3xl sm:text-5xl font-extralight mb-12 tracking-tight max-w-2xl mx-auto leading-tight">
            Get updates about our art delivered to your email.
          </h2>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-gallery-gold transition-all"
            />
            <button className="px-10 py-4 bg-gallery-gold text-gallery-primary text-[10px] tracking-[0.3em] uppercase font-black hover:bg-white transition-all">
              Subscribe
            </button>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-white/5 pointer-events-none  select-none">
          Arts
        </div>
      </section>
    </motion.div>
  );
}
