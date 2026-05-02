"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Bookmark, Eye, Map } from "lucide-react";

/**
 * 📚 REALISTIC 3D ALBUM BOOK COMPONENT
 * Implements individual page-turning logic with front/back visibility.
 */

export default function CategoryModal({ category, onClose, onMouseEnter, onMouseLeave, onSelectArtwork }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0); 
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");

  if (!category) return null;

  // Prepare the content structure for the book
  const bookPages = useMemo(() => {
    const pages = [];
    pages.push({ type: "cover", title: category.name, artworks: [] });
    const artworks = category.artworks;
    for (let i = 0; i < artworks.length; i += 2) {
      pages.push({ 
        type: "artwork", 
        left: artworks[i], 
        right: artworks[i+1] || null 
      });
    }
    pages.push({ type: "outro", artworks: [] });
    return pages;
  }, [category]);

  const totalSheets = bookPages.length;

  const turnNext = () => {
    if (currentPageIndex < totalSheets - 1 && !isFlipping) {
      setFlipDirection("next");
      setIsFlipping(true);
      setCurrentPageIndex(prev => prev + 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  const turnPrev = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection("prev");
      setIsFlipping(true);
      setCurrentPageIndex(prev => prev - 1);
      setTimeout(() => setIsFlipping(false), 600);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="album-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden bg-black/80 backdrop-blur-lg"
        onClick={onClose}
      >
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[210]">
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center border border-white/10 group shadow-lg"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-6xl h-[85vh] md:h-auto md:aspect-[2.2/1] flex flex-col will-change-transform"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ perspective: "2500px" }}
        >
          {/* 📱 MOBILE VIEW (Scrollable Stack) */}
          <div className="flex md:hidden flex-col w-full h-full bg-[#faf9f6] rounded-[2px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
            
            <div className="px-6 pt-10 pb-6 text-center z-10 border-b border-black/5 shrink-0 relative">
              <p className="text-[9px] tracking-[0.6em] uppercase font-bold text-black/40 mb-2">Volume One</p>
              <h2 className="text-4xl font-serif text-black/80 tracking-wide lowercase italic">{category.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 pb-20 space-y-16 relative z-10">
              {category.artworks.map((artwork, idx) => (
                <div key={idx} className="flex flex-col items-center group cursor-pointer" onClick={() => onSelectArtwork(artwork)}>
                  <div className="relative w-[85%] aspect-[4/5] bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.2)] p-2.5 border border-black/5 mb-6">
                    <div className="relative w-full h-full overflow-hidden bg-gray-50">
                      <Image src={artwork.image} alt={artwork.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-black/80 mb-2">{artwork.title}</h3>
                    <p className="text-[10px] italic text-black/40 font-serif mb-3">{artwork.artist}</p>
                    <div className="flex items-center justify-center gap-2.5">
                       <span className="h-[1px] w-2.5 bg-black/5" />
                       <p className="text-[10px] font-light tracking-[0.2em]" style={{ color: category.color }}>{artwork.price}</p>
                       <span className="h-[1px] w-2.5 bg-black/5" />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-10 pb-6 text-center border-t border-black/5 mt-12">
                <Bookmark size={20} className="text-black/10 mx-auto mb-4" />
                <p className="text-[9px] tracking-widest uppercase text-black/20">The End of the Volume</p>
              </div>
            </div>
          </div>

          {/* 💻 DESKTOP VIEW (The Realistic Book) */}
          <div className="hidden md:flex flex-1 relative w-full h-full preserve-3d">
            
            {/* 🏗️ Book Edge Detail */}
            <div className="absolute inset-y-1 -left-2 w-3 bg-[#d8d4ca] rounded-l-sm border-l border-black/10 z-0" />
            <div className="absolute inset-y-1 -right-2 w-3 bg-[#d8d4ca] rounded-r-sm border-r border-black/10 z-0" />

            {/* Main Book Shell */}
            <div className="w-full h-full bg-[#faf9f6] rounded-[2px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex relative overflow-hidden border-b-[8px] border-black/20">
              
              {/* Paper Grain Overlay */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-50 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')" }} />
              
              {/* 🕯️ Ambient Lighting & Spine Shadow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none z-40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-24 -translate-x-1/2 z-50 pointer-events-none">
                 <div className="w-full h-full bg-gradient-to-r from-transparent via-black/25 to-transparent opacity-60" />
                 <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] -translate-x-1/2 bg-black/10" />
              </div>

              {/* Visual Navigation Guides */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1/5 z-[100] cursor-w-resize group flex items-center justify-start pl-8"
                onClick={turnPrev}
              >
                <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${currentPageIndex === 0 ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-20 group-hover:opacity-100 group-hover:scale-110'}`}>
                   <motion.div
                     animate={{ x: [0, -6, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   >
                      <ChevronLeft size={40} className="text-black" strokeWidth={1} />
                   </motion.div>
                   <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-black rotate-[-90deg] origin-center mt-4">Flip</span>
                </div>
              </div>

              <div 
                className="absolute right-0 top-0 bottom-0 w-1/5 z-[100] cursor-e-resize group flex items-center justify-end pr-8"
                onClick={turnNext}
              >
                <div className={`flex flex-col items-center gap-4 transition-all duration-500 ${currentPageIndex === totalSheets - 1 ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-20 group-hover:opacity-100 group-hover:scale-110'}`}>
                   <motion.div
                     animate={{ x: [0, 6, 0] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   >
                      <ChevronRight size={40} className="text-black" strokeWidth={1} />
                   </motion.div>
                   <span className="text-[8px] tracking-[0.4em] uppercase font-bold text-black rotate-[90deg] origin-center mt-4">Flip</span>
                </div>
              </div>

              {/* 🔄 Dynamic Page Stacks */}
              <div className="flex-1 flex preserve-3d relative">
                 {/* Underneath Content (Static background for current spread) */}
                 {/* 🏗️ Underneath Content (Static background for current spread) */}
                 <div className="absolute inset-0 flex">
                    <div className="flex-1 border-r border-black/5">
                       {/* If flipping next, keep the previous left page visible until finish */}
                       <PageContent 
                          data={isFlipping && flipDirection === "next" ? bookPages[currentPageIndex - 1] : bookPages[currentPageIndex]} 
                          side="left" 
                          categoryColor={category.color} 
                          onSelect={onSelectArtwork} 
                       />
                       {/* Dynamic shadow on stationary left page when flipping prev (reveal) */}
                       {isFlipping && flipDirection === "prev" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black z-10 pointer-events-none"
                          />
                       )}
                    </div>
                    <div className="flex-1 relative">
                       {/* If flipping prev, keep the previous right page visible until finish */}
                       <PageContent 
                          data={isFlipping && flipDirection === "prev" ? bookPages[currentPageIndex + 1] : bookPages[currentPageIndex]} 
                          side="right" 
                          categoryColor={category.color} 
                          onSelect={onSelectArtwork} 
                       />
                       {/* Dynamic shadow on stationary right page when flipping next (reveal) */}
                       {isFlipping && flipDirection === "next" && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black z-10 pointer-events-none"
                          />
                       )}
                    </div>
                 </div>

                 {/* Flipping Page */}
                 {isFlipping && (
                    <motion.div
                      key={currentPageIndex}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flipDirection === "next" ? -180 : 180 }}
                      transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1.0] }}
                      className={`absolute top-0 bottom-0 w-1/2 preserve-3d z-[80] ${
                        flipDirection === "next" ? "right-0 origin-left" : "left-0 origin-right"
                      }`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                       {/* Front Side (The page currently being turned) */}
                       <div className="absolute inset-0 bg-[#faf9f6] backface-hidden">
                          {flipDirection === "next" ? (
                             <div className="w-full h-full border-l border-black/5">
                                <PageContent data={bookPages[currentPageIndex - 1]} side="right" categoryColor={category.color} onSelect={onSelectArtwork} />
                             </div>
                          ) : (
                             <div className="w-full h-full border-r border-black/5">
                                <PageContent data={bookPages[currentPageIndex + 1]} side="left" categoryColor={category.color} onSelect={onSelectArtwork} />
                             </div>
                          )}
                       </div>
                       
                       {/* Back Side (The reveal) */}
                       <div className="absolute inset-0 bg-[#f2f1ee] scale-x-[-1] backface-hidden">
                          {flipDirection === "next" ? (
                             <div className="w-full h-full border-r border-black/5">
                                <PageContent data={bookPages[currentPageIndex]} side="left" categoryColor={category.color} onSelect={onSelectArtwork} />
                             </div>
                          ) : (
                             <div className="w-full h-full border-l border-black/5">
                                <PageContent data={bookPages[currentPageIndex]} side="right" categoryColor={category.color} onSelect={onSelectArtwork} />
                             </div>
                          )}
                          <div className="absolute inset-0 bg-black/5" /> {/* Ambient shadow on backside */}
                       </div>
                    </motion.div>
                 )}
              </div>

              {/* Footer Progress Indicator */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-[110]">
                 {bookPages.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all duration-700 ${i === currentPageIndex ? 'w-10 bg-black/30' : 'w-2 bg-black/10'}`}
                    />
                 ))}
              </div>
            </div>
          </div>

          {/* Catalog Information Label */}
          <div className="hidden md:flex mt-8 justify-between items-end">
             <div className="text-white/40">
                <p className="text-[10px] tracking-[0.5em] uppercase font-bold mb-1">Interactive Catalog</p>
                <div className="flex items-center gap-3">
                   <h3 className="text-xl font-serif italic text-white/80">{category.name}</h3>
                   <span className="w-8 h-[1px] bg-white/20" />
                   <p className="text-xs tracking-widest text-white/30 uppercase">Page {currentPageIndex + 1} of {totalSheets}</p>
                </div>
             </div>
             <div className="flex items-center gap-6 text-white/20 text-[10px] tracking-widest uppercase italic">
                <span>Click edges to turn</span>
                <Map size={14} />
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 📄 PAGE CONTENT HELPER
 */
function PageContent({ data, side, categoryColor, onSelect }) {
  if (!data) return null;

  // Cover Page
  if (data.type === "cover") {
      if (side === "left") {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 bg-[#eeebe5] shadow-inner">
             <div className="w-12 h-16 md:w-16 md:h-24 border-2 border-black/10 flex items-center justify-center mb-4 md:mb-6">
                <Bookmark size={24} className="text-black/5 md:w-8 md:h-8" strokeWidth={1} />
             </div>
             <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-2">Established 2026</p>
             <p className="text-[9px] tracking-widest uppercase text-black/20 text-center leading-loose">
                Archive of Visual Explorations <br /> Limited Digital Edition
             </p>
          </div>
        );
     }
     return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/[0.02] to-transparent pointer-events-none" />
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1 }}
             className="text-center z-10"
           >
              <p className="text-[9px] md:text-[11px] tracking-[0.6em] uppercase font-bold text-black/40 mb-2 md:mb-4">Volume One</p>
              <h2 className="text-2xl md:text-6xl font-serif text-black/80 tracking-wide mb-4 md:mb-8 lowercase italic">{data.title}</h2>
              <div className="w-16 md:w-24 h-[2px] mx-auto bg-black/10 mb-4 md:mb-8" />
              <p className="text-[8px] md:text-xs tracking-[0.3em] uppercase text-black/30">Curated Collection</p>
           </motion.div>
        </div>
     );
  }

  // Final Page
  if (data.type === "outro") {
     if (side === "left") {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
             <div className="max-w-xs text-center">
                <h4 className="text-lg md:text-xl font-serif italic text-black/60 mb-4 md:mb-6">A Note</h4>
                <p className="text-[8px] md:text-[11px] leading-relaxed text-black/30 font-light uppercase tracking-widest">
                   Every piece in this collection has been selected for its unique contribution.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-black/5" />
                   <div className="w-2 h-2 rounded-full bg-black/5" />
                   <div className="w-2 h-2 rounded-full bg-black/5" />
                </div>
             </div>
          </div>
        );
     }
     return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 bg-[#eeebe5] shadow-inner">
           <div className="text-center">
              <p className="text-[8px] md:text-[10px] tracking-[0.5em] uppercase text-black/20 font-bold mb-4">Finis</p>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-black/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
                 <Bookmark size={16} className="text-black/10 md:w-5 md:h-5" />
              </div>
              <p className="text-[9px] tracking-widest uppercase text-black/20">The End of the Volume</p>
           </div>
        </div>
     );
  }

  // Artwork Spread
  const artwork = side === "left" ? data.left : data.right;
  if (!artwork) return null;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-12 relative group cursor-pointer" onClick={() => onSelect(artwork)}>
       <div className="flex-1 flex flex-col items-center justify-center">
          {/* Minimalist & Small Image Frame */}
          <div className="relative w-[55%] aspect-[4/5] md:aspect-[3/4] bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] p-2.5 md:p-3.5 border border-black/5 transition-all duration-700">
             <div className="relative w-full h-full overflow-hidden bg-gray-50">
                <Image
                   src={artwork.image}
                   alt={artwork.title}
                   fill
                   priority
                   onLoadingComplete={(img) => img.classList.remove('opacity-0')}
                   className="object-cover transition-all duration-1000 group-hover:scale-110 opacity-0"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                   <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <span className="px-6 py-3 bg-white/95 backdrop-blur-md text-[10px] font-bold tracking-[0.4em] uppercase text-black border border-black/5 shadow-2xl">
                        View
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* Artwork Info - Subtle & Centered */}
          <div className="mt-8 text-center space-y-1 opacity-60 group-hover:opacity-100 transition-opacity">
             <h3 className="text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase text-black/80">{artwork.title}</h3>
             <p className="text-[8px] md:text-[9px] italic text-black/30 font-serif">{artwork.artist}</p>
             <div className="flex items-center justify-center gap-2.5 pt-2">
                <span className="h-[1px] w-2.5 bg-black/5" />
                <p className="text-[9px] font-light tracking-[0.2em]" style={{ color: categoryColor }}>{artwork.price}</p>
                <span className="h-[1px] w-2.5 bg-black/5" />
             </div>
          </div>
       </div>

       {/* Subtler Corner Shadow */}
       <div className={`absolute bottom-0 ${side === 'left' ? 'left-0 bg-gradient-to-tr' : 'right-0 bg-gradient-to-tl'} from-black/[0.015] to-transparent w-16 h-16 pointer-events-none`} />
    </div>
  );
}
