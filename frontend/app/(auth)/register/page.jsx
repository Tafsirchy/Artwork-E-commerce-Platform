"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Registration successful!", { style: { backgroundColor: "#4CAF50", color: "#fff" } });
      router.push("/products");
    } catch (error) {
      toast.error(error.message || "Registration failed", { style: { backgroundColor: "#EF4444", color: "#fff" } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gallery-bg">
      <div className="w-full max-w-md p-8 bg-gallery-surface rounded-lg border border-gallery-border shadow-lg">
        <h2 className="text-3xl font-light text-center text-gallery-text mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gallery-muted mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gallery-border rounded focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-muted mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gallery-border rounded focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gallery-muted mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gallery-border rounded focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gallery-primary text-white rounded transition-colors hover:bg-black disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gallery-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-gallery-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
