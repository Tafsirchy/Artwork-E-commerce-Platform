"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const shards = [
  { top: "0%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 0, 101% 0, 101% 101%, 0 101%)" },
  { top: "0%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% 0, 101% 0, 101% 101%, -1% 101%)" },
  { top: "0%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% 0, 100% 0, 100% 101%, -1% 101%)" },
  { top: "33.333%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 -1%, 101% -1%, 101% 101%, 0 101%)" },
  { top: "33.333%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)" },
  { top: "33.333%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 100% -1%, 100% 101%, -1% 101%)" },
  { top: "66.666%", left: "0%", width: "33.333%", height: "33.333%", clip: "polygon(0 -1%, 101% -1%, 101% 100%, 0 100%)" },
  { top: "66.666%", left: "33.333%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 101% -1%, 101% 100%, -1% 100%)" },
  { top: "66.666%", left: "66.666%", width: "33.333%", height: "33.333%", clip: "polygon(-1% -1%, 100% -1%, 100% 100%, -1% 100%)" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1705711714839-cf327143c4a0?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1170&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1682125164600-e7493508e496?q=80&w=880&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200",
  "https://images.unsplash.com/photo-1557933488-c8daa2a5772c?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1747764968315-fb6a641a4eb8?q=80&w=744&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=687&auto=format&fit=crop",
];

const artThoughts = [
  ["Echoes of a digital soul.", "The canvas remembers every movement.", "A symphony of scattered pixels.", "Where silence finds its shape."],
  ["Form is the memory of light.", "A masterpiece in nine silent fragments.", "Colors bleeding into the void.", "The architecture of a dream."],
  ["Where logic meets the unseen.", "Every shard is a silent conversation.", "Gravity loses its hold.", "A chaotic yet perfect symmetry."],
  ["Art conspires in the details.", "Witness the rebirth of classical form.", "Time suspended in a single frame.", "An eternal breath of creativity."],
];

const layoutSlots = [
  { id: "A", class: "absolute top-0 left-0 w-[50%]", aspect: "aspect-[3/4]", z: "z-10" },
  { id: "B", class: "absolute top-[15%] right-0 w-[55%]", aspect: "aspect-square", z: "z-20" },
  { id: "C", class: "absolute bottom-0 left-[-10%] w-[75%]", aspect: "aspect-[3/2]", z: "z-30" },
  { id: "D", class: "absolute top-[10%] left-[15%] w-[45%]", aspect: "aspect-[4/5]", z: "z-15" },
  { id: "E", class: "absolute bottom-[10%] right-[5%] w-[60%]", aspect: "aspect-square", z: "z-25" },
];

