"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function ArtistStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imgY3 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const [isMounted, setIsMounted] = useState(false);
  const [particlePositions, setParticlePositions] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    setParticlePositions([...Array(6)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    })));
  }, []);

  return (
    <section ref={containerRef} className="py-28 bg-gallery-surface relative overflow-hidden">
      {/* Organic Ink Splat Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true }}
        className="absolute -left-[10%] top-[10%] w-[800px] h-[800px] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70.1,-59,78.5,-46.3C86.9,-33.6,91.9,-18.3,92.1,-3.1C92.3,12.2,87.8,27.3,79.8,40.4C71.8,53.5,60.3,64.5,47.1,72.1C33.9,79.7,19.1,83.9,4,77.7C-11.1,71.5,-26.5,54.9,-39.8,41.9C-53.1,28.9,-64.3,19.5,-71,7C-77.7,-5.5,-79.8,-21.1,-74.6,-34.7C-69.4,-48.3,-56.9,-59.9,-43.1,-67C-29.3,-74.1,-14.7,-76.7,0.3,-77.2C15.3,-77.7,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {/* Vertical Ribbon Label */}
      <div className="absolute top-0 right-12 bottom-0 w-px bg-gallery-gold/10 hidden xl:block">
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-20">
          <span className="vertical-text text-[9px] tracking-[0.8em] uppercase text-gallery-gold/40">Artist Manifesto</span>
          <span className="vertical-text text-[9px] tracking-[0.8em] uppercase text-gallery-gold/40">Series 0.1</span>
        </div>
      </div>

      {/* Ambient Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {isMounted && particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bg-gallery-gold/20 rounded-full blur-3xl"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              top: pos.top,
              left: pos.left,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y: imgY }}
        className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-gallery-gold/5 rounded-full blur-[150px] -mr-[30vw] -mt-[15vw]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Section Header */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                className="h-[1px] bg-gallery-accent"
              />
              <p className="text-gallery-accent text-xs tracking-[0.6em] uppercase font-medium">
                The Artist's Soul
              </p>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                className="h-[1px] bg-gallery-accent"
              />
            </div>

            <h2 className="text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-20 leading-tight">
              {"Beyond the".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.9, rotateY: 30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="text-gallery-gold font-serif font-light"
              >
                Observed World
              </motion.span>
            </h2>
          </div>

          {/* Deconstructed Image Section (True 3-Part Partition) */}
          <div className="w-full max-w-5xl relative mb-16">
            <div className="relative flex gap-1 md:gap-2 justify-center items-center">
              {/* Slice 1 - Left 1/3 */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -20, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: imgY }}
                className="relative w-1/3 aspect-[4/5] overflow-hidden shadow-2xl rounded-sm"
              >
                <div className="absolute inset-y-0 left-0 w-[300%] h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1748723940982-c355793626af?auto=format&fit=crop&w=800&q=80"
                    alt="Artist Slice Left"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Slice 2 - Middle 1/3 */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 1.1 }}
                whileInView={{ opacity: 1, y: -32, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{ y: imgY2 }}
                className="relative w-1/3 aspect-[4/5] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] z-10 rounded-sm"
              >
                <div className="absolute inset-y-0 -left-[100%] w-[300%] h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1748723940982-c355793626af?auto=format&fit=crop&w=800&q=80"
                    alt="Artist Slice Middle"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Slice 3 - Right 1/3 */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                style={{ y: imgY3 }}
                className="relative w-1/3 aspect-[4/5] overflow-hidden shadow-2xl rounded-sm"
              >
                <div className="absolute inset-y-0 -left-[200%] w-[300%] h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1748723940982-c355793626af?auto=format&fit=crop&w=800&q=80"
                    alt="Artist Slice Right"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Floating Badge (Refined) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 1.2
                }}
                className="absolute -bottom-6 left-[15%] bg-white py-4 px-8 shadow-2xl z-20 border-l-4 border-gallery-gold"
              >
                <p className="text-[9px] tracking-[0.4em] uppercase text-gallery-muted mb-1">Authentic</p>
                <p className="text-xl font-light italic text-gallery-text">Curated</p>
              </motion.div>
            </div>
          </div>

          {/* Manifesto Content (Centered) */}
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-16 group/text"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--x', `${x}px`);
                e.currentTarget.style.setProperty('--y', `${y}px`);
              }}
            >
              {/* Mouse Following Spotlight (Smaller for Centered Layout) */}
              <div
                className="absolute w-40 h-40 bg-gallery-gold/20 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover/text:opacity-100 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: 'var(--x, 0)',
                  top: 'var(--y, 0)',
                  zIndex: -1
                }}
              />

              <div className="relative inline-block mb-12">
                <Quote size={80} className="text-gallery-gold/5 absolute -top-12 -left-14 rotate-12" />
                <p className="text-3xl md:text-4xl text-gallery-text font-light italic leading-relaxed px-12">
                  "We don't sell paintings; we sell <span className="text-gallery-gold">windows</span> into the subconscious. Each piece is a blooming portal for the soul."
                </p>
              </div>

              <div className="space-y-12 text-gallery-muted text-xl font-light leading-relaxed mb-16">
                <p>
                  Bristiii was founded on a singular premise: that true art is a <span className="text-gallery-text font-normal italic">living entity</span>. It changes as you change. It blooms differently in every light, in every mood, and for every observer.
                </p>
                <p>
                  Our curation process is an act of love. We seek out the 'unseen'—those rare works that possess a heartbeat, a whisper, and a door that only opens for those who truly look.
                </p>
              </div>

              <div className="flex flex-col items-center gap-16">
                <motion.div
                  className="inline-flex items-center gap-6 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-20 h-20 rounded-full border border-gallery-border flex items-center justify-center group-hover:bg-gallery-primary group-hover:border-gallery-primary transition-all duration-500 shadow-lg">
                    <Sparkles className="text-gallery-gold group-hover:text-white" size={28} strokeWidth={1} />
                  </div>
                  <span className="text-xs tracking-[0.5em] uppercase text-gallery-text font-bold border-b border-gallery-gold/20 pb-2">Read the Manifesto</span>
                </motion.div>

                {/* Founder Signature (Bristi) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase mb-1 opacity-60">Founder</span>
                  <span className="font-signature text-5xl text-gallery-text opacity-90 hover:opacity-100 transition-opacity duration-500">Bristi</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
