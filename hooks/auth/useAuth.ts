'use client'

import { apiClient } from '@/lib/axiosClient'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import type { User } from '@/types/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const AUTH_QUERY_KEY = ['auth', 'me']

export function useAuth() {
    const queryClient = useQueryClient()
    const router = useRouter()

    // ─── Core auth state ──────────────────────────────────────────────
    const {
        data: user,
        isLoading,
        isFetching,
    } = useQuery<User | null>({
        queryKey: AUTH_QUERY_KEY,

        queryFn: async () => {
            try {
                // Backend with httpOnly cookies will send user data if auth is valid
                const res = await userService.getMe()
                return res.data as User
            } catch (error: any) {
                // If unauthorized or refresh failed, return null instead of throwing
                if (error.response?.status === 401 || error.response?.status === 404) {
                    return null
                }
                throw error
            }
        },

        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: true,
    })

    // ─── Derived state ────────────────────────────────────────────────
    const isAuthenticated = !!user
    const isVerified = user?.isVerified ?? false

    // ─── Actions ──────────────────────────────────────────────────────

    // Call this after successful sign-in/sign-up/OTP to update cache
    const setUser = (userData: User) => {
        queryClient.setQueryData(AUTH_QUERY_KEY, userData)
    }

    const logout = async () => {
        try {
            await authService.logout()
        } finally {
            queryClient.setQueryData(AUTH_QUERY_KEY, null)
            queryClient.clear()
            router.replace('/sign-in')
        }
    }

    return {
        // state
        user: user ?? null,
        isLoading,
        isFetching,

        // derived
        isAuthenticated,
        isVerified,

        // actions
        setUser,
        logout,
    }
}