"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { toast } from "react-toastify";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { label: "Gallery", href: "/products" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gallery-surface/95 backdrop-blur-sm border-b border-gallery-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-light tracking-[0.2em] text-gallery-text hover:text-gallery-accent transition-colors">
          BRISTIII
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase transition-colors ${
                pathname === link.href 
                  ? "text-gallery-accent border-b border-gallery-accent pb-0.5" 
                  : "text-gallery-muted hover:text-gallery-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
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
            <div className="hidden md:flex items-center gap-4">
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
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm text-gallery-muted hover:text-gallery-text tracking-wider uppercase transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm px-4 py-2 bg-gallery-primary text-white rounded hover:bg-black transition-colors tracking-wider uppercase">
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gallery-muted hover:text-gallery-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gallery-surface border-t border-gallery-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gallery-muted text-sm tracking-widest uppercase hover:text-gallery-text transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin/dashboard" className="text-gallery-muted text-sm tracking-widest uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-left text-gallery-muted text-sm tracking-widest uppercase hover:text-gallery-text">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gallery-muted text-sm tracking-widest uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="text-gallery-muted text-sm tracking-widest uppercase hover:text-gallery-text" onClick={() => setMobileOpen(false)}>Join</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
