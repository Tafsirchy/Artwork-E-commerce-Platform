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
  const glowX = useTransform(scrollYProgress, [0, 1], ["-100%", "200%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);

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
    <section ref={containerRef} className="py-20 md:py-32 bg-gallery-surface relative overflow-hidden">
      {/* Organic Ink Splat Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.03, scale: 1 }}
        viewport={{ once: true }}
        className="absolute -left-[20%] top-[10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] pointer-events-none"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70.1,-59,78.5,-46.3C86.9,-33.6,91.9,-18.3,92.1,-3.1C92.3,12.2,87.8,27.3,79.8,40.4C71.8,53.5,60.3,64.5,47.1,72.1C33.9,79.7,19.1,83.9,4,77.7C-11.1,71.5,-26.5,54.9,-39.8,41.9C-53.1,28.9,-64.3,19.5,-71,7C-77.7,-5.5,-79.8,-21.1,-74.6,-34.7C-69.4,-48.3,-56.9,-59.9,-43.1,-67C-29.3,-74.1,-14.7,-76.7,0.3,-77.2C15.3,-77.7,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {/* Vertical Ribbon Label (Desktop Only) */}
      <div className="absolute top-0 right-12 bottom-0 w-px bg-gallery-gold/10 hidden xl:block">
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-20">
          <span className="vertical-text text-[9px] tracking-[0.8em] uppercase text-gallery-gold/40">Artist Manifesto</span>
          <span className="vertical-text text-[9px] tracking-[0.8em] uppercase text-gallery-gold/40">Series 0.1</span>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mx-auto">

          {/* Section Header */}
          <div className="mb-12 md:mb-20">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
              <div className="h-[1px] w-8 md:w-10 bg-gallery-accent opacity-30" />
              <p className="text-gallery-accent text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold">
                The Artist's Soul
              </p>
              <div className="h-[1px] w-8 md:w-10 bg-gallery-accent opacity-30" />
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gallery-text tracking-widest uppercase mb-16 md:mb-24 leading-tight">
              Beyond the <br />
              <span className="text-gallery-gold font-serif font-light">Observed World</span>
            </h2>
          </div>

          {/* Deconstructed Image Section (Mobile-Optimized) */}
          <div className="w-full max-w-5xl mx-auto relative mb-20 md:mb-32">
            <div className="relative grid grid-cols-3 gap-1 md:gap-4 justify-center items-center">
              {/* Slices 1, 2, 3 with improved mobile visibility */}
              {[0, 1, 2].map((i) => (
                <div key={i} className={`relative w-full aspect-[3/4] md:aspect-[4/5] ${i === 1 ? "-mt-6 md:-mt-10 z-10" : ""}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                    className="w-full h-full relative overflow-hidden shadow-2xl rounded-[2px] bg-gallery-border/10"
                  >
                    <div 
                      className="absolute inset-y-0 w-[300%] h-full"
                      style={{ left: `-${i * 100}%` }}
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1748723940982-c355793626af?auto=format&fit=crop&w=1200&q=80"
                        alt={`Artist Slice ${i}`}
                        fill
                        priority
                        sizes="(max-width: 640px) 30vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Floating Badge (Refined) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 md:-bottom-10 left-[5%] md:left-[10%] bg-white py-3 px-6 md:py-4 md:px-8 shadow-2xl z-20 border-l-4 border-gallery-gold"
              >
                <p className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-gallery-muted mb-1">Authentic</p>
                <p className="text-base md:text-xl font-light italic text-gallery-text">Curated</p>
              </motion.div>
            </div>
          </div>

          {/* Manifesto Content (Centered) */}
          <div className="max-w-3xl mx-auto px-4">
            <div className="relative mb-16">
              {/* 🚀 Mobile-First Glow: Scroll-Reactive Spotlight */}
              <motion.div
                style={{ left: glowX, opacity: glowOpacity }}
                className="absolute w-64 h-64 bg-gallery-gold/15 blur-[100px] rounded-full pointer-events-none -top-12 z-0"
              />

              <div className="relative inline-block mb-12">
                <Quote size={60} className="text-gallery-gold/10 absolute -top-10 -left-10 rotate-12" />
                <p className="text-2xl md:text-4xl text-gallery-text font-light italic leading-relaxed px-4 md:px-12 relative z-10">
                  "We don't sell paintings; we sell <span className="text-gallery-gold">windows</span> into the subconscious. Each piece is a blooming portal for the soul."
                </p>
              </div>

              <div className="space-y-8 md:space-y-12 text-gallery-muted text-lg md:text-xl font-light leading-relaxed mb-16">
                <p>
                  Bristiii was founded on a singular premise: that true art is a <span className="text-gallery-text font-normal italic">living entity</span>. It changes as you change. It blooms differently in every light, in every mood.
                </p>
                <p>
                  Our curation process is an act of love. We seek out the 'unseen'—those rare works that possess a heartbeat, a whisper, and a door that only opens for those who truly look.
                </p>
              </div>

              <div className="flex flex-col items-center gap-12 md:gap-16">
                <motion.button
                  aria-label="Read the full Artist Manifesto"
                  className="inline-flex items-center gap-6 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gallery-border flex items-center justify-center group-hover:bg-gallery-primary group-hover:border-gallery-primary transition-all duration-500 shadow-lg">
                    <Sparkles className="text-gallery-gold group-hover:text-white w-6 h-6 md:w-7 md:h-7" strokeWidth={1} />
                  </div>
                  <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-gallery-text font-bold border-b border-gallery-gold/20 pb-2">Read the Manifesto</span>
                </motion.button>

                {/* Founder Signature (Bristi) */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] tracking-[0.4em] uppercase mb-1 opacity-50">Founder</span>
                  <span className="font-signature text-4xl md:text-5xl text-gallery-text opacity-90">Bristi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
