'use client'

import { ReactNode, Suspense } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { ProtectedRoute } from './ProtectedRoute'
import { ToastProvider } from '@/hooks/useToast'

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Suspense fallback={null}>
                    <ProtectedRoute>
                        {children}
                    </ProtectedRoute>
                </Suspense>
            </ToastProvider>
        </QueryClientProvider>
    )
}