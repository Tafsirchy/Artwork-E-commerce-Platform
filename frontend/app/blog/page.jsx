import React from "react";
import api from "@/lib/api";
import BlogListClient from "@/components/blog/BlogListClient";

// 🚀 PHASE 3: Streaming & Server-Side Fetching
// This is now a Server Component. Next.js will execute this on the server.
export default async function BlogPage() {
  let posts = [];
  try {
    // Fetch data directly on the server before rendering
    const res = await api.get("/blogs");
    if (res.data && res.data.success) {
      posts = res.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch blogs on server:", error);
  }

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Pass data to the Client Component for interactive features & animations */}
      <BlogListClient initialPosts={posts} />
    </main>
  );
}
