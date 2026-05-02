"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore";
import { toast } from "react-toastify";

// Defined at module scope — this array never changes, so there is no reason
// to recreate it on every Navbar render (which happens on every pathname change).
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollTimeout = useRef(null);
  const isHoveredRef = useRef(false);
  const { user, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const pathname = usePathname();
  const router = useRouter();

  const mobileOpenRef = useRef(mobileOpen);
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      // 🚀 Mobile Fix: If mobile menu is open, don't trigger the hide-on-scroll logic
      if (mobileOpenRef.current) return;

      scrollTimeout.current = setTimeout(() => {
        if (window.scrollY > 100 && !isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );
  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    router.push("/");
  };

  const navLinks = NAV_LINKS;

  return (
    <header
      onMouseEnter={() => {
        isHoveredRef.current = true;
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        // 🚀 Mobile Fix: If mobile menu is open, stay visible even on mouse leave
        if (window.scrollY > 100 && !mobileOpen) {
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => setIsVisible(false), 800);
        }
      }}
      className={`fixed top-0 left-0 right-0 z-[100] bg-gallery-surface/95 backdrop-blur-sm border-b border-gallery-border transition-all duration-300 ${(isVisible || mobileOpen) ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-light tracking-[0.4em] text-gallery-text hover:text-gallery-accent transition-all">
          BRISTIII
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors ${isActive
                  ? "text-gallery-accent border-b border-gallery-accent pb-0.5"
                  : "text-gallery-muted hover:text-gallery-text"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link href="/wishlist" className={`relative text-gallery-muted hover:text-red-400 transition-colors ${pathname.startsWith("/wishlist") ? "text-gallery-accent" : ""}`}>
            <Heart size={21} className={wishlistCount > 0 ? "fill-red-400 stroke-red-400" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-gallery-text text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className={`relative text-gallery-muted hover:text-gallery-text transition-colors ${pathname.startsWith("/cart") ? "text-gallery-accent" : ""}`}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gallery-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-4 border-l border-gallery-border pl-6 ml-2">
              <Link
                href="/dashboard"
                className={`text-sm tracking-wider uppercase transition-colors ${pathname.startsWith("/dashboard")
                  ? "text-gallery-accent border-b border-gallery-accent pb-0.5"
                  : "text-gallery-muted hover:text-gallery-text"}`}
              >
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className={`text-sm tracking-wider uppercase transition-colors ${pathname.startsWith("/admin")
                    ? "text-gallery-accent border-b border-gallery-accent pb-0.5"
                    : "text-gallery-muted hover:text-gallery-text"}`}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gallery-muted hover:text-gallery-text tracking-wider uppercase transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 border-l border-gallery-border pl-6 ml-2">
              <Link href="/login" className="text-sm text-gallery-muted hover:text-gallery-text tracking-wider uppercase transition-colors">
                Login
              </Link>
              <Link href="/register" className="group relative text-sm px-6 py-2 bg-gallery-primary text-white rounded-none overflow-hidden transition-all tracking-wider uppercase">
                <span className="relative z-10">Join</span>
                <div className="absolute inset-0 bg-gallery-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gallery-muted hover:text-gallery-text ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-gallery-surface border-t border-gallery-border overflow-hidden"
          >
            <div className="px-6 py-10 flex flex-col gap-2">
              {navLinks.map(link => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base tracking-[0.2em] uppercase transition-colors h-12 flex items-center justify-between group ${isActive ? "text-gallery-accent font-black" : "text-gallery-muted"
                      }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="w-1.5 h-1.5 rounded-full bg-gallery-gold"
                      />
                    )}
                  </Link>
                );
              })}

              <div className="h-px bg-gallery-border w-12 my-4" />

              <Link
                href="/wishlist"
                className={`text-base tracking-[0.2em] uppercase h-12 flex items-center justify-between ${pathname.startsWith("/wishlist") ? "text-gallery-accent font-black" : "text-gallery-muted"}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>Wishlist ({wishlistCount})</span>
                {pathname.startsWith("/wishlist") && <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold" />}
              </Link>
              <Link
                href="/cart"
                className={`text-base tracking-[0.2em] uppercase h-12 flex items-center justify-between ${pathname.startsWith("/cart") ? "text-gallery-accent font-black" : "text-gallery-muted"}`}
                onClick={() => setMobileOpen(false)}
              >
                <span>Cart ({cartCount})</span>
                {pathname.startsWith("/cart") && <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold" />}
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-base tracking-[0.2em] uppercase h-12 flex items-center justify-between ${pathname.startsWith("/dashboard") ? "text-gallery-accent font-black" : "text-gallery-muted"}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>My Dashboard</span>
                    {pathname.startsWith("/dashboard") && <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold" />}
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className={`text-base tracking-[0.2em] uppercase h-12 flex items-center justify-between ${pathname.startsWith("/admin") ? "text-gallery-accent font-black" : "text-gallery-muted"}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>Admin Panel</span>
                      {pathname.startsWith("/admin") && <div className="w-1.5 h-1.5 rounded-full bg-gallery-gold" />}
                    </Link>
                  )}
                  {/* 🚀 Distinct Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="mt-4 flex items-center justify-center h-14 border border-red-100 text-red-400 text-sm tracking-[0.3em] uppercase font-black bg-red-50/30 active:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/login"
                    className="flex items-center justify-center h-14 border border-gallery-border text-gallery-text text-sm tracking-[0.3em] uppercase font-black active:bg-gallery-soft transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center h-14 bg-gallery-primary text-white text-sm tracking-[0.3em] uppercase font-black shadow-xl active:scale-95 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
