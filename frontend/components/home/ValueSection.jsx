"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Certified Authenticity",
    desc: "Every artwork comes with a physical Certificate of Authenticity signed by the artist."
  },
  {
    icon: Truck,
    title: "Global White-Glove Shipping",
    desc: "Expertly packaged and insured delivery to your doorstep, anywhere in the world."
  },
  {
    icon: Sparkles,
    title: "Curated Excellence",
    desc: "Only 5% of submissions make it to our gallery, ensuring museum-grade quality."
  },
  {
    icon: HeartHandshake,
    title: "Collector's Support",
    desc: "Dedicated art advisors to help you build a collection that appreciates in value."
  }
];

export default function ValueSection() {
  return (
    <section className="py-32 bg-gallery-soft">
      <div className="max-w-7xl mx-auto px-12">
        <div className="text-center mb-20">
          <p className="text-gallery-accent text-sm tracking-[0.4em] uppercase mb-4">
            💎 The Bristiii Standard
          </p>
          <h2 className="text-5xl font-light text-gallery-text">Why Choose Our Gallery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-gallery-primary group-hover:text-white transition-all duration-500">
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-gallery-text mb-4 uppercase tracking-widest">{item.title}</h3>
              <p className="text-gallery-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
