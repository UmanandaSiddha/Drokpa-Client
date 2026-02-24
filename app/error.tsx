'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RotateCw, Mail } from 'lucide-react'

interface RootErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function RootError({ error, reset }: RootErrorProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        // Log to external error tracking service here
        console.error('Root error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Decorative blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#FC611E]/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#4F87C7]/10 blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8">
                <div className="w-full max-w-2xl">
                    {/* Error Icon */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FC611E]/10 mb-6">
                            <AlertTriangle className="w-10 h-10 text-[#FC611E]" />
                        </div>

                        {/* Yellow accent line */}
                        <div className="h-1 w-20 bg-[#FC611E] mx-auto mb-6 rounded-full" />
                    </div>

                    {/* Headings */}
                    <div className="text-center mb-8 md:mb-10">
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
                            style={{
                                fontFamily: 'var(--font-subjectivity), sans-serif',
                                color: '#27261C',
                                letterSpacing: '-0.05em',
                            }}
                        >
                            Something Went Wrong
                        </h1>
                        <p
                            className="text-base sm:text-lg md:text-xl text-[#686766] max-w-xl mx-auto"
                            style={{
                                fontFamily: 'var(--font-mona-sans), sans-serif',
                                fontWeight: 500,
                                lineHeight: '1.6',
                            }}
                        >
                            We encountered an unexpected error. Our team has been notified and we're working to fix it.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
                        <button
                            onClick={reset}
                            className="w-full sm:w-auto px-8 py-4 bg-[#FC611E] hover:bg-[#f46a2f] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                        >
                            <RotateCw className="w-5 h-5" />
                            Try Again
                        </button>

                        <Link href="/">
                            <button
                                className="w-full sm:w-auto px-8 py-4 border-2 border-[#DDE7E0] text-[#27261C] font-semibold rounded-full hover:border-[#FC611E] hover:bg-[#F5F1E6] transition-all duration-300 flex items-center justify-center gap-2"
                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </Link>
                    </div>

                    {/* Error Details (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-gradient-to-b from-[#F5F1E6] via-[#F5F1E6]/30 to-white rounded-3xl p-6 sm:p-8 border border-[#DDE7E0]">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="w-full text-left"
                            >
                                <p
                                    className="text-sm font-semibold text-[#686766] uppercase tracking-widest mb-4"
                                    style={{ fontFamily: 'var(--font-subjectivity), sans-serif' }}
                                >
                                    {isExpanded ? '▼' : '▶'} Error Details (Development Only)
                                </p>
                            </button>

                            {isExpanded && (
                                <div className="space-y-4 mt-4 pt-4 border-t border-[#DDE7E0]">
                                    <div>
                                        <p
                                            className="text-xs font-semibold text-[#686766] uppercase mb-2"
                                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                                        >
                                            Message
                                        </p>
                                        <pre
                                            className="bg-white p-4 rounded-lg text-xs text-[#27261C] overflow-auto max-h-40 border border-[#DDE7E0]"
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
                                                className="bg-white p-4 rounded-lg text-xs text-[#27261C] overflow-auto border border-[#DDE7E0]"
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                {error.digest}
                                            </pre>
                                        </div>
                                    )}

                                    <div>
                                        <p
                                            className="text-xs font-semibold text-[#686766] uppercase mb-2"
                                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                                        >
                                            Stack Trace
                                        </p>
                                        <pre
                                            className="bg-white p-4 rounded-lg text-xs text-red-600 overflow-auto max-h-40 border border-[#DDE7E0]"
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            {error.stack}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Support section */}
                    <div className="mt-8 pt-8 border-t border-[#DDE7E0] text-center">
                        <p
                            className="text-sm text-[#686766] mb-4"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                        >
                            Need help? Contact our support team:
                        </p>
                        <Link href="/contact">
                            <button
                                className="inline-flex items-center gap-2 px-6 py-3 text-[#4F87C7] hover:text-[#FC611E] font-semibold transition-colors"
                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif' }}
                            >
                                <Mail className="w-4 h-4" />
                                Get in Touch
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
