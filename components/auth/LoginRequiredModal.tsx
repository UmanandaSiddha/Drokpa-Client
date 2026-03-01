'use client'

import { X, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LoginRequiredModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message?: string
}

export function LoginRequiredModal({
    isOpen,
    onClose,
    title = 'Sign In Required',
    message = 'You need to be logged in to complete this action. Please sign in to continue.'
}: LoginRequiredModalProps) {
    const router = useRouter()

    if (!isOpen) return null

    const handleSignIn = () => {
        router.push('/auth/signin')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 max-w-md w-full shadow-2xl border-2 border-[#DDE7E0] animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-[#F5F1E6] rounded-lg transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-[#686766]" />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex h-3 w-3 rounded-sm bg-[#FC611E]" />
                        <p
                            className="text-xs tracking-widest uppercase text-[#686766]"
                            style={{ fontFamily: 'var(--font-subjectivity), sans-serif', fontWeight: 700 }}
                        >
                            Authentication Required
                        </p>
                    </div>
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-[#27261C] mb-3 leading-tight"
                        style={{
                            fontFamily: 'var(--font-subjectivity), sans-serif',
                            fontWeight: 700,
                            letterSpacing: '-0.05em',
                        }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-sm sm:text-base text-[#686766]"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500, lineHeight: '1.6' }}
                    >
                        {message}
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleSignIn}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#005246] text-white font-semibold hover:bg-[#003d34] transition-colors"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 600 }}
                    >
                        <LogIn size={18} />
                        Sign In Now
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 rounded-full border-2 border-[#DDE7E0] text-[#27261C] font-semibold hover:bg-[#F5F1E6] transition-colors"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 600 }}
                    >
                        Cancel
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-[#DDE7E0]">
                    <p
                        className="text-xs text-center text-[#686766]"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500 }}
                    >
                        Don't have an account?{' '}
                        <button
                            onClick={() => router.push('/auth/signup')}
                            className="text-[#005246] font-semibold hover:underline transition-all"
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
