"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <motion.div
      // Use the same stable keying strategy to prevent internal home-to-home flashes
      key={pathname === "/" ? "home-root" : pathname}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ width: "100%", minHeight: "inherit" }}
    >
      {children}
    </motion.div>
  );
}
