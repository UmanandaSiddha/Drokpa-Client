'use client'

import { useState, FormEvent } from 'react'
import { User, X, ArrowRight } from 'lucide-react'

interface Props {
    prefill: { firstName: string; lastName: string }
    onSubmit: (data: { firstName: string; lastName: string }) => void
    onClose: () => void
    isLoading: boolean
}

export function GoogleSignUpModal({ prefill, onSubmit, onClose, isLoading }: Props) {
    const [firstName, setFirstName] = useState(prefill.firstName)
    const [lastName, setLastName] = useState(prefill.lastName)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (firstName.trim()) {
            onSubmit({ firstName, lastName })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 max-w-md w-full shadow-2xl border-2 border-[#DDE7E0] animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-6 right-6 p-2 hover:bg-[#F5F1E6] rounded-lg transition-colors disabled:opacity-50"
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
                            Complete Your Profile
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
                        Welcome to Drokpa
                    </h2>
                    <p
                        className="text-sm sm:text-base text-[#686766]"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500, lineHeight: '1.6' }}
                    >
                        We found your Google account details. Just confirm your name to finish setting up your account.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name Field */}
                    <div>
                        <label
                            htmlFor="modalFirstName"
                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 600 }}
                        >
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
                            <input
                                type="text"
                                id="modalFirstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                autoComplete="given-name"
                                className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors disabled:bg-gray-50 disabled:opacity-50"
                                required
                                disabled={isLoading}
                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500 }}
                            />
                        </div>
                    </div>

                    {/* Last Name Field */}
                    <div>
                        <label
                            htmlFor="modalLastName"
                            className="block text-sm font-semibold mb-2 text-[#27261C]"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 600 }}
                        >
                            Last Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686766]" size={18} />
                            <input
                                type="text"
                                id="modalLastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                autoComplete="family-name"
                                className="w-full bg-white text-[#27261C] rounded-xl pl-11 pr-4 py-3 border-2 border-gray-200 placeholder-gray-400 outline-none focus:border-[#FC611E] transition-colors disabled:bg-gray-50 disabled:opacity-50"
                                disabled={isLoading}
                                style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500 }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-[#DDE7E0] text-[#27261C] font-semibold rounded-full hover:border-[#686766] hover:bg-[#F5F1E6] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 600 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !firstName.trim()}
                            className="flex-1 px-4 py-3 bg-[#FC611E] hover:bg-[#f46a2f] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 700, color: 'white' }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 pt-6 border-t border-[#DDE7E0]">
                    <p
                        className="text-xs text-[#686766] text-center"
                        style={{ fontFamily: 'var(--font-mona-sans), sans-serif', fontWeight: 500 }}
                    >
                        We use this information to personalize your experience and keep your account secure.
                    </p>
                </div>
            </div>
        </div>
    )
}
