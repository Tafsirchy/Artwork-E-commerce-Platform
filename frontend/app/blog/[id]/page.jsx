"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import Image from "next/image";
import BlogDetailsSkeleton from "@/components/ui/BlogDetailsSkeleton";

export default function BlogDetailsPage() {
  const { id } = useParams();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data && res.data.success) {
          setPost(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return <BlogDetailsSkeleton />;
  }

  if (!post) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-gallery-muted tracking-widest uppercase">Journal entry not found.</p>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pb-20 sm:pb-32">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-24 sm:pt-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-black text-gallery-muted hover:text-gallery-text transition-all group active:-translate-x-2"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Journal
        </Link>
      </div>

      {/* Hero Header */}
      <section className="pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto"
          >
            <span className="text-[10px] tracking-[0.3em] sm:tracking-[0.5em] uppercase text-gallery-gold mb-6 sm:mb-8 block font-black">
              {post.category} — {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="text-4xl sm:text-7xl font-extralight text-gallery-text tracking-tighter leading-[1.1] sm:leading-none mb-8 sm:mb-10">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl font-light text-gallery-muted leading-relaxed mb-10 sm:mb-12 italic border-l-2 border-gallery-gold/20 pl-6 sm:pl-8">
              {post.subtitle}
            </p>

            <div className="flex items-center gap-4 sm:gap-6 border-y border-gallery-border py-6 sm:py-8">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gallery-soft rounded-none flex items-center justify-center border border-gallery-border overflow-hidden">
                <Image 
                  src={`https://ui-avatars.com/api/?name=${post.author}&background=f8f8f8&color=1a1a1a`} 
                  alt={post.author} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-black text-gallery-text">{post.author}</p>
                <p className="text-[10px] tracking-[0.1em] uppercase text-gallery-muted">{post.role}</p>
              </div>
              <div className="ml-auto flex gap-4">
                <button className="p-3 border border-gallery-border hover:border-gallery-gold transition-colors active:scale-95">
                  <Share2 size={16} className="text-gallery-muted" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image(s) */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 mb-16 sm:mb-24"
      >
        <div className="max-w-5xl mx-auto">
          {post.image2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 border border-gallery-border transition-all duration-700 group shadow-sm">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 border border-gallery-border transition-all duration-700 group mt-10 md:mt-24 shadow-sm">
                <Image 
                  src={post.image2} 
                  alt={post.title} 
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden grayscale hover:grayscale-0 border border-gallery-border transition-all duration-700 group shadow-sm">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
          )}
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="container mx-auto px-6">
        <div className="mx-auto space-y-8 sm:space-y-12">
          {post.content.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-base sm:text-lg font-light text-gallery-text leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="py-8 sm:py-12 px-8 sm:px-12 bg-gallery-soft/30 border-l-4 border-gallery-gold">
                  <p className="text-xl sm:text-2xl font-serif italic text-gallery-text leading-snug">
                    "{block.text}"
                  </p>
                </blockquote>
              );
            }
            if (block.type === "heading") {
              return (
                <h2 key={i} className="text-2xl sm:text-3xl font-light tracking-tight text-gallery-text pt-6 sm:pt-8 uppercase leading-tight">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "image") {
              return (
                <div key={i} className="space-y-4 py-6 sm:py-8 max-w-xl mx-auto">
                  <div className="relative aspect-[16/9] overflow-hidden border border-gallery-border grayscale hover:grayscale-0 transition-all duration-700 shadow-sm">
                    <Image src={block.url} alt={block.caption} fill className="object-cover" sizes="(max-width: 640px) 100vw, 600px" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-gallery-muted text-center italic">
                    {block.caption}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </section>

      {/* Footer / Comments Area Placeholder */}
      <section className="container mx-auto px-6 mt-20 sm:mt-32 pt-16 sm:pt-24 border-t border-gallery-border">
        <div className="max-w-3xl mx-auto text-center">
          <MessageCircle size={32} className="mx-auto text-gallery-gold mb-6 animate-pulse" />
          <h3 className="text-lg sm:text-xl font-light text-gallery-text uppercase tracking-widest mb-4">Engage with the Narrative</h3>
          <p className="text-gallery-muted font-light text-sm mb-10 sm:mb-12 leading-relaxed">
            What are your thoughts on the evolution of digital minimalism? Join the conversation in our members-only salon.
          </p>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-block px-12 py-5 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-black hover:bg-gallery-gold transition-all rounded-none active:scale-95 shadow-2xl"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  );
}
