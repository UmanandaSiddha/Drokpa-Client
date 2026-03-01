'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function LegacyTourItineraryPage() {
    const params = useParams()
    const router = useRouter()
    const tourId = params?.id as string

    useEffect(() => {
        if (!tourId) return
        router.replace(`/admin/tours/${tourId}`)
    }, [router, tourId])

    return null
}
