import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";
import useAuthStore from "./authStore";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of { product: { _id, title, price, imageUrl }, quantity }
      isLoading: false,

      fetchCart: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return; // Guest users rely on local storage only
        
        set({ isLoading: true });
        try {
          const { data } = await api.get("/cart");
          set({ items: data.items, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error("Failed to fetch cart", error);
        }
      },

      addToCart: async (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product._id === product._id);
        
        let newItems;
        if (existingItem) {
          newItems = currentItems.map(item => 
            item.product._id === product._id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...currentItems, { product, quantity }];
        }
        
        set({ items: newItems });
        get().syncCart(newItems);
      },

      removeFromCart: async (productId) => {
        const newItems = get().items.filter(item => item.product._id !== productId);
        set({ items: newItems });
        get().syncCart(newItems);
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return;
        const newItems = get().items.map(item => 
          item.product._id === productId 
            ? { ...item, quantity }
            : item
        );
        set({ items: newItems });
        get().syncCart(newItems);
      },

      clearCart: async () => {
        set({ items: [] });
        get().syncCart([]);
      },

      syncCart: async (items) => {
        const { token } = useAuthStore.getState();
        if (!token) return; // Only sync to DB if logged in
        
        // Map frontend structure back to expected backend structure { product: id, quantity }
        const formattedItems = items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        }));
        
        try {
          await api.post("/cart", { items: formattedItems });
        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
