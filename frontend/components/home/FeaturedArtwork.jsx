"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Eye, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import AnimatedButton from "../shared/AnimatedButton";
import useCartStore from "@/store/cartStore";
import FeaturedSkeleton from "../ui/FeaturedSkeleton";

const ArtworkCard = ({ item, index, className, aspectClass, onImageClick }) => {
  const { addToCart } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`relative group cursor-none bg-white p-5 pb-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.2)] transition-shadow duration-700 ${className || ''}`}
    >
      {/* Masking Tape */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1, y: -10 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#8e8b76]/90 backdrop-blur-sm shadow-sm z-30"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 + index * 0.1 }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black/10 translate-y-1 blur-[3px] z-20"
      />

      {/* Image Container with Shutter Door */}
      <div
        className={`relative w-full ${aspectClass} overflow-hidden bg-gallery-soft mb-6 shadow-inner cursor-pointer`}
        onClick={() => onImageClick && onImageClick(item)}
      >
        <Image
          src={item.thumbnailUrl || item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* The Shutter/Door Effect (Overlay - Desktop Only) */}
        <div className="absolute inset-0 hidden md:flex flex-col pointer-events-none z-10">
          <div className="flex-1 bg-gallery-primary transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:-translate-y-full border-b border-white/10" />
          <div className="flex-1 bg-gallery-primary transition-transform duration-700 ease-[0.77, 0, 0.175, 1] group-hover:translate-y-full border-t border-white/10" />
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
          <p className="text-gallery-muted text-[10px] tracking-widest uppercase ">
            By {item.creator}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-light text-gallery-gold mb-2">${item.price?.toLocaleString()}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                ...item,
                imageUrl: item.imageUrl || item.image,
                creator: item.creator || item.artist
              });
              toast.success(`"${item.title}" added to collection`);
            }}
            className="w-12 h-12 bg-gallery-soft flex items-center justify-center rounded-full hover:bg-gallery-primary hover:text-white transition-colors ml-auto shadow-sm active:scale-95"
          >
            <Plus size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function FeaturedArtwork() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const { addToCart } = useCartStore();

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

  return (
    <AnimatePresence mode="wait">
      {featuredItems.length < 4 ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FeaturedSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <section className="py-28 bg-gallery-bg">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.p
                      initial={{ opacity: 0, letterSpacing: "0.1em" }}
                      whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-gallery-accent text-[10px] md:text-sm uppercase mb-6"
                    >
                      🧩 Our Best Picks
                    </motion.p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-4 leading-tight">
                      {"See Beautiful".split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="inline-block mr-4"
                        >
                          {word}
                        </motion.span>
                      ))}
                      <br />
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="font-serif text-gallery-gold font-light inline-block"
                      >
                        Art
                      </motion.span>
                    </h2>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-left md:text-right"
                >
                  <p className="text-gallery-muted max-w-sm ml-auto mb-8 text-base md:text-lg font-light leading-relaxed">
                    We pick the best art that makes your room look amazing. Move your mouse to see more.
                  </p>
                  <Link href="/products" className="text-[10px] tracking-[0.3em] uppercase text-gallery-gold hover:text-gallery-text transition-colors border-b border-gallery-gold/30 pb-2">
                    See All Art
                  </Link>
                </motion.div>
              </div>

              {/* 🎨 MOODBOARD LAYOUT */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#9c9a87] py-12 px-6 md:px-12 lg:px-24 rounded-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-stretch relative overflow-hidden"
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
                <div className="flex flex-col justify-between gap-8 relative z-10">
                  {featuredItems[0] && <ArtworkCard item={featuredItems[0]} index={0} aspectClass="aspect-[4/3] md:aspect-[3/2]" className="" onImageClick={setActiveImage} />}
                  {featuredItems[1] && <ArtworkCard item={featuredItems[1]} index={1} aspectClass="aspect-[3/2] md:aspect-[2/1]" className="" onImageClick={setActiveImage} />}
                </div>

                {/* Middle Col: Text + 1 Card */}
                <div className="flex flex-col justify-between gap-8 relative z-10">
                  <div className="flex flex-col items-center justify-start px-2 text-center pt-2">
                    <h3 className="text-2xl lg:text-4xl font-light mb-4 font-serif  text-[#e6e5dd] tracking-wider">
                      Our Thoughts
                    </h3>
                    <p className="text-xs lg:text-sm font-light leading-relaxed mb-4 opacity-90 text-[#e6e5dd]">
                      We pick art that makes you stop and think. Each piece is special and made with care.
                    </p>
                    <p className="text-xs lg:text-sm font-light leading-relaxed opacity-90 text-[#e6e5dd]">
                      Look closely at the art. You will find beauty in every corner.
                    </p>

                    <div className="mt-4 mb-4">
                      <AnimatedButton onClick={() => setIsModalOpen(true)} text="See more" delay={0.3} />
                    </div>
                  </div>
                  {featuredItems[2] && <ArtworkCard item={featuredItems[2]} index={2} aspectClass="aspect-[3/2] md:aspect-[2/1]" className="" onImageClick={setActiveImage} />}
                </div>

                {/* Right Col: 1 Tall Card */}
                <div className="flex flex-col relative z-10">
                  {featuredItems[3] && <ArtworkCard item={featuredItems[3]} index={3} aspectClass="aspect-[3/4] md:aspect-auto md:flex-1" className="h-full flex flex-col" onImageClick={setActiveImage} />}
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
                  className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors active:scale-95"
                  >
                    <X size={32} strokeWidth={1} />
                  </button>

                  {/* Cross/Plus Layout */}
                  <div className="w-full  flex items-center justify-center gap-4 md:gap-8">
                    {/* ... (rest of modal remains, simplified entries) */}
                    {/* Note: I'll keep the logic but ensures no rotations in modal entries either */}
                    <div className="w-full max-w-6xl flex items-center justify-center gap-4 md:gap-8">
                      {/* Portrait 1 */}
                      {featuredItems[0] && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-1/3 md:w-1/4 bg-white p-2 md:p-4 shadow-2xl">
                          <div className="relative aspect-[4/5]"><Image src={featuredItems[0].thumbnailUrl || featuredItems[0].imageUrl} alt="art" fill className="object-cover" sizes="(max-width: 768px) 33vw, 25vw" /></div>
                        </motion.div>
                      )}
                      {/* Landscapes */}
                      <div className="w-1/3 md:w-1/4 flex flex-col gap-4 md:gap-8">
                        {featuredItems[1] && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-2 md:p-4 shadow-2xl"><div className="relative aspect-[5/4]"><Image src={featuredItems[1].thumbnailUrl || featuredItems[1].imageUrl} alt="art" fill className="object-cover" sizes="(max-width: 768px) 33vw, 25vw" /></div></motion.div>}
                        {featuredItems[2] && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-2 md:p-4 shadow-2xl"><div className="relative aspect-[5/4]"><Image src={featuredItems[2].thumbnailUrl || featuredItems[2].imageUrl} alt="art" fill className="object-cover" sizes="(max-width: 768px) 33vw, 25vw" /></div></motion.div>}
                      </div>
                      {/* Portrait 2 */}
                      {featuredItems[3] && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-1/3 md:w-1/4 bg-white p-2 md:p-4 shadow-2xl">
                          <div className="relative aspect-[4/5]"><Image src={featuredItems[3].thumbnailUrl || featuredItems[3].imageUrl} alt="art" fill className="object-cover" sizes="(max-width: 768px) 33vw, 25vw" /></div>
                        </motion.div>
                      )}
                    </div>
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
                  className="fixed inset-0 z-[160] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
                  onClick={() => setActiveImage(null)}
                >
                  <button
                    onClick={() => setActiveImage(null)}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-50 active:scale-95"
                  >
                    <X size={32} strokeWidth={1} />
                  </button>

                  <motion.div
                    initial={{ scale: 0.98, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.98, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative max-w-4xl w-full flex flex-col md:flex-row items-stretch bg-[#1a1a1a] shadow-2xl overflow-hidden rounded-sm mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image Section */}
                    <div className="relative w-full md:w-3/5 min-h-[40vh] md:min-h-[60vh] bg-black/40">
                      <Image src={activeImage.imageUrl} alt={activeImage.title} fill priority className="object-contain p-6 md:p-10" sizes="(max-width: 1200px) 100vw, 80vw" />
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center border-l border-white/5">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 block">{activeImage.category}</span>
                      <h2 className="text-2xl md:text-3xl font-light text-white mb-3 font-serif">{activeImage.title}</h2>
                      <p className="text-sm tracking-widest text-[#9c9a87]  mb-6">By {activeImage.creator}</p>
                      <div className="text-2xl font-light text-white mb-8">${activeImage.price?.toLocaleString()}</div>

                      <div className="space-y-3 w-full">
                        <AnimatedButton
                          text="Add to Cart"
                          containerClass="w-full mt-0"
                          buttonClass="border-white/30 hover:border-white w-full py-4"
                          textClass="text-white group-hover:text-black text-[9px]"
                          fillClass="bg-white"
                          onClick={() => {
                            addToCart({
                              _id: activeImage._id || activeImage.id,
                              title: activeImage.title,
                              price: activeImage.price,
                              image: activeImage.imageUrl || activeImage.image,
                              artist: activeImage.creator || activeImage.artist
                            });
                            toast.success(`"${activeImage.title}" added to collection`);
                            setActiveImage(null);
                          }}
                        />
                        <button className="w-full py-4 text-[9px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10 active:scale-95">View in Room</button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
