"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";
import { useRef } from "react";

export default function ArtistStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={containerRef} className="py-40 bg-gallery-surface relative overflow-hidden">
      {/* Abstract Background Elements */}
      <motion.div 
        style={{ y: imgY }}
        className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gallery-gold/5 rounded-full blur-[120px] -mr-[20vw] -mt-[10vw]"
      />

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-32">
          
          {/* Image Column with Artistic Reveal */}
          <div className="w-full lg:w-1/2">
            <div className="relative group">
              <motion.div
                initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[3/4] w-full max-w-lg mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
              >
                <Image 
                  src="/artist_at_work_1777459044495.png"
                  alt="Artist Soul"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-gallery-gold/20 -z-10 group-hover:inset-0 transition-all duration-700" />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                whileInView={{ opacity: 1, rotate: 12 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -bottom-10 -left-10 bg-gallery-primary p-10 text-white hidden xl:block shadow-2xl"
              >
                <p className="text-[10px] tracking-[0.5em] uppercase mb-4 text-gallery-gold">Established</p>
                <p className="text-4xl font-light italic">MCMXCVIII</p>
              </motion.div>
            </div>
          </div>

          {/* Text Column with Cascading Bloom */}
          <div className="w-full lg:w-1/2">
            <motion.div style={{ y: textY }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-12 bg-gallery-accent" />
                  <p className="text-gallery-accent text-sm tracking-[0.5em] uppercase">
                    The Artist's Soul
                  </p>
                </div>

                <h2 className="text-6xl font-light text-gallery-text mb-10 leading-tight">
                  Beyond the <br /> 
                  <span className="italic text-gallery-gold">Observed World</span>
                </h2>

                <div className="relative mb-12">
                  <Quote size={60} className="text-gallery-gold/10 absolute -top-10 -left-10" />
                  <p className="text-2xl text-gallery-text font-light italic leading-relaxed pl-4 border-l-2 border-gallery-gold/20">
                    "We don't sell paintings; we sell windows into the subconscious. Each piece is a blooming portal for the soul."
                  </p>
                </div>

                <div className="space-y-8 text-gallery-muted text-lg font-light leading-relaxed">
                  <p>
                    Bristiii was founded on a singular premise: that true art is a living entity. It changes as you change. It blooms differently in every light, in every mood, and for every observer.
                  </p>
                  <p>
                    Our curation process is an act of love. We seek out the 'unseen'—those rare works that possess a heartbeat, a whisper, and a door that only opens for those who truly look.
                  </p>
                </div>

                <motion.div 
                  className="mt-16 inline-flex items-center gap-6 group cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  <div className="w-16 h-16 rounded-full border border-gallery-border flex items-center justify-center group-hover:bg-gallery-primary group-hover:border-gallery-primary transition-all">
                    <Sparkles className="text-gallery-gold group-hover:text-white" size={24} strokeWidth={1} />
                  </div>
                  <span className="text-sm tracking-[0.4em] uppercase text-gallery-text font-medium">Read the Full Manifesto</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
