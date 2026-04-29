"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function ArtistStory() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative text in background */}
      <div className="absolute top-0 left-0 text-[20vw] font-bold text-gallery-soft pointer-events-none select-none opacity-50 -translate-x-1/4 -translate-y-1/4">
        STORY
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-20">
          
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[3/4] w-full max-w-md shadow-2xl"
            >
              <Image 
                src="/artist_at_work_1777459044495.png"
                alt="Artist Story"
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-10 -right-10 bg-gallery-primary p-8 text-white hidden lg:block">
                <p className="text-sm tracking-[0.3em] uppercase mb-2">Established</p>
                <p className="text-2xl font-light">MCMXCVIII</p>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gallery-accent text-sm tracking-[0.4em] uppercase mb-6">
                👩🎨 Artist Story
              </p>
              <h2 className="text-5xl font-light text-gallery-text mb-8 leading-tight">
                Behind the Canvas: <br /> Our Philosophy
              </h2>
              <div className="relative mb-10">
                <Quote size={40} className="text-gallery-gold/20 absolute -top-4 -left-4" />
                <p className="text-xl text-gallery-text font-light italic leading-relaxed pl-6">
                  "Art is not what you see, but what you make others see. At Bristiii, we believe in bridging the gap between the soul and the observer."
                </p>
              </div>
              <div className="space-y-6 text-gallery-muted leading-relaxed">
                <p>
                  Bristiii began in a small studio with a single mission: to provide a global stage for artists who refuse to compromise on their vision. We curate pieces that are not just decorative, but transformative.
                </p>
                <p>
                  Every artwork in our gallery is hand-picked by our curators, ensuring that you receive a piece of history, a slice of emotion, and a legacy of craftsmanship.
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="h-[1px] w-12 bg-gallery-gold" />
                <p className="text-sm tracking-widest uppercase text-gallery-text">Founder of Bristiii</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
