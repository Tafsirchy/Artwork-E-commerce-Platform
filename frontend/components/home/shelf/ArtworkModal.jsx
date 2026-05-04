"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, ChevronRight } from "lucide-react";
export default function ArtworkModal({ artwork, onClose }) {
  const router = useRouter();

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="artwork-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

        <motion.div
          key="artwork-modal-card"
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="relative z-10 w-full  flex flex-col md:flex-row bg-[#0e0e0e] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative w-full md:w-[55%] min-h-[320px] md:min-h-[500px] bg-black flex items-center justify-center overflow-hidden">
            <motion.div
              className="absolute inset-0 w-full h-full"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-contain p-6 md:p-10"
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="w-full md:w-[45%] p-6 md:p-12 flex flex-col justify-center bg-[#141414]">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-5 block"
            >
              Original Artwork
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-light text-white font-serif mb-3 leading-tight"
            >
              {artwork.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm  text-white/50 mb-10"
            >
              By {artwork.artist}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-light text-white mb-12"
            >
              {artwork.price}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-3"
            >
              <button
                onClick={() => {
                  router.push(`/products/${artwork._id || artwork.id}`);
                  onClose();
                }}
                className="w-full py-5 md:py-4 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 text-xs md:text-[10px] tracking-[0.3em] uppercase transition-colors active:scale-95"
              >
                View Masterpiece Details
                <ChevronRight size={12} />
              </button>
            </motion.div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 w-11 h-11 md:w-9 md:h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-full bg-black/20 md:bg-transparent"
          >
            <X size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
