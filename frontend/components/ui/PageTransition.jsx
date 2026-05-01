"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Skip animation on first page load to prevent flashing
  const shouldAnimate = !isFirstRender.current;
  
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial={shouldAnimate ? "initial" : false}
        animate="animate"
        exit="exit"
        className="w-full flex-1 flex flex-col bg-gallery-bg"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
