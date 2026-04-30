"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Eye } from "lucide-react";
import ArtworkModal from "./ArtworkModal";

export default function CategoryModal({ category, onClose }) {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  if (!category) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="category-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        {/* Frosted Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" />

        <motion.div
          key="category-modal-panel"
          initial={{ opacity: 0, scale: 0.94, x: category.direction === "left" ? -40 : 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.94, x: category.direction === "left" ? -40 : 40 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#faf9f7] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ borderTop: `4px solid ${category.color}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-black/5">
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-black/30 mb-1">
                The Collection
              </p>
              <h2 className="text-3xl font-light font-serif text-black/80 tracking-wide">
                {category.name}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-black/30 tracking-widest">
                {category.artworks.length} works
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-black/10 text-black/40 hover:text-black hover:border-black/30 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Artwork Grid */}
          <div className="overflow-y-auto p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {category.artworks.map((artwork, i) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ede8] mb-3 shadow-sm">
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-[10px] tracking-[0.2em] uppercase font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
                          <Eye size={14} /> See the Art
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <p className="text-xs font-medium text-black/70 tracking-wide uppercase">
                    {artwork.title}
                  </p>
                  <p className="text-[11px] text-black/40 italic mb-1">
                    {artwork.artist}
                  </p>
                  <p className="text-sm font-light" style={{ color: category.color }}>
                    {artwork.price}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Level 3 — Artwork Lightbox */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </AnimatePresence>
  );
}
