"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function ConditionalShell({ children }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname?.startsWith("/forgot-password") || pathname?.startsWith("/reset-password");

  // Render consistently on server and client to prevent hydration mismatch
  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="flex-1 min-h-screen bg-gallery-bg">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
