"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const AUTH_PATHS = ["/login", "/register"];
const AUTH_PREFIXES = ["/forgot-password", "/reset-password"];

function isAuthRoute(pathname) {
  if (!pathname) return false;
  if (AUTH_PATHS.includes(pathname)) return true;
  return AUTH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = isAuthRoute(pathname);

  return (
    <>
      {/* Keep Navbar/Footer mounted at all times to prevent remount flashes.
          Use CSS to hide them on auth pages instead of conditional rendering. */}
      <div aria-hidden={isAuthPage || undefined} style={isAuthPage ? { display: "none" } : undefined}>
        <Navbar />
        {/* Spacer for fixed Navbar */}
        <div className="h-20" />
      </div>

      {/* No extra wrapper div — children are already wrapped by PageTransition */}
      {children}

      <div aria-hidden={isAuthPage || undefined} style={isAuthPage ? { display: "none" } : undefined}>
        <Footer />
      </div>
    </>
  );
}
