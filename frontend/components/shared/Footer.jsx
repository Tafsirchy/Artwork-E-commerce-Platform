"use client";

import Link from "next/link";
import { Camera, Mail, Globe, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gallery-surface pt-16 lg:pt-24 pb-12 border-t border-gallery-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">

          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-light tracking-[0.3em] text-gallery-text block mb-6 sm:mb-8">
              BRISTIII
            </Link>
            <p className="text-gallery-muted text-base sm:text-sm leading-relaxed mb-8 max-w-xs font-light">
              A curated digital space connecting visionary artists with global collectors. Experience the soul of contemporary art.
            </p>
            <div className="flex gap-6 text-gallery-muted">
              {/* 🚀 SM Fix: 24px icons for touch targets */}
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Camera size={24} /></Link>
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Mail size={24} /></Link>
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Globe size={24} /></Link>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-gallery-text font-black mb-6 sm:mb-8">Collection</h4>
            <ul className="space-y-4 text-base sm:text-sm text-gallery-muted font-light">
              <li><Link href="/products" className="hover:text-gallery-text transition-colors block py-1">All Artworks</Link></li>
              <li><Link href="/products?category=Abstract" className="hover:text-gallery-text transition-colors block py-1">Abstract Pieces</Link></li>
              <li><Link href="/products?category=Minimalism" className="hover:text-gallery-text transition-colors block py-1">Minimalist Works</Link></li>
              <li><Link href="/products?category=Digital Art" className="hover:text-gallery-text transition-colors block py-1">Digital Editions</Link></li>
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-gallery-text font-black mb-6 sm:mb-8">Information</h4>
            <ul className="space-y-4 text-base sm:text-sm text-gallery-muted font-light">
              <li><Link href="/" className="hover:text-gallery-text transition-colors block py-1">Home</Link></li>
              <li><Link href="/about" className="hover:text-gallery-text transition-colors block py-1">About the Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-gallery-text transition-colors block py-1">The Chronicle (Blog)</Link></li>
              <li><Link href="/contact" className="hover:text-gallery-text transition-colors block py-1">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-gallery-text transition-colors block py-1">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-gallery-text transition-colors block py-1">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gallery-text transition-colors block py-1">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-gallery-text font-black mb-6 sm:mb-8">Visit Us</h4>
            <ul className="space-y-4 text-base sm:text-sm text-gallery-muted font-light">
              <li className="py-1">info@bristiii.gallery</li>
              <li className="py-1">+1 (555) 234-5678</li>
              <li className="py-1 leading-relaxed">77 Art Avenue, <br /> Creative District, NY 10012</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gallery-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gallery-muted font-black">
            © 2026 Bristiii Art Gallery. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase text-gallery-muted hover:text-gallery-text transition-colors group font-black"
          >
            Back to Top <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
