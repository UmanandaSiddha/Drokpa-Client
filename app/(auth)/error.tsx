'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw, ArrowLeft } from 'lucide-react'

interface AuthErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function AuthError({ error, reset }: AuthErrorProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        console.error('Auth error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white overflow-hidden">
            {/* Decorative blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
                <div className="w-full max-w-lg">
                    {/* Error Icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FC611E]/10 mb-6">
                            <AlertTriangle className="w-8 h-8 text-[#FC611E]" />
                        </div>
                    </div>

                    {/* Headings */}
                    <div className="text-center mb-8">
                        <h1
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight"
                            style={{
                                fontFamily: 'var(--font-subjectivity), sans-serif',
                                color: '#27261C',
                                letterSpacing: '-0.05em',
                            }}
                        >
                            Authentication Error
                        </h1>
                        <p
                            className="text-sm sm:text-base text-[#686766]"
                            style={{
                                fontFamily: 'var(--font-mona-sans), sans-serif',
                                fontWeight: 500,
                                lineHeight: '1.6',
                            }}
                        >
                            Something went wrong during authentication. Please try again or use a different method.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 mb-8">
                        <button
                            onClick={reset}
                            className="w-full px-6 py-3 bg-[#FC611E] hover:bg-[#f46a2f] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                        >
                            <RotateCw className="w-4 h-4" />
                            Try Again
                        </button>

                        <Link href="/sign-in">
                            <button
                                className="w-full px-6 py-3 border-2 border-[#DDE7E0] text-[#27261C] font-semibold rounded-full hover:border-[#FC611E] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </button>
                        </Link>
                    </div>

                    {/* Error Details (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-white rounded-2xl p-6 border border-[#DDE7E0]">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full text-left"
                            >
                                <p
                                    className="text-xs font-semibold text-[#686766] uppercase tracking-widest"
                                    style={{ fontFamily: 'var(--font-subjectivity), sans-serif' }}
                                >
                                    {isExpanded ? '▼' : '▶'} Error Details
                                </p>
                            </button>

                            {isExpanded && (
                                <div className="space-y-3 mt-4 pt-4 border-t border-[#DDE7E0]">
                                    <div>
                                        <p
                                            className="text-xs font-semibold text-[#686766] uppercase mb-2"
                                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                                        >
                                            Message
                                        </p>
                                        <pre
                                            className="bg-[#F6F6F6] p-3 rounded-lg text-xs text-[#27261C] overflow-auto max-h-32"
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            {error.message}
                                        </pre>
                                    </div>

                                    {error.digest && (
                                        <div>
                                            <p
                                                className="text-xs font-semibold text-[#686766] uppercase mb-2"
                                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                                            >
                                                Error ID
                                            </p>
                                            <pre
                                                className="bg-[#F6F6F6] p-3 rounded-lg text-xs text-[#27261C] overflow-auto"
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                {error.digest}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
