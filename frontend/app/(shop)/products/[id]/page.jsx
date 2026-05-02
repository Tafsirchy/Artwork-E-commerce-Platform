import api from "@/lib/api";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";

// 🚀 PHASE 3: Streaming & Server-Side Fetching
// This Server Component fetches data during the request phase, 
// allowing Next.js to stream the loading skeleton immediately.
export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    const { data } = await api.get(`/products/${id}`);
    product = data;
  } catch (error) {
    console.error("Failed to fetch product on server:", error);
  }

  return <ProductDetailsClient product={product} />;
}
