"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogDetailsPage() {
  const { id } = useParams();

  // Mock data - In a real app, this would be fetched based on 'id'
  const post = {
    id: id,
    title: "The Silent Evolution of Digital Minimalism",
    subtitle: "Exploring the intersection of code and canvas in the 21st century.",
    author: "Elena Vance",
    role: "Senior Curator",
    date: "May 12, 2024",
    category: "Perspective",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1600&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "In the rapidly shifting landscape of contemporary art, a new movement has begun to emerge—one that doesn't just embrace technology, but breathes it. Digital minimalism is no longer just a design choice; it is a philosophy of reduction that seeks to find the soul within the machine."
      },
      {
        type: "quote",
        text: "Art is not what you see, but what you make others see through the absence of noise."
      },
      {
        type: "heading",
        text: "The Architecture of Silence"
      },
      {
        type: "paragraph",
        text: "When we strip away the superfluous, we are left with the essence. In our latest series, we've observed how artists are using negative space not as an empty void, but as a deliberate medium. This architectural approach to digital canvas allows for a deeper connection between the viewer and the intent of the creator."
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200&auto=format&fit=crop",
        caption: "Geometric Harmony: A study in balance."
      },
      {
        type: "paragraph",
        text: "As we look toward the future, the boundaries between the physical and the virtual continue to blur. BRISTIII remains at the forefront of this evolution, curating fragments of visions that challenge our perception of what 'original' means in an age of infinite reproduction."
      }
    ]
  };

  return (
    <main className="bg-white min-h-screen pb-32">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase font-bold text-gallery-muted hover:text-gallery-text transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Back to Journal
        </Link>
      </div>

      {/* Hero Header */}
      <section className="pt-16 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-gold mb-8 block font-bold">
              {post.category} — {post.date}
            </span>
            <h1 className="text-5xl md:text-7xl font-extralight text-gallery-text tracking-tighter leading-none mb-10">
              {post.title}
            </h1>
            <p className="text-xl font-light text-gallery-muted leading-relaxed mb-12 italic border-l-2 border-gallery-gold/20 pl-8">
              {post.subtitle}
            </p>

            <div className="flex items-center gap-6 border-y border-gallery-border py-8">
              <div className="w-12 h-12 bg-gallery-soft rounded-none flex items-center justify-center border border-gallery-border overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${post.author}&background=f8f8f8&color=1a1a1a`} alt={post.author} />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gallery-text">{post.author}</p>
                <p className="text-[10px] tracking-[0.1em] uppercase text-gallery-muted">{post.role}</p>
              </div>
              <div className="ml-auto flex gap-4">
                <button className="p-3 border border-gallery-border hover:border-gallery-gold transition-colors">
                  <Share2 size={16} className="text-gallery-muted" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-6 mb-24"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video overflow-hidden grayscale border border-gallery-border">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {post.content.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-lg font-light text-gallery-text leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="py-12 px-12 bg-gallery-soft/30 border-l-4 border-gallery-gold">
                  <p className="text-2xl font-serif italic text-gallery-text leading-snug">
                    "{block.text}"
                  </p>
                </blockquote>
              );
            }
            if (block.type === "heading") {
              return (
                <h2 key={i} className="text-3xl font-light tracking-tight text-gallery-text pt-8 uppercase">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "image") {
              return (
                <div key={i} className="space-y-4 py-8">
                  <div className="aspect-[16/9] overflow-hidden border border-gallery-border grayscale hover:grayscale-0 transition-all duration-700">
                    <img src={block.url} alt={block.caption} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted text-center italic">
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
      <section className="container mx-auto px-6 mt-32 pt-24 border-t border-gallery-border">
        <div className="max-w-3xl mx-auto text-center">
          <MessageCircle size={32} className="mx-auto text-gallery-gold mb-6" />
          <h3 className="text-xl font-light text-gallery-text uppercase tracking-widest mb-4">Engage with the Narrative</h3>
          <p className="text-gallery-muted font-light text-sm mb-12">
            What are your thoughts on the evolution of digital minimalism? Join the conversation in our members-only salon.
          </p>
          <Link 
            href="/register" 
            className="px-12 py-5 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-bold hover:bg-gallery-gold transition-all rounded-none"
          >
            Become a Member
          </Link>
        </div>
      </section>
    </main>
  );
}
