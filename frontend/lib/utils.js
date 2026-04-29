import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DEFAULT_IMAGE_FALLBACK = "https://placehold.co/1200x1500/png?text=Bristiii+Artwork";

export function getValidImageSrc(imageSrc, fallback = DEFAULT_IMAGE_FALLBACK) {
  if (!imageSrc || typeof imageSrc !== "string") {
    return fallback;
  }

  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://") || imageSrc.startsWith("/")) {
    return imageSrc;
  }

  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${imageSrc}`;
}
