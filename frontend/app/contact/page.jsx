"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Hero Section */}
      <section className="py-24 border-b border-gallery-border bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.8em] uppercase text-gallery-gold mb-6 block font-medium">
              Inquiries
            </span>
            <h1 className="text-5xl md:text-7xl font-extralight text-gallery-text tracking-tighter leading-none mb-8">
              Connect with <br />
              <span className="font-serif text-gallery-accent">the Gallery.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-lg font-light leading-relaxed">
              Whether you are a collector, an artist, or an enthusiast, we are here to assist you in your aesthetic journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-16"
            >
              <div>
                <h2 className="text-xs tracking-[0.4em] uppercase text-gallery-gold font-bold mb-10">Our Studios</h2>
                <div className="space-y-12">
                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none">
                      <MapPin size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-sm tracking-widest uppercase text-gallery-text mb-3 font-bold">New York Gallery</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        77 Art Avenue, Creative District<br />
                        New York, NY 10012<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none">
                      <Mail size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-sm tracking-widest uppercase text-gallery-text mb-3 font-bold">Digital Inquiries</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        General: info@bristiii.gallery<br />
                        Artists: submissions@bristiii.gallery<br />
                        Press: press@bristiii.gallery
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none">
                      <Phone size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-sm tracking-widest uppercase text-gallery-text mb-3 font-bold">Direct Line</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        Main: +1 (555) 234-5678<br />
                        VIP Concierge: +1 (555) 987-6543
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white border border-gallery-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold" />
                <h3 className="text-xs tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">Gallery Hours</h3>
                <div className="flex justify-between text-sm text-gallery-muted font-light">
                  <span>Mon — Fri</span>
                  <span>10:00 AM — 07:00 PM</span>
                </div>
                <div className="flex justify-between text-sm text-gallery-muted font-light mt-2">
                  <span>Sat — Sun</span>
                  <span>11:00 AM — 05:00 PM</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-12 border border-gallery-border shadow-2xl relative"
            >
              <h2 className="text-2xl font-light text-gallery-text tracking-tight mb-10 uppercase">
                Send a <span className="font-serif text-gallery-gold">Message.</span>
              </h2>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">Subject</label>
                  <select className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light appearance-none">
                    <option>General Inquiry</option>
                    <option>Artwork Acquisition</option>
                    <option>Artist Submission</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-bold">Your Message</label>
                  <textarea
                    rows={6}
                    className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="group relative w-full py-5 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-bold overflow-hidden transition-all rounded-none"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Send Message <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-gallery-soft border-t border-gallery-border grayscale relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-md px-10 py-6 border border-gallery-border">
            <span className="text-[10px] tracking-[0.5em] uppercase text-gallery-text font-bold">Interactive Map Under Maintenance</span>
          </div>
        </div>
      </section>
    </main>
  );
}
