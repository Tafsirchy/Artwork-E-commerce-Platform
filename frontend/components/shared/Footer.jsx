"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gallery-surface pt-24 pb-12 border-t border-gallery-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-light tracking-[0.3em] text-gallery-text block mb-8">
              BRISTIII
            </Link>
            <p className="text-gallery-muted text-sm leading-relaxed mb-8 max-w-xs">
              A curated digital space connecting visionary artists with global collectors. Experience the soul of contemporary art.
            </p>
            <div className="flex gap-5 text-gallery-muted">
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-gallery-accent transition-colors"><Facebook size={20} /></Link>
            </div>
          </div>

          {/* Shop Col */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gallery-text font-semibold mb-8">Collection</h4>
            <ul className="space-y-4 text-sm text-gallery-muted">
              <li><Link href="/products" className="hover:text-gallery-text transition-colors">All Artworks</Link></li>
              <li><Link href="/products?category=Abstract" className="hover:text-gallery-text transition-colors">Abstract Pieces</Link></li>
              <li><Link href="/products?category=Minimalism" className="hover:text-gallery-text transition-colors">Minimalist Works</Link></li>
              <li><Link href="/products?category=Digital Art" className="hover:text-gallery-text transition-colors">Digital Editions</Link></li>
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gallery-text font-semibold mb-8">Information</h4>
            <ul className="space-y-4 text-sm text-gallery-muted">
              <li><Link href="/about" className="hover:text-gallery-text transition-colors">About the Gallery</Link></li>
              <li><Link href="/shipping" className="hover:text-gallery-text transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-gallery-text transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gallery-text transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-gallery-text font-semibold mb-8">Visit Us</h4>
            <ul className="space-y-4 text-sm text-gallery-muted">
              <li>info@bristiii.gallery</li>
              <li>+1 (555) 234-5678</li>
              <li>77 Art Avenue, <br /> Creative District, NY 10012</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gallery-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gallery-muted">
            © 2026 Bristiii Art Gallery. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gallery-muted hover:text-gallery-text transition-colors group"
          >
            Back to Top <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