function Shard({ shardInfo, index }) {
  // 🚀 FIX: Start with a stable image to prevent hydration mismatch flashes
  const [imgSrc, setImgSrc] = useState(galleryImages[index % galleryImages.length]);

  useEffect(() => {
    // Only start randomized interval after hydration
    const interval = setInterval(() => {
      setImgSrc(galleryImages[Math.floor(Math.random() * galleryImages.length)]);
    }, Math.random() * 2000 + 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute overflow-hidden"
      style={{ top: shardInfo.top, left: shardInfo.left, width: shardInfo.width, height: shardInfo.height, clipPath: shardInfo.clip, zIndex: 10 }}
    >
      <div className="absolute w-[300%] h-[300%]" style={{ left: `-${(index % 3) * 100}%`, top: `-${Math.floor(index / 3) * 100}%` }}>
        <img src={imgSrc} alt="Shard" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const clusterRef = useRef(null);
  const thoughtBoxTR = useRef(null);
  const thoughtBoxBL = useRef(null);
  const thoughtBoxTL = useRef(null);
  const thoughtBoxBR = useRef(null);

  const [slotIndices, setSlotIndices] = useState([0, 1, 2]);
  const [collectedShards, setCollectedShards] = useState([]);
  const [targetImage, setTargetImage] = useState(galleryImages[0]);
  const [currentThoughts, setCurrentThoughts] = useState(artThoughts[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const shuffleLayout = useCallback(() => {
    if (document.hidden || isCompleted) return;

    setSlotIndices(prev => [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5).slice(0, 3));

    setCollectedShards(prev => {
      if (prev.length < 9) {
        const batchSize = 3;
        const currentLength = prev.length;
        const nextBatch = [];

        for (let i = 0; i < batchSize; i++) {
          const nextIdx = currentLength + i;
          if (nextIdx >= 9) break;
          nextBatch.push(nextIdx);

          const sourceCluster = `.cluster-${Math.floor(Math.random() * 3)}`;
          const targetCell = `.modal-target-shard-${nextIdx}`;

          setTimeout(() => {
            const clusterEl = document.querySelector(sourceCluster);
            const clusterRect = clusterEl?.getBoundingClientRect();
            const targetEl = document.querySelector(targetCell);
            const targetRect = targetEl?.getBoundingClientRect();

            if (clusterRect && targetRect) {
              gsap.fromTo(targetCell,
                {
                  x: clusterRect.left - targetRect.left,
                  y: clusterRect.top - targetRect.top,
                  opacity: 0,
                  scale: 0.2
                },
                {
                  x: 0, y: 0, opacity: 1, scale: 1,
                  duration: 0.6,
                  ease: "power4.out"
                }
              );
            }
          }, i * 50);
        }

        const next = [...prev, ...nextBatch];
        if (next.length === 9) {
          setIsCompleted(true);

          setTimeout(() => {
            const tl = gsap.timeline();

            // 🏛️ Hide Normal Content
            const hideTargets = [titleRef.current, ".left-side-container"].filter(Boolean);
            if (hideTargets.length > 0) {
              tl.to(hideTargets, {
                opacity: 0,
                visibility: "hidden",
                duration: 0.1,
                ease: "power2.inOut"
              });
            }

            gsap.set(".collection-frame", { zIndex: 999, visibility: "visible" });

            // 🏛️ Centering & Thought Entrance
            tl.to(".collection-frame", {
              scale: 1.1,
              x: () => {
                const hero = heroRef.current;
                const frame = document.querySelector(".collection-frame");
                if (!hero || !frame) return 0;
                const hRect = hero.getBoundingClientRect();
                const fRect = frame.getBoundingClientRect();
                return "+=" + ((hRect.left + hRect.width / 2) - (fRect.left + fRect.width / 2));
              },
              y: () => {
                const hero = heroRef.current;
                const frame = document.querySelector(".collection-frame");
                if (!hero || !frame) return 0;
                const hRect = hero.getBoundingClientRect();
                const fRect = frame.getBoundingClientRect();
                return "+=" + ((hRect.top + hRect.height / 2) - (fRect.top + fRect.height / 2));
              },
              opacity: 1,
              boxShadow: "0 0 0 12px rgba(255, 255, 255, 0.95)",
              duration: 0.35,
              ease: "expo.out"
            }, "-=0.05");

            // 🖋️ Fade in Art Thoughts
            const thoughtTargets = [thoughtBoxTR.current, thoughtBoxBL.current, thoughtBoxTL.current, thoughtBoxBR.current].filter(Boolean);
            if (thoughtTargets.length > 0) {
              tl.fromTo(thoughtTargets,
                { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out", stagger: 0.1 },
                "-=0.2"
              );
            }

            // 🏛️ BALLOON INFLATION
            tl.to(".collection-frame", {
              scale: 1.45,
              duration: 2,
              ease: "power1.in",
              onComplete: () => {
                const blastTl = gsap.timeline();
                gsap.set(".collection-frame", { overflow: "visible" });

                // 💥 BURST ART THOUGHTS
                const thoughtTargetsBurst = [thoughtBoxTR.current, thoughtBoxBL.current, thoughtBoxTL.current, thoughtBoxBR.current].filter(Boolean);
                if (thoughtTargetsBurst.length > 0) {
                  blastTl.to(thoughtTargetsBurst, {
                    opacity: 0,
                    scale: 1.5,
                    filter: "blur(20px)",
                    duration: 0.2,
                    ease: "power4.in"
                  });
                }

                blastTl.to(".modal-target-shard", {
                  x: (i) => {
                    const col = i % 3;
                    const dirX = col === 0 ? -1 : col === 2 ? 1 : (Math.random() - 0.5) * 0.5;
                    return dirX * 1800;
                  },
                  y: (i) => {
                    const row = Math.floor(i / 3);
                    const dirY = row === 0 ? -1 : row === 2 ? 1 : (Math.random() - 0.5) * 0.5;
                    return dirY * 1800;
                  },
                  rotation: (i) => (Math.random() - 0.5) * 1440,
                  scale: 0,
                  opacity: 0,
                  duration: 0.15,
                  stagger: { each: 0.002, from: "center" },
                  ease: "power4.out"
                }, "-=0.15");

                blastTl.to(".collection-frame", {
                  opacity: 0,
                  duration: 0.1,
                  ease: "power2.in"
                }, "-=0.15");

                const finalShowTargets = [titleRef.current, ".left-side-container"].filter(Boolean);
                if (finalShowTargets.length > 0) {
                  blastTl.to(finalShowTargets, {
                    opacity: 1,
                    visibility: "visible",
                    duration: 0.2,
                    ease: "power2.inOut",
                    onComplete: () => {
                      gsap.set(".collection-frame", { clearProps: "transform,boxShadow", zIndex: 0, opacity: 0.5, overflow: "hidden" });
                      gsap.set(".modal-target-shard", { clearProps: "transform", opacity: 0 });
                      gsap.set([thoughtBoxTR.current, thoughtBoxBL.current, thoughtBoxTL.current, thoughtBoxBR.current].filter(Boolean), { opacity: 0, scale: 0.8 });
                      setCollectedShards([]);
                      setIsCompleted(false);
                      setTargetImage(galleryImages[Math.floor(Math.random() * galleryImages.length)]);
                      setCurrentThoughts(artThoughts[Math.floor(Math.random() * artThoughts.length)]);
                    }
                  }, "-=0.05");
                }
              }
            });
          }, 500);
        }
        return next;
      }
      return prev;
    });
  }, [isCompleted]);

  useEffect(() => {
    setIsMounted(true);
    let layoutTimer = setInterval(shuffleLayout, 800); // Faster layout shifts to build the grid

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(layoutTimer);
      } else {
        clearInterval(layoutTimer);
        layoutTimer = setInterval(shuffleLayout, 800);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const ctx = gsap.context(() => {
      if (clusterRef.current && heroRef.current) {
        gsap.to(clusterRef.current, { y: -80, scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 } });
      }
    }, heroRef);

    return () => {
      ctx.revert();
      clearInterval(layoutTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [shuffleLayout]);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen bg-gallery-bg flex items-center overflow-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-gallery-gold/5 rounded-full blur-[120px]" />

      {/* 🧩 POETIC FRAGMENTS (Full Screen Absolute, safely framing the center) */}
      <div ref={thoughtBoxTL} className="absolute top-[8%] left-[5%] z-40 opacity-0 pointer-events-none max-w-[280px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 pr-6 pl-8 py-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gallery-gold/0 via-gallery-gold/50 to-gallery-gold/0"></div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gallery-text font-medium leading-[2.5] text-left">
            {currentThoughts[2]}
          </p>
        </div>
      </div>

      <div ref={thoughtBoxTR} className="absolute top-[8%] right-[5%] z-40 opacity-0 pointer-events-none max-w-[280px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 pl-6 pr-8 py-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gallery-gold/0 via-gallery-gold/50 to-gallery-gold/0"></div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gallery-text font-medium leading-[2.5] text-right">
            {currentThoughts[0]}
          </p>
        </div>
      </div>

      <div ref={thoughtBoxBL} className="absolute bottom-[8%] left-[5%] z-40 opacity-0 pointer-events-none max-w-[280px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 pr-6 pl-8 py-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gallery-gold/0 via-gallery-gold/50 to-gallery-gold/0"></div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gallery-text font-medium leading-[2.5] text-left">
            {currentThoughts[1]}
          </p>
        </div>
      </div>

      <div ref={thoughtBoxBR} className="absolute bottom-[8%] right-[5%] z-40 opacity-0 pointer-events-none max-w-[280px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 pl-6 pr-8 py-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gallery-gold/0 via-gallery-gold/50 to-gallery-gold/0"></div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gallery-text font-medium leading-[2.5] text-right">
            {currentThoughts[3]}
          </p>
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-12">

        {/* 🏛️ LEFT SIDE: Source Clusters */}
        <div className="left-side-container relative h-full flex flex-col items-start justify-center order-1 w-full">
          <div ref={clusterRef} className="relative w-full max-w-[420px] h-[420px]">
            {[0, 1, 2].map((cardIndex) => {
              const currentSlotIndex = slotIndices[cardIndex];
              const slot = layoutSlots[currentSlotIndex];
              return (
                <motion.div
                  key={cardIndex}
                  layout
                  className={`cluster-${cardIndex} ${slot.class} ${slot.z}`}
                  transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                >
                  <div className={`relative ${slot.aspect} w-full rounded-3xl overflow-hidden bg-[#FAF8F5] border border-white/40`}>
                    <div className="absolute inset-0">
                      {shards.map((shard, i) => (
                        <Shard key={i} shardInfo={shard} index={i} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 🖋️ RIGHT SIDE: Hero Text & Separate Assembly Window */}
        <div className="relative z-10 order-2 flex flex-col items-end justify-center h-full w-full">

          {/* 🖼️ COLLECTION FRAME */}
          <div className="collection-frame absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] z-0 pointer-events-none opacity-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <div className="relative w-full h-full aspect-square flex items-center justify-center">
                  {shards.map((shard, i) => (
                    <div
                      key={i}
                      className={`modal-target-shard modal-target-shard-${i} absolute overflow-hidden transition-opacity duration-300`}
                      style={{
                        top: shard.top,
                        left: shard.left,
                        width: shard.width,
                        height: shard.height,
                        clipPath: shard.clip,
                        opacity: collectedShards.includes(i) ? 1 : 0
                      }}
                    >
                      <div className="absolute w-[300%] h-[300%] flex items-center justify-center" style={{ left: `-${(i % 3) * 100}%`, top: `-${Math.floor(i / 3) * 100}%` }}>
                        <img src={targetImage} alt="Collection Shard" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 🖋️ TEXT CONTENT */}
          <div ref={titleRef} className="relative z-10 flex flex-col items-end text-right w-full">
            <div className="title-line mb-6 inline-flex items-center gap-3 px-6 py-2 border border-gallery-gold/20 rounded-none bg-white/20 backdrop-blur-xl shadow-inner">
              <Sparkles size={14} className="text-gallery-gold animate-pulse" />
              <span className="text-[9px] tracking-[0.6em] uppercase text-gallery-text font-medium">The Living Canvas • Series I</span>
            </div>

            <h1 className="text-6xl md:text-[5.2rem] font-extralight text-gallery-text leading-[0.9] mb-6 tracking-tighter">
              <span className="title-line block">Echoes of the</span>
              <span className="title-line block text-gallery-accent font-serif mt-2">Unseen.</span>
            </h1>

            <p className="title-line text-gallery-muted text-lg font-light leading-relaxed mb-10 max-w-lg border-r-2 border-gallery-gold/20 pr-8">
              Witness the digital rebirth of form. A curated sanctuary where every shard tells a story, and every masterpiece finds its soul.
            </p>

            <div className="title-line flex flex-col sm:flex-row items-center gap-10">
              <Link href="/products" className="group relative px-12 py-6 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase overflow-hidden rounded-none block shadow-2xl transition-all duration-500 hover:shadow-gallery-gold/20">
                <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 block">ENTER THE GALLERY</span>
                <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-[8px] tracking-[0.5em] uppercase text-gallery-muted">Collection Window Active</span>
        <div className="w-[1px] h-10 bg-gallery-gold/20" />
      </div>
    </section>
  );
}