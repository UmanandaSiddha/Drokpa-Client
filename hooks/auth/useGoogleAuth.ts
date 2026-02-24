'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { signInWithPopup } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { firebaseAuth, googleProvider } from '@/lib/firebase'
import { authService } from '@/services/auth.service'
import { useAuth } from './useAuth'
import { useToast } from '@/hooks/useToast'
import { resetRefreshTokenState } from '@/lib/axiosClient'

export function useGoogleAuth() {
    const { setUser } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { addToast } = useToast()

    // Holds state when backend says isNewUser — triggers the modal
    const [pendingGoogleUser, setPendingGoogleUser] = useState<{
        idToken: string
        email: string
        prefill: { firstName: string; lastName: string }
    } | null>(null)

    const from = (() => {
        const raw = searchParams.get('from')
        return raw?.startsWith('/') ? raw : '/account'
    })()

    const { mutate: triggerGoogleAuth, isPending } = useMutation({
        mutationFn: async () => {
            // Firebase popup — gets us the idToken
            const result = await signInWithPopup(firebaseAuth, googleProvider)
            const idToken = await result.user.getIdToken()

            const nameParts = result.user.displayName?.split(' ') ?? []
            const firstName = nameParts[0] ?? ''
            const lastName = nameParts.slice(1).join(' ') ?? ''

            // Send idToken to our backend
            const res = await authService.googleAuth(idToken, firstName, lastName)
            return { res, idToken, firstName, lastName }
        },

        onSuccess: ({ res, idToken, firstName, lastName }) => {
            if (res.data.isNewUser) {
                // Backend couldn't resolve a name — show modal
                setPendingGoogleUser({
                    idToken,
                    email: res.data.email,
                    prefill: { firstName, lastName },
                })
                return
            }

            // Reset refresh token state for new session
            resetRefreshTokenState();

            // Existing or newly created user — cookies already set by backend
            setUser(res.data.data)
            addToast({ title: 'Welcome!', message: 'Signed in with Google', type: 'success' })
            router.replace(from)
        },

        onError: (error: any) => {
            // User closed the popup — don't show an error
            if (error?.code === 'auth/popup-closed-by-user') return

            addToast({
                title: 'Google Sign In Failed',
                message: error?.response?.data?.message ?? 'Something went wrong',
                type: 'error',
            })
        },
    })

    // Called from the modal after user fills in their name
    const { mutate: completeGoogleSignUp, isPending: isCompletingSignUp } = useMutation({
        mutationFn: async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
            if (!pendingGoogleUser) throw new Error('No pending Google user')
            return authService.googleAuth(pendingGoogleUser.idToken, firstName, lastName)
        },

        onSuccess: (res) => {
            if (res.data.isNewUser) return;

            // Reset refresh token state for new session
            resetRefreshTokenState();

            setUser(res.data.data)
            setPendingGoogleUser(null)
            addToast({ title: 'Welcome!', message: 'Account created successfully', type: 'success' })
            router.replace(from)
        },

        onError: (error: any) => {
            addToast({
                title: 'Sign Up Failed',
                message: error?.response?.data?.message ?? 'Something went wrong',
                type: 'error',
            })
        },
    })

    return {
        triggerGoogleAuth,
        completeGoogleSignUp,
        isPending,
        isCompletingSignUp,
        pendingGoogleUser,       // non-null = show the modal
        clearPendingGoogleUser: () => setPendingGoogleUser(null),
    }
}