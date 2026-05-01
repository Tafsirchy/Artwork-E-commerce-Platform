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
  const { user, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        if (window.scrollY > 100) {
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
      className={`fixed top-0 left-0 right-0 z-[100] bg-gallery-surface/95 backdrop-blur-sm border-b border-gallery-border transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-light tracking-[0.4em] text-gallery-text hover:text-gallery-accent transition-all">
          BRISTIII
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase transition-colors ${pathname === link.href
                ? "text-gallery-accent border-b border-gallery-accent pb-0.5"
                : "text-gallery-muted hover:text-gallery-text"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative text-gallery-muted hover:text-red-400 transition-colors">
            <Heart size={21} className={wishlistCount > 0 ? "fill-red-400 stroke-red-400" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-gallery-text text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-gallery-muted hover:text-gallery-text transition-colors">
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
              <Link href="/dashboard" className="text-sm text-gallery-muted hover:text-gallery-text tracking-wider uppercase transition-colors">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="text-sm text-gallery-muted hover:text-gallery-text tracking-wider uppercase transition-colors">
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
            className="md:hidden bg-gallery-surface border-t border-gallery-border px-6 py-8 flex flex-col gap-6 overflow-hidden"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-gallery-border w-12" />
            <Link href="/wishlist" className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-red-400 transition-colors" onClick={() => setMobileOpen(false)}>
              Wishlist ({wishlistCount})
            </Link>
            <Link href="/cart" className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text transition-colors" onClick={() => setMobileOpen(false)}>
              Cart ({cartCount})
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>
                  My Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin/dashboard" className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-6 mt-4">
                <Link href="/login" className="text-gallery-muted text-sm tracking-[0.3em] uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="text-gallery-accent text-sm tracking-[0.3em] uppercase font-bold" onClick={() => setMobileOpen(false)}>Join Now</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
