"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import AnimatedButton from "../shared/AnimatedButton";

const ArtworkCard = ({ item, index, className, aspectClass, onImageClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 15, rotateY: index % 2 === 0 ? -10 : 10 }}
    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{
      duration: 0.6,
      delay: 0.2 + index * 0.1,
      ease: [0.16, 1, 0.3, 1]
    }}
    className={`relative group cursor-none bg-white p-5 pb-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.3)] transition-shadow duration-700 ${className || ''}`}
  >
    {/* Masking Tape */}
    <motion.div
      initial={{ opacity: 0, scale: 1.3, y: -20, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
      className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#8e8b76]/90 backdrop-blur-sm shadow-sm z-30"
    />
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black/10 translate-y-1 blur-[3px] z-20"
    />

    {/* Image Container with Shutter Door */}
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-gallery-soft mb-6 shadow-inner cursor-pointer`}
      onClick={() => onImageClick && onImageClick(item)}
    >
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />

      {/* The Shutter/Door Effect (Overlay) */}
      <div className="absolute inset-0 flex flex-col pointer-events-none z-10">
        <div className="flex-1 bg-gallery-primary/95 transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:-translate-y-full border-b border-white/10" />
        <div className="flex-1 bg-gallery-primary/95 transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:translate-y-full border-t border-white/10" />
      </div>

      {/* Centered Icon on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 z-20">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
          <Eye className="text-white" size={24} strokeWidth={1} />
        </div>
      </div>

      {/* Category Label */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] tracking-[0.3em] uppercase border border-white/20">
          {item.category}
        </span>
      </div>
    </div>

    {/* Text Content */}
    <div className="flex justify-between items-start px-2 mt-auto">
      <div>
        <h3 className="text-xl font-light text-gallery-text tracking-wider uppercase mb-1">
          {item.title}
        </h3>
        <p className="text-gallery-muted text-[10px] tracking-widest uppercase italic">
          By {item.creator}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-light text-gallery-gold mb-2">${item.price?.toLocaleString()}</p>
        <button className="w-8 h-8 bg-gallery-soft flex items-center justify-center rounded-full hover:bg-gallery-primary hover:text-white transition-colors ml-auto">
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function FeaturedArtwork() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/home-config/featured");
        setFeaturedItems(data.productIds);
      } catch (error) {
        console.error("Failed to fetch featured selection:", error);
      }
    };
    fetchFeatured();
  }, []);

  if (featuredItems.length < 4) return null;

  return (
    <section className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
          <div className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-gallery-accent text-sm uppercase mb-6"
              >
                🧩 The Curator's Eye
              </motion.p>
              <h2 className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-tight">
                {"Opening the Doors".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block mr-4"
                >
                  to
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -20, rotateY: 90 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  className="font-serif text-gallery-gold font-light inline-block"
                >
                  Hidden Beauty
                </motion.span>
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-right"
          >
            <p className="text-gallery-muted max-w-sm ml-auto mb-8 text-lg font-light leading-relaxed">
              Hand-picked masterpieces that don't just occupy space—they transform it. Hover to witness the bloom.
            </p>
            <Link href="/products" className="text-xs tracking-[0.3em] uppercase text-gallery-gold hover:text-gallery-text transition-colors border-b border-gallery-gold/30 pb-2">
              View All Masterpieces
            </Link>
          </motion.div>
        </div>

        {/* 🎨 MOODBOARD LAYOUT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50, rotateX: 5 }}
          whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#9c9a87] py-12 px-6 md:px-12 lg:px-24 rounded-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-stretch relative overflow-hidden"
          style={{ perspective: "1200px" }}
        >
          {/* Animated Overlay "Door" Reveal */}
          <motion.div
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            className="absolute inset-0 bg-[#1c1c1c] z-[60] origin-left pointer-events-none"
          />

          {/* Subtle Background Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />

          {/* Left Col: 2 Stacked Cards */}
          <div className="flex flex-col justify-between gap-8 relative z-10 h-full">
            <ArtworkCard item={featuredItems[0]} index={0} aspectClass="aspect-[3/2]" className="" onImageClick={setActiveImage} />
            <ArtworkCard item={featuredItems[1]} index={1} aspectClass="aspect-[2/1]" className="" onImageClick={setActiveImage} />
          </div>

          {/* Middle Col: Text + 1 Card */}
          <div className="flex flex-col justify-between gap-8 relative z-10 h-full">
            <div className="flex flex-col items-center justify-start px-2 text-center pt-2">
              <h3 className="text-3xl lg:text-4xl font-light mb-4 font-serif italic text-[#e6e5dd] tracking-wider">
                Curator's Notes
              </h3>
              <p className="text-xs lg:text-sm font-light leading-relaxed mb-4 opacity-90 text-[#e6e5dd]">
                We don't just hang paintings; we capture moments of profound silence. Each piece on this board was selected for its ability to pause time and demand contemplation.
              </p>
              <p className="text-xs lg:text-sm font-light leading-relaxed opacity-90 text-[#e6e5dd]">
                Allow your eyes to wander. The beauty lies not in the center, but in the unseen corners of the canvas.
              </p>

              <AnimatedButton onClick={() => setIsModalOpen(true)} text="See the beauty" delay={0.8} />
            </div>
            <ArtworkCard item={featuredItems[2]} index={2} aspectClass="aspect-[2/1]" className="" onImageClick={setActiveImage} />
          </div>

          {/* Right Col: 1 Tall Card */}
          <div className="flex flex-col relative z-10 h-full">
            <ArtworkCard item={featuredItems[3]} index={3} aspectClass="flex-1 min-h-0" className="h-full flex flex-col" onImageClick={setActiveImage} />
          </div>

        </motion.div>
      </div>

      {/* 🔮 LAYOUT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} strokeWidth={1} />
            </button>

            {/* Cross/Plus Layout */}
            <div className="w-full max-w-5xl flex items-center justify-center gap-4 md:gap-8">

              {/* Left Column (1 Portrait) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-1/3 md:w-1/4"
              >
                <div className="relative aspect-[4/5] bg-white p-2 md:p-4 shadow-2xl">
                  <div className="relative w-full h-full">
                    <Image src={featuredItems[0].imageUrl} alt={featuredItems[0].title} fill className="object-cover" />
                  </div>
                  <p className="absolute -bottom-8 md:-bottom-12 left-0 w-full text-center text-white/70 text-[8px] md:text-[10px] tracking-widest uppercase">{featuredItems[0].title}</p>
                </div>
              </motion.div>

              {/* Middle Column (2 Landscapes) */}
              <div className="w-1/3 md:w-1/4 flex flex-col gap-4 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="relative aspect-[5/4] bg-white p-2 md:p-4 shadow-2xl"
                >
                  <div className="relative w-full h-full">
                    <Image src={featuredItems[1].imageUrl} alt={featuredItems[1].title} fill className="object-cover" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative aspect-[5/4] bg-white p-2 md:p-4 shadow-2xl"
                >
                  <div className="relative w-full h-full">
                    <Image src={featuredItems[2].imageUrl} alt={featuredItems[2].title} fill className="object-cover" />
                  </div>
                </motion.div>
              </div>

              {/* Right Column (1 Portrait) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-1/3 md:w-1/4"
              >
                <div className="relative aspect-[4/5] bg-white p-2 md:p-4 shadow-2xl">
                  <div className="relative w-full h-full">
                    <Image src={featuredItems[3].imageUrl} alt={featuredItems[3].title} fill className="object-cover" />
                  </div>
                  <p className="absolute -bottom-8 md:-bottom-12 left-0 w-full text-center text-white/70 text-[8px] md:text-[10px] tracking-widest uppercase">{featuredItems[3].title}</p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖼️ SINGLE IMAGE MODAL */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
            onClick={() => setActiveImage(null)}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50"
            >
              <X size={32} strokeWidth={1} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full flex flex-col md:flex-row items-stretch bg-[#1a1a1a] shadow-2xl overflow-hidden rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="relative w-full md:w-2/3 min-h-[50vh] md:min-h-[70vh] bg-black/40">
                <Image
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  fill
                  className="object-contain p-4 md:p-12"
                />
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/3 p-8 md:p-16 flex flex-col justify-center border-l border-white/5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 block">
                  {activeImage.category}
                </span>
                <h2 className="text-3xl md:text-5xl font-light text-white mb-4 font-serif">
                  {activeImage.title}
                </h2>
                <p className="text-sm tracking-widest text-[#9c9a87] italic mb-10">
                  By {activeImage.creator}
                </p>

                <div className="text-3xl font-light text-white mb-12">
                  ${activeImage.price?.toLocaleString()}
                </div>

                <div className="space-y-4 w-full">
                  <AnimatedButton
                    text="Acquire Piece"
                    containerClass="w-full mt-0"
                    buttonClass="border-white/30 hover:border-white w-full"
                    textClass="text-white group-hover:text-black"
                    fillClass="bg-white"
                  />
                  <button className="w-full py-3 text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10">
                    View in Room
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
