import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of products

      addToWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.find(item => item._id === product._id);
        
        if (!exists) {
          set({ items: [...currentItems, product] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter(item => item._id !== productId) });
      },

      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.find(item => item._id === product._id);
        
        if (exists) {
          get().removeFromWishlist(product._id);
          return false; // Removed
        } else {
          get().addToWishlist(product);
          return true; // Added
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      }
    }),
    {
      name: "wishlist-storage",
    }
  )
);

export default useWishlistStore;
