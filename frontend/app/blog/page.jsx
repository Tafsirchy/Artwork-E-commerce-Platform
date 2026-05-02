import React from "react";
import api from "@/lib/api";
import BlogListClient from "@/components/blog/BlogListClient";

// 🚀 PHASE 3: Streaming & Server-Side Fetching
// This is now a Server Component. Next.js will execute this on the server.
export default async function BlogPage() {
  let posts = [];
  try {
    const res = await api.get("/blogs");
    if (res.data && res.data.success) {
      posts = res.data.data;
    } else {
      console.warn("⚠️ Blog API returned success:false or malformed data");
    }
  } catch (error) {
    console.error("❌ SERVER-SIDE BLOG FETCH FAILED:");
    console.error(`- URL: ${process.env.NEXT_PUBLIC_API_URL}/blogs`);
    console.error(`- Error: ${error.message}`);
    if (error.response) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Data: ${JSON.stringify(error.response.data)}`);
    }
  }

  return (
    <main className="bg-gallery-bg min-h-screen">
      {/* Pass data to the Client Component. If posts is empty, the client will attempt a re-fetch. */}
      <BlogListClient initialPosts={posts} />
    </main>
  );
}
