import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/auth";

// ──────────────────────────────────────────────
// Auth Store State & Actions
// ──────────────────────────────────────────────

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthActions {
    setUser: (user: User | null) => void;
    logout: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

// ──────────────────────────────────────────────
// Zustand Store with Persistence
// ──────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            setIsLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
