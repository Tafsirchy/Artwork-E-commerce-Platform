import { create } from "zustand";
import { persist } from "zustand/middleware";
import api, { setAuthToken } from "../lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          setAuthToken(data.token);
          set({ user: data, token: data.token, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/register", { name, email, password, phone });
          setAuthToken(data.token);
          set({ user: data, token: data.token, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null, error: null });
      },
    }),
    {
      name: "auth-storage",
      version: 1,
      migrate: (persistedState) => ({
        user: persistedState?.user ?? null,
        token: persistedState?.token ?? null,
        isLoading: false,
        error: null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);

export default useAuthStore;
