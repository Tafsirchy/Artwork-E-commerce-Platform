"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jonathan Vance",
    role: "Art Collector",
    content: "The delivery process was impeccable. The painting arrived in perfect condition and the Map tracking feature was incredibly accurate.",
    stars: 5
  },
  {
    name: "Sarah Jenkins",
    role: "Interior Designer",
    content: "Bristiii is my go-to for original pieces. The curation is world-class and the checkout experience is the smoothest I've used.",
    stars: 5
  },
  {
    name: "Marcus Thorne",
    role: "First-time Buyer",
    content: "I was nervous about buying art online, but the certificate of authenticity and the detailed artist stories gave me full confidence.",
    stars: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-gallery-bg border-t border-gallery-border">
      <div className="w-11/12 mx-auto">
        <div className="text-center mb-20">
          <p className="text-gallery-accent text-sm tracking-[0.4em] uppercase mb-4">
            ⭐ Voices of Collectors
          </p>
          <h2 className="text-5xl font-light text-gallery-text">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-gallery-surface p-10 border border-gallery-border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: item.stars }).map((_, s) => (
                    <Star key={s} size={16} fill="#C8A96A" color="#C8A96A" />
                  ))}
                </div>
                <p className="text-gallery-text italic leading-relaxed mb-8">"{item.content}"</p>
              </div>
              <div>
                <p className="text-gallery-text font-medium tracking-widest uppercase text-sm">{item.name}</p>
                <p className="text-gallery-muted text-xs uppercase tracking-widest">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
