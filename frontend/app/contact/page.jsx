"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contacts", formData);
      toast.success("Message sent! A curator will respond shortly.");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 border-b border-gallery-border bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] tracking-[0.4em] sm:tracking-[0.8em] uppercase text-gallery-gold mb-4 sm:mb-6 block font-black">
              Inquiries
            </span>
            <h1 className="text-4xl sm:text-7xl font-extralight text-gallery-text tracking-tighter leading-[1.1] sm:leading-none mb-6 sm:mb-8">
              Contact <br />
              <span className="font-serif text-gallery-accent">Us.</span>
            </h1>
            <p className="max-w-xl mx-auto text-gallery-muted text-base sm:text-lg font-light leading-relaxed">
              We are here to help you with any questions about our art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12 sm:space-y-16 order-2 lg:order-1"
            >
              <div>
                <h2 className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gallery-gold font-black mb-8 sm:mb-10">Our Locations</h2>
                <div className="space-y-10 sm:space-y-12">
                  <div className="flex gap-6 sm:gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none shadow-sm">
                      <MapPin size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm tracking-widest uppercase text-gallery-text mb-2 sm:mb-3 font-black">New York Gallery</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        77 Art Avenue, Creative District<br />
                        New York, NY 10012<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 sm:gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none shadow-sm">
                      <Mail size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm tracking-widest uppercase text-gallery-text mb-2 sm:mb-3 font-black">Email Us</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        General: info@bristiii.gallery<br />
                        Artists: submissions@bristiii.gallery<br />
                        Press: press@bristiii.gallery
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 sm:gap-8 group">
                    <div className="w-12 h-12 bg-white border border-gallery-border flex items-center justify-center shrink-0 group-hover:border-gallery-gold transition-colors duration-500 rounded-none shadow-sm">
                      <Phone size={20} className="text-gallery-text" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm tracking-widest uppercase text-gallery-text mb-2 sm:mb-3 font-black">Direct Line</h3>
                      <p className="text-gallery-muted text-sm font-light leading-relaxed">
                        Main: +1 (555) 234-5678<br />
                        Priority Support: +1 (555) 987-6543
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white border border-gallery-border relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-gallery-gold" />
                <h3 className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gallery-text font-black mb-4">Gallery Hours</h3>
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
              className="bg-white p-8 sm:p-12 border border-gallery-border shadow-2xl relative order-1 lg:order-2"
            >
              <h2 className="text-xl sm:text-2xl font-light text-gallery-text tracking-tight mb-8 sm:mb-10 uppercase">
                Send a <span className="font-serif text-gallery-gold">Message.</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light h-14"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light h-14"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black">Subject</label>
                  <div className="relative">
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light appearance-none h-14"
                    >
                      <option value="General Inquiry">General Question</option>
                      <option value="Art Consultation">Art Advice</option>
                      <option value="Exhibition Proposal">Art Submission</option>
                      <option value="Shipping & Logistics">Shipping Help</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <MessageSquare size={14} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted font-black">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-gallery-soft/30 border border-gallery-border px-4 py-4 focus:outline-none focus:border-gallery-gold transition-colors rounded-none font-light resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full h-16 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-black overflow-hidden transition-all rounded-none disabled:opacity-50 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? "Sending..." : "Send Message"} <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gallery-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[300px] sm:h-[400px] bg-gallery-soft border-t border-gallery-border grayscale relative overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop"
          alt="Gallery Location Map"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="bg-white/80 backdrop-blur-md px-6 sm:px-10 py-4 sm:py-6 border border-gallery-border text-center shadow-xl">
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.5em] uppercase text-gallery-text font-black">Interactive Map Under Maintenance</span>
          </div>
        </div>
      </section>
    </main>
  );
}
