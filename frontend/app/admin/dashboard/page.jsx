"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import Link from "next/link";
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // In a real app, you'd have an aggregate API endpoint.
      // Here we fetch arrays and compute to keep it simple.
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);
      
      const revenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
      
      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        users: 10, // Mock for now
        revenue: revenue,
      });
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gallery-bg p-8">
      <h1 className="text-4xl font-light text-gallery-text mb-10">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Revenue</p>
            <p className="text-3xl font-light text-gallery-text">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Orders</p>
            <p className="text-3xl font-light text-gallery-text">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Products</p>
            <p className="text-3xl font-light text-gallery-text">{stats.products}</p>
          </div>
        </div>

        <div className="bg-gallery-surface p-6 border border-gallery-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gallery-soft text-gallery-primary rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gallery-muted text-sm uppercase tracking-wider">Users</p>
            <p className="text-3xl font-light text-gallery-text">{stats.users}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/admin/orders" className="block p-8 bg-gallery-surface border border-gallery-border shadow-sm hover:border-gallery-primary transition-colors">
          <h2 className="text-2xl font-light text-gallery-text mb-2">Manage Orders</h2>
          <p className="text-gallery-muted">View and update order statuses, generate invoices.</p>
        </Link>
        <Link href="/admin/products" className="block p-8 bg-gallery-surface border border-gallery-border shadow-sm hover:border-gallery-primary transition-colors">
          <h2 className="text-2xl font-light text-gallery-text mb-2">Manage Products</h2>
          <p className="text-gallery-muted">Add new artwork, edit details, and track inventory.</p>
        </Link>
      </div>
    </div>
  );
}
