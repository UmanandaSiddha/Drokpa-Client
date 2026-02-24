'use client'

import React from 'react'

interface LoadingComponentProps {
    fullPage?: boolean
    message?: string
    size?: 'small' | 'medium' | 'large'
}

export function LoadingComponent({
    fullPage = false,
    message = 'Loading...',
    size = 'medium',
}: LoadingComponentProps) {
    const sizeMap = {
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
    }

    const loaderSize = sizeMap[size]

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Animated spinner */}
            <div className="relative">
                <div
                    className={`${loaderSize} rounded-full border-4 border-[#DDE7E0] border-t-[#FC611E] border-r-[#4F87C7] animate-spin`}
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-[#FC611E]/30 blur-sm animate-spin" />
            </div>

            {/* Message */}
            {message && (
                <p
                    className="text-center text-[#686766] font-medium text-sm sm:text-base"
                    style={{
                        fontFamily: 'var(--font-mona-sans), sans-serif',
                    }}
                >
                    {message}
                </p>
            )}

            {/* Animated dots */}
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#FC611E]"
                        style={{
                            animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                    />
                ))}
            </div>
        </div>
    )

    if (fullPage) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white flex items-center justify-center px-4">
                {/* Decorative blobs */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />
                </div>

                <div className="relative z-10">{content}</div>
            </div>
        )
    }

    return content
}

export default LoadingComponent
