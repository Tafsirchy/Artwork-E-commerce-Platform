import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const usePromotionStore = create(
  persist(
    (set) => ({
      isSliderVisible: true,
      globalDiscount: 0,
      offers: [],
      
      toggleSlider: () => set((state) => ({ isSliderVisible: !state.isSliderVisible })),
      setGlobalDiscount: (val) => set({ globalDiscount: val }),
      
      fetchPromotions: async () => {
        try {
          const { data } = await api.get('/promotions');
          set({ offers: data });
        } catch (error) {
          console.error("Failed to fetch promotions", error);
        }
      },

      updateOffers: (newOffers) => set({ offers: newOffers }),
    }),
    {
      name: 'bristiii-promotions',
    }
  )
);

export default usePromotionStore;
