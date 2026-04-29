"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const decorativeParticles = Array.from({ length: 15 }, (_, index) => ({
  x: `${(index * 17 + 11) % 100}%`,
  y: `${(index * 29 + 7) % 100}%`,
  duration: 5 + (index % 5),
  delay: (index * 0.4) % 5,
}));

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth parallax effect
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], ["-30px", "30px"]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], ["-30px", "30px"]);
  const bloomX = useTransform(smoothX, [-0.5, 0.5], ["100px", "-100px"]);
  const detailOneX = useTransform(smoothX, [-0.5, 0.5], ["-50px", "50px"]);
  const detailOneY = useTransform(smoothY, [-0.5, 0.5], ["-50px", "50px"]);
  const detailTwoX = useTransform(smoothX, [-0.5, 0.5], ["50px", "-50px"]);
  const detailTwoY = useTransform(smoothY, [-0.5, 0.5], ["50px", "-50px"]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gallery-bg cursor-crosshair"
    >
      {/* --- LAYER 1: Deep Background --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ x: translateX, y: translateY, scale: 1.1 }}
          className="absolute inset-0 opacity-40 grayscale-[0.5]"
        >
          <Image
            src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=2400&q=80"
            alt="Deep Canvas"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-gallery-bg/20 via-transparent to-gallery-bg" />
      </div>

      {/* --- LAYER 2: The "Blooming" Ink (Center) --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          style={{ rotate: rotateY, x: bloomX }}
          className="relative w-[80vw] h-[80vw] opacity-30 mix-blend-multiply blur-3xl"
        >
          <Image src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1600&q=80" alt="Ink Bloom" fill className="object-cover animate-pulse" />
        </motion.div>
      </motion.div>

      {/* --- LAYER 3: Interactive Floating Artifacts --- */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Floating Detail 1 */}
        <motion.div
          style={{ x: detailOneX, y: detailOneY }}
          className="absolute top-[15%] left-[10%] w-48 h-64 shadow-2xl rounded-sm overflow-hidden border border-white/20 pointer-events-auto group"
        >
          <Image src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" alt="Detail 1" fill className="object-cover transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 bg-gallery-gold/0 group-hover:bg-gallery-gold/20 transition-colors" />
        </motion.div>

        {/* Floating Detail 2 */}
        <motion.div
          style={{ x: detailTwoX, y: detailTwoY }}
          className="absolute bottom-[20%] right-[10%] w-64 h-48 shadow-2xl rounded-sm overflow-hidden border border-white/20 pointer-events-auto group"
        >
          <Image src="https://images.unsplash.com/photo-1500622944204-b135684e99fd?auto=format&fit=crop&w=1200&q=80" alt="Detail 2" fill className="object-cover transition-transform duration-700 group-hover:scale-125" />
          <div className="absolute inset-0 bg-gallery-accent/0 group-hover:bg-gallery-accent/20 transition-colors" />
        </motion.div>
      </div>

      {/* --- LAYER 4: Main Content (The Portal) --- */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative perspective-1000"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <div className="px-6 py-2 border border-gallery-gold/30 rounded-full flex items-center gap-3 bg-white/5 backdrop-blur-md">
              <Sparkles className="text-gallery-gold animate-spin-slow" size={14} />
              <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-gold font-semibold">The Infinite Canvas</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-light text-gallery-text leading-[1.1] mb-6"
          >
            Where Art <br /> 
            <span className="relative inline-block italic text-gallery-accent group">
              Blooms.
              <motion.span 
                className="absolute -inset-2 bg-gallery-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId="bloomGlow"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg text-gallery-muted max-w-xl mx-auto mb-10 leading-relaxed font-light"
          >
            A metaphysical journey through digital and physical masterpieces. <br />
            Every hover unveils a layer of beauty, every glance a door to inspiration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link
              href="/products"
              className="relative group px-14 py-5 bg-gallery-primary text-white text-xs tracking-[0.4em] uppercase overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter the Void <ArrowRight size={16} />
              </span>
              <motion.div 
                className="absolute inset-0 bg-gallery-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              />
            </Link>
            
            <Link
              href="/about"
              className="px-14 py-5 border border-gallery-border text-gallery-text text-xs tracking-[0.4em] uppercase hover:bg-gallery-surface transition-all"
            >
              The Artist's Soul
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* --- DECORATIVE: Floating Particles --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-40">
        {decorativeParticles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: particle.x, 
              y: particle.y,
              opacity: 0
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: particle.duration, 
              repeat: Infinity,
              delay: particle.delay
            }}
            className="w-1 h-1 bg-gallery-gold rounded-full"
          />
        ))}
      </div>

    </section>
  );
}
