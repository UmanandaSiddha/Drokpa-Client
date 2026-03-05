'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { ArrowLeft, Plus, Loader2, DoorOpen, Upload, X, CalendarDays, AlertCircle, Edit2, Trash2, Info, Tag, Wrench, BookOpen, Users } from 'lucide-react'
import { RoleGuard } from '@/components/admin/RoleGuard'
import { UserRole } from '@/types/auth'
import { BookingCriteria } from '@/types/homestay'
import { useHomestay, useCreateRoom, useUpdateRoom, useDeleteRoom, useRoomAvailability, useSetAvailability, useUpdateSingleAvailability, useAddHomestayTags, useRemoveHomestayTag, useAddHomestayFacilities, useRemoveHomestayFacility, useOfflineBookings, useCreateOfflineBooking, useUpdateOfflineBooking, useDeleteOfflineBooking } from '@/hooks/homestays'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useS3Upload } from '@/hooks/s3/useS3Upload'
import { useTags, useFacilities } from '@/hooks/resources'
import Image from 'next/image'

const toDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const parseDateString = (value: string) => {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
}

const formatDisplayDate = (value: string) => {
    return parseDateString(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export default function AdminHomestayDetailPage() {
    const params = useParams<{ id: string }>()
    const homestayId = params?.id
    const { data: homestay, isLoading } = useHomestay(homestayId)
    const createRoom = useCreateRoom()
    const updateRoom = useUpdateRoom()
    const deleteRoom = useDeleteRoom()
    const setAvailability = useSetAvailability()
    const updateSingleAvailability = useUpdateSingleAvailability()
    const { uploadFiles, isUploading } = useS3Upload()
    const addHomestayTags = useAddHomestayTags()
    const removeHomestayTag = useRemoveHomestayTag()
    const addHomestayFacilities = useAddHomestayFacilities()
    const removeHomestayFacility = useRemoveHomestayFacility()
    const createOfflineBooking = useCreateOfflineBooking()
    const updateOfflineBooking = useUpdateOfflineBooking()
    const deleteOfflineBooking = useDeleteOfflineBooking()

    // Fetch all tags and facilities for selection
    const { data: tagsData } = useTags({ limit: 100 })
    const { data: facilitiesData } = useFacilities({ limit: 100 })
    const allTags = tagsData?.data || []
    const allFacilities = facilitiesData?.data || []

    const [roomForm, setRoomForm] = useState({
        name: '',
        capacity: 2,
        basePrice: 0,
        totalRooms: 1,
        description: '',
        bookingCriteria: BookingCriteria.PER_NIGHT,
        amenities: '' as string,
        imageUrls: [] as string[],
    })
    const [editingRoom, setEditingRoom] = useState<any>(null)
    const [availabilityView, setAvailabilityView] = useState<string | null>(null)
    const [availabilityDates, setAvailabilityDates] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })
    const [bulkAvailability, setBulkAvailability] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        available: 0,
        priceOverride: undefined as number | undefined,
    })
    const [uploadingImageNames, setUploadingImageNames] = useState<Set<string>>(new Set())
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
    const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([])
    const [showTagsModal, setShowTagsModal] = useState(false)
    const [showFacilitiesModal, setShowFacilitiesModal] = useState(false)
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string | null>(null)
    const [showOfflineBookingForm, setShowOfflineBookingForm] = useState(false)
    const [offlineBookingForm, setOfflineBookingForm] = useState({
        guestName: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rooms: 1,
        noOfGuests: 1,
        notes: '',
    })
    const [editingOfflineBooking, setEditingOfflineBooking] = useState<any>(null)

    const handleImageUpload = async (files: FileList) => {
        if (!files.length) return

        const fileArray = Array.from(files)
        fileArray.forEach(f => setUploadingImageNames(prev => new Set([...prev, f.name])))

        const publicUrls = await uploadFiles(fileArray, 'rooms', 'images')

        if (publicUrls.length > 0) {
            setRoomForm((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...publicUrls],
            }))
        }

        setUploadingImageNames(new Set())
    }

    const handleRemoveImage = (index: number) => {
        setRoomForm((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }))
    }

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingRoom) {
            updateRoom.mutate(
                {
                    homestayId,
                    roomId: editingRoom.id,
                    data: {
                        name: roomForm.name,
                        capacity: parseInt(String(roomForm.capacity)) || 1,
                        basePrice: parseInt(String(roomForm.basePrice)) || 0,
                        totalRooms: parseInt(String(roomForm.totalRooms)) || 1,
                        description: roomForm.description || undefined,
                        bookingCriteria: roomForm.bookingCriteria,
                        amenities: roomForm.amenities.split('\n').map(s => s.trim()).filter(Boolean),
                        imageUrls: roomForm.imageUrls.length > 0 ? roomForm.imageUrls : undefined,
                    },
                },
                {
                    onSuccess: () => {
                        setRoomForm({
                            name: '',
                            capacity: 2,
                            basePrice: 0,
                            totalRooms: 1,
                            description: '',
                            bookingCriteria: BookingCriteria.PER_NIGHT,
                            amenities: '',
                            imageUrls: [],
                        })
                        setEditingRoom(null)
                    },
                }
            )
        } else {
            createRoom.mutate(
                {
                    homestayId,
                    data: {
                        name: roomForm.name,
                        capacity: parseInt(String(roomForm.capacity)) || 1,
                        basePrice: parseInt(String(roomForm.basePrice)) || 0,
                        totalRooms: parseInt(String(roomForm.totalRooms)) || 1,
                        description: roomForm.description || undefined,
                        bookingCriteria: roomForm.bookingCriteria,
                        amenities: roomForm.amenities.split('\n').map(s => s.trim()).filter(Boolean),
                        imageUrls: roomForm.imageUrls.length > 0 ? roomForm.imageUrls : undefined,
                    },
                },
                {
                    onSuccess: () => {
                        setRoomForm({
                            name: '',
                            capacity: 2,
                            basePrice: 0,
                            totalRooms: 1,
                            description: '',
                            bookingCriteria: BookingCriteria.PER_NIGHT,
                            amenities: '',
                            imageUrls: [],
                        })
                    },
                }
            )
        }
    }

    const handleDeleteRoom = (roomId: string, roomName: string) => {
        if (confirm(`Delete room ${roomName}?`)) {
            deleteRoom.mutate({ homestayId, roomId })
        }
    }

    const handleEditRoom = (room: any) => {
        setEditingRoom(room)
        setRoomForm({
            name: room.name,
            capacity: room.capacity,
            basePrice: room.basePrice,
            totalRooms: room.totalRooms,
            description: room.description || '',
            bookingCriteria: room.bookingCriteria,
            amenities: (room.amenities || []).join('\n'),
            imageUrls: room.imageUrls || [],
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingRoom(null)
        setRoomForm({
            name: '',
            capacity: 2,
            basePrice: 0,
            totalRooms: 1,
            description: '',
            bookingCriteria: BookingCriteria.PER_NIGHT,
            amenities: '',
            imageUrls: [],
        })
    }

    const handleSetBulkAvailability = async (roomId: string) => {
        try {
            await setAvailability.mutateAsync({
                roomId,
                data: {
                    startDate: bulkAvailability.startDate,
                    endDate: bulkAvailability.endDate,
                    available: bulkAvailability.available,
                    priceOverride: bulkAvailability.priceOverride,
                },
            })
            alert('Availability updated successfully')
        } catch (error) {
            console.error('Failed to set availability:', error)
            alert('Failed to update availability')
        }
    }

    const handleAddTags = () => {
        if (selectedTagIds.length === 0) return
        addHomestayTags.mutate(
            { homestayId, data: { tagIds: selectedTagIds } },
            {
                onSuccess: () => {
                    setSelectedTagIds([])
                    setShowTagsModal(false)
                    alert('Tags added successfully')
                },
                onError: () => alert('Failed to add tags')
            }
        )
    }

    const handleRemoveTag = (tagId: string) => {
        if (confirm('Remove this tag?')) {
            removeHomestayTag.mutate(
                { homestayId, tagId },
                {
                    onSuccess: () => alert('Tag removed successfully'),
                    onError: () => alert('Failed to remove tag')
                }
            )
        }
    }

    const handleAddFacilities = () => {
        if (selectedFacilityIds.length === 0) return
        addHomestayFacilities.mutate(
            { homestayId, data: { facilityIds: selectedFacilityIds } },
            {
                onSuccess: () => {
                    setSelectedFacilityIds([])
                    setShowFacilitiesModal(false)
                    alert('Facilities added successfully')
                },
                onError: () => alert('Failed to add facilities')
            }
        )
    }

    const handleRemoveFacility = (facilityId: string) => {
        if (confirm('Remove this facility?')) {
            removeHomestayFacility.mutate(
                { homestayId, facilityId },
                {
                    onSuccess: () => alert('Facility removed successfully'),
                    onError: () => alert('Failed to remove facility')
                }
            )
        }
    }

    const homestayAddress = (homestay as any)?.address
    const providerName = (homestay as any)?.provider?.name
    const roomTypesCount = homestay?.rooms?.length || 0
    const totalRoomInventory = homestay?.rooms?.reduce((sum: number, room: any) => sum + (room.totalRooms || 0), 0) || 0

    return (
        <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HOST]}>
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/homestays">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={20} className="text-gray-700" />
                            </button>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-subjectivity), sans-serif', color: '#353030' }} className="text-2xl font-bold">Homestay Details</h1>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[#005246]" />
                        </div>
                    )}

                    {!isLoading && homestay && (
                        <>
                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">{homestay.name}</h2>
                                        <p className="text-gray-600 mt-1">{homestay.description}</p>
                                    </div>
                                    <Link href={`/admin/homestays/${homestay.id}/edit`}>
                                        <button className="px-4 py-2 border border-[#005246] text-[#005246] rounded-lg hover:bg-[#005246] hover:text-white transition-colors">
                                            Edit Homestay
                                        </button>
                                    </Link>
                                </div>

                                {homestay.imageUrls && homestay.imageUrls.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Homestay Images</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {homestay.imageUrls.slice(0, 8).map((url: string, index: number) => (
                                                <div key={`${url}-${index}`} className="relative aspect-4/3 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                                    <Image src={url} alt={`Homestay image ${index + 1}`} fill className="object-cover" unoptimized />
                                                </div>
                                            ))}
                                        </div>
                                        {homestay.imageUrls.length > 8 && (
                                            <p className="text-xs text-gray-500 mt-2">+{homestay.imageUrls.length - 8} more</p>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Contact</p>
                                        <p className="font-medium">{homestay.email}</p>
                                        <p className="font-medium">{homestay.phoneNumber}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Display Price</p>
                                        <p className="font-medium">₹{homestay.displayPrice?.toLocaleString('en-IN') || 'N/A'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Booking Criteria</p>
                                        <p className="font-medium">{homestay.bookingCriteria}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Status</p>
                                        <p className={`font-medium ${homestay.isActive ? 'text-green-700' : 'text-gray-700'}`}>
                                            {homestay.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Rating</p>
                                        <p className="font-medium">{homestay.rating ?? 0} ({homestay.totalReviews} reviews)</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Provider</p>
                                        <p className="font-medium">{providerName || 'Not assigned'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Room Types</p>
                                        <p className="font-medium">{roomTypesCount}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Total Inventory</p>
                                        <p className="font-medium">{totalRoomInventory} rooms</p>
                                    </div>
                                </div>

                                {(homestayAddress || homestay.houseRules?.length || homestay.safetyNSecurity?.length) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Address</p>
                                            {homestayAddress ? (
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    {homestayAddress.street && <p>{homestayAddress.street}</p>}
                                                    <p>{homestayAddress.city}, {homestayAddress.state}</p>
                                                    <p>{homestayAddress.country} {homestayAddress.postalCode ? `- ${homestayAddress.postalCode}` : ''}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    {homestay.addressId ? `Address ID: ${homestay.addressId}` : 'Address not linked'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Metadata</p>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p><span className="font-medium">Created:</span> {new Date(homestay.createdAt).toLocaleDateString('en-IN')}</p>
                                                <p><span className="font-medium">Updated:</span> {new Date(homestay.updatedAt).toLocaleDateString('en-IN')}</p>
                                                <p><span className="font-medium">Slug:</span> {homestay.slug}</p>
                                            </div>
                                        </div>

                                        {homestay.houseRules && homestay.houseRules.length > 0 && (
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">House Rules</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {homestay.houseRules.map((rule: string, idx: number) => (
                                                        <li key={`rule-${idx}`}>{rule}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {homestay.safetyNSecurity && homestay.safetyNSecurity.length > 0 && (
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Safety & Security</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {homestay.safetyNSecurity.map((item: string, idx: number) => (
                                                        <li key={`safety-${idx}`}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bookings Management */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={22} className="text-gray-700" />
                                    <h3 className="text-lg font-semibold">Room Bookings & Availability</h3>
                                </div>
                                <p className="text-sm text-gray-600">View all online and offline bookings for your rooms</p>

                                {(!homestay.rooms || homestay.rooms.length === 0) ? (
                                    <p className="text-gray-500 text-sm">No rooms created yet. Create rooms to manage bookings.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {homestay.rooms.map((room: any) => {
                                            const RoomBookingsView = () => {
                                                const { data: offlineBookings } = useOfflineBookings(room.id)
                                                const bookingsData = offlineBookings || []
                                                const today = new Date()
                                                today.setHours(0, 0, 0, 0)
                                                const upcomingBookings = bookingsData.filter((b: any) => new Date(b.checkOut) > today).sort((a: any, b: any) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())

                                                // Calculate average daily occupancy over next 30 days
                                                const getAverageOccupancy = () => {
                                                    if (upcomingBookings.length === 0) return 0

                                                    const endDate = new Date(today)
                                                    endDate.setDate(endDate.getDate() + 30)

                                                    let totalOccupiedRooms = 0
                                                    let daysCount = 0

                                                    // For each day in the next 30 days, count occupied rooms
                                                    for (let d = new Date(today); d < endDate; d.setDate(d.getDate() + 1)) {
                                                        daysCount++
                                                        const currentDay = new Date(d)
                                                        currentDay.setHours(0, 0, 0, 0)
                                                        const dayTime = currentDay.getTime()

                                                        // Count rooms booked on this specific day
                                                        const roomsBookedThisDay = upcomingBookings.reduce((count: number, b: any) => {
                                                            const checkIn = new Date(b.checkIn)
                                                            checkIn.setHours(0, 0, 0, 0)
                                                            const checkOut = new Date(b.checkOut)
                                                            checkOut.setHours(0, 0, 0, 0)

                                                            // If booking overlaps with this day
                                                            if (checkIn.getTime() <= dayTime && dayTime < checkOut.getTime()) {
                                                                return count + b.rooms
                                                            }
                                                            return count
                                                        }, 0)

                                                        totalOccupiedRooms += Math.min(roomsBookedThisDay, room.totalRooms)
                                                    }

                                                    const avgOccupiedRooms = totalOccupiedRooms / daysCount
                                                    return Math.round((avgOccupiedRooms / room.totalRooms) * 100)
                                                }

                                                const occupancy = getAverageOccupancy()

                                                return (
                                                    <div key={room.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900">{room.name}</h4>
                                                                <p className="text-xs text-gray-600 mt-1">Total Rooms: <span className="font-medium">{room.totalRooms}</span> • <span className="font-medium">{upcomingBookings.length}</span> {upcomingBookings.length === 1 ? 'Booking' : 'Bookings'}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xs text-gray-500">30-Day Avg</div>
                                                                <div className="text-sm font-semibold text-gray-900">{occupancy}% Occupied</div>
                                                                <div className="w-24 h-2 bg-gray-300 rounded-full mt-1 overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-green-500"
                                                                        style={{ width: `${occupancy}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {upcomingBookings.length > 0 ? (
                                                            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                                                                {upcomingBookings.map((booking: any) => (
                                                                    <div key={booking.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-300 text-sm">
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-gray-900">{booking.guestName}</p>
                                                                            <p className="text-xs text-gray-600">
                                                                                {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {booking.rooms} room{booking.rooms > 1 ? 's' : ''} · {booking.noOfGuests || 0} guest{(booking.noOfGuests || 0) !== 1 ? 's' : ''}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex gap-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedRoomForBooking(room.id)
                                                                                    setEditingOfflineBooking(booking)
                                                                                    setOfflineBookingForm({
                                                                                        guestName: booking.guestName,
                                                                                        checkIn: booking.checkIn.split('T')[0],
                                                                                        checkOut: booking.checkOut.split('T')[0],
                                                                                        rooms: booking.rooms,
                                                                                        noOfGuests: booking.noOfGuests || 1,
                                                                                        notes: booking.notes || '',
                                                                                    })
                                                                                    setShowOfflineBookingForm(true)
                                                                                }}
                                                                                className="p-1 hover:bg-blue-100 rounded"
                                                                                title="Edit"
                                                                            >
                                                                                <Edit2 size={14} className="text-blue-600" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (confirm(`Delete booking for ${booking.guestName}?`)) {
                                                                                        deleteOfflineBooking.mutate({
                                                                                            roomId: room.id,
                                                                                            bookingId: booking.id,
                                                                                        })
                                                                                    }
                                                                                }}
                                                                                disabled={deleteOfflineBooking.isPending}
                                                                                className="p-1 hover:bg-red-100 rounded disabled:opacity-50"
                                                                                title="Delete"
                                                                            >
                                                                                <Trash2 size={14} className="text-red-600" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-500 italic">No upcoming bookings</p>
                                                        )}

                                                        <button
                                                            onClick={() => {
                                                                setSelectedRoomForBooking(room.id)
                                                                setEditingOfflineBooking(null)
                                                                setOfflineBookingForm({
                                                                    guestName: '',
                                                                    checkIn: new Date().toISOString().split('T')[0],
                                                                    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                                    rooms: 1,
                                                                    noOfGuests: 1,
                                                                    notes: '',
                                                                })
                                                                setShowOfflineBookingForm(true)
                                                            }}
                                                            className="w-full mt-2 px-3 py-2 text-sm bg-[#005246] text-white rounded-lg hover:bg-[#003d34] flex items-center justify-center gap-1"
                                                        >
                                                            <Plus size={14} />
                                                            Add Offline Booking
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            return <RoomBookingsView key={room.id} />
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Offline Booking Form Modal */}
                            <Dialog open={showOfflineBookingForm && !!selectedRoomForBooking} onOpenChange={(open) => {
                                if (!open) {
                                    setShowOfflineBookingForm(false)
                                    setSelectedRoomForBooking(null)
                                    setEditingOfflineBooking(null)
                                }
                            }}>
                                <DialogContent className="sm:max-w-125">
                                    <DialogHeader>
                                        <DialogTitle>{editingOfflineBooking ? 'Edit' : 'Add'} Offline Booking</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div>
                                            <label className="text-sm font-medium">Guest Name *</label>
                                            <input
                                                type="text"
                                                value={offlineBookingForm.guestName}
                                                onChange={(e) => setOfflineBookingForm({ ...offlineBookingForm, guestName: e.target.value })}
                                                placeholder="e.g., Raj Kumar"
                                                className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005246] focus:border-transparent text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium">Check-in *</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full mt-1.5 justify-start text-left font-normal">
                                                            <CalendarDays className="mr-2 h-4 w-4" />
                                                            {formatDisplayDate(offlineBookingForm.checkIn)}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={parseDateString(offlineBookingForm.checkIn)}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    setOfflineBookingForm({ ...offlineBookingForm, checkIn: toDateString(date) })
                                                                }
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Check-out *</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full mt-1.5 justify-start text-left font-normal">
                                                            <CalendarDays className="mr-2 h-4 w-4" />
                                                            {formatDisplayDate(offlineBookingForm.checkOut)}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={parseDateString(offlineBookingForm.checkOut)}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    setOfflineBookingForm({ ...offlineBookingForm, checkOut: toDateString(date) })
                                                                }
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium">Rooms *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={offlineBookingForm.rooms}
                                                    onChange={(e) => setOfflineBookingForm({ ...offlineBookingForm, rooms: parseInt(e.target.value) || 1 })}
                                                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005246] focus:border-transparent text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Guests *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={offlineBookingForm.noOfGuests}
                                                    onChange={(e) => setOfflineBookingForm({ ...offlineBookingForm, noOfGuests: parseInt(e.target.value) || 1 })}
                                                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005246] focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium">Notes (Optional)</label>
                                            <textarea
                                                value={offlineBookingForm.notes}
                                                onChange={(e) => setOfflineBookingForm({ ...offlineBookingForm, notes: e.target.value })}
                                                placeholder="e.g., Friend's reservation, special requirements..."
                                                rows={3}
                                                className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005246] focus:border-transparent text-sm resize-none"
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowOfflineBookingForm(false)
                                                setSelectedRoomForBooking(null)
                                                setEditingOfflineBooking(null)
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!offlineBookingForm.guestName || !offlineBookingForm.checkIn || !offlineBookingForm.checkOut) {
                                                    alert('Please fill in all required fields')
                                                    return
                                                }

                                                if (editingOfflineBooking) {
                                                    updateOfflineBooking.mutate({
                                                        roomId: selectedRoomForBooking!,
                                                        bookingId: editingOfflineBooking.id,
                                                        data: offlineBookingForm,
                                                    }, {
                                                        onSuccess: () => {
                                                            setShowOfflineBookingForm(false)
                                                            setSelectedRoomForBooking(null)
                                                            setEditingOfflineBooking(null)
                                                        }
                                                    })
                                                } else {
                                                    createOfflineBooking.mutate({
                                                        roomId: selectedRoomForBooking!,
                                                        data: offlineBookingForm,
                                                    }, {
                                                        onSuccess: () => {
                                                            setShowOfflineBookingForm(false)
                                                            setSelectedRoomForBooking(null)
                                                            setOfflineBookingForm({
                                                                guestName: '',
                                                                checkIn: new Date().toISOString().split('T')[0],
                                                                checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                                                rooms: 1,
                                                                noOfGuests: 1,
                                                                notes: '',
                                                            })
                                                        }
                                                    })
                                                }
                                            }}
                                            disabled={createOfflineBooking.isPending || updateOfflineBooking.isPending}
                                            className="px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 text-sm font-medium transition-colors"
                                        >
                                            {createOfflineBooking.isPending || updateOfflineBooking.isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : (
                                                editingOfflineBooking ? 'Update Booking' : 'Add Booking'
                                            )}
                                        </button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Tags and Facilities Management */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tags Section */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Tag size={18} className="text-gray-700" />
                                            Tags ({homestay.tags?.length || 0})
                                        </h3>
                                        <button
                                            onClick={() => setShowTagsModal(!showTagsModal)}
                                            className="px-3 py-1.5 text-sm border border-[#005246] text-[#005246] rounded-lg hover:bg-[#005246] hover:text-white transition-colors"
                                        >
                                            {showTagsModal ? 'Cancel' : 'Add Tags'}
                                        </button>
                                    </div>

                                    {showTagsModal && (
                                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Select tags to add:</p>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {allTags
                                                    .filter((tag: any) => !homestay.tags?.some((ht: any) => ht.tagId === tag.id))
                                                    .map((tag: any) => {
                                                        const TagIcon = tag.icon ? require('lucide-react')[tag.icon] : null
                                                        return (
                                                            <label key={tag.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedTagIds.includes(tag.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedTagIds([...selectedTagIds, tag.id])
                                                                        } else {
                                                                            setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="px-2 py-1 bg-white border rounded text-xs flex items-center gap-1.5">
                                                                    {TagIcon && <TagIcon size={14} style={{ color: tag.color }} />}
                                                                    {tag.label || tag.name}
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                            </div>
                                            <button
                                                onClick={handleAddTags}
                                                disabled={selectedTagIds.length === 0 || addHomestayTags.isPending}
                                                className="w-full px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {addHomestayTags.isPending && <Loader2 size={14} className="animate-spin" />}
                                                Add Selected Tags ({selectedTagIds.length})
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {homestay.tags && homestay.tags.length > 0 ? (
                                            homestay.tags.map((ht: any) => {
                                                const TagIcon = ht.tag.icon ? require('lucide-react')[ht.tag.icon] : null
                                                return (
                                                    <div
                                                        key={ht.tagId}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                                                        style={{
                                                            backgroundColor: `${ht.tag.color}15`,
                                                            borderColor: `${ht.tag.color}40`,
                                                            color: ht.tag.color
                                                        }}
                                                    >
                                                        {TagIcon && <TagIcon size={14} />}
                                                        <span className="text-sm font-medium">{ht.tag.label}</span>
                                                        <button
                                                            onClick={() => handleRemoveTag(ht.tagId)}
                                                            className="hover:opacity-70"
                                                            title="Remove tag"
                                                            style={{ color: ht.tag.color }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-500">No tags added yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Facilities Section */}
                                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Wrench size={18} className="text-gray-700" />
                                            Facilities ({homestay.facilities?.length || 0})
                                        </h3>
                                        <button
                                            onClick={() => setShowFacilitiesModal(!showFacilitiesModal)}
                                            className="px-3 py-1.5 text-sm border border-[#005246] text-[#005246] rounded-lg hover:bg-[#005246] hover:text-white transition-colors"
                                        >
                                            {showFacilitiesModal ? 'Cancel' : 'Add Facilities'}
                                        </button>
                                    </div>

                                    {showFacilitiesModal && (
                                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Select facilities to add:</p>
                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {allFacilities
                                                    .filter((facility: any) => !homestay.facilities?.some((hf: any) => hf.facilityId === facility.id))
                                                    .map((facility: any) => {
                                                        const FacilityIcon = facility.icon ? require('lucide-react')[facility.icon] : null
                                                        return (
                                                            <label key={facility.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedFacilityIds.includes(facility.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedFacilityIds([...selectedFacilityIds, facility.id])
                                                                        } else {
                                                                            setSelectedFacilityIds(selectedFacilityIds.filter(id => id !== facility.id))
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="px-2 py-1 bg-white border rounded text-xs flex items-center gap-1.5">
                                                                    {FacilityIcon && <FacilityIcon size={14} className="text-gray-600" />}
                                                                    {facility.name}
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                            </div>
                                            <button
                                                onClick={handleAddFacilities}
                                                disabled={selectedFacilityIds.length === 0 || addHomestayFacilities.isPending}
                                                className="w-full px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {addHomestayFacilities.isPending && <Loader2 size={14} className="animate-spin" />}
                                                Add Selected Facilities ({selectedFacilityIds.length})
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {homestay.facilities && homestay.facilities.length > 0 ? (
                                            homestay.facilities.map((hf: any) => {
                                                const FacilityIcon = hf.facility.icon ? require('lucide-react')[hf.facility.icon] : null
                                                return (
                                                    <div key={hf.facilityId} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-900">
                                                        {FacilityIcon && <FacilityIcon size={14} />}
                                                        <span className="text-sm font-medium">{hf.facility.name}</span>
                                                        <button
                                                            onClick={() => handleRemoveFacility(hf.facilityId)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Remove facility"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-500">No facilities added yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Plus size={18} className="text-gray-700" />
                                    {editingRoom ? 'Edit Room' : 'Create Room'}
                                </h3>
                                {editingRoom && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                                        <p className="text-sm text-blue-900">Editing: <span className="font-semibold">{editingRoom.name}</span></p>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Cancel Edit
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleCreateRoom} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Room Name *</label>
                                            <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={roomForm.name} onChange={(e) => setRoomForm((p) => ({ ...p, name: e.target.value }))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Booking Criteria</label>
                                            <Select value={roomForm.bookingCriteria} onValueChange={(value) => setRoomForm((p) => ({ ...p, bookingCriteria: value as BookingCriteria }))}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={BookingCriteria.PER_NIGHT}>Per Night</SelectItem>
                                                    <SelectItem value={BookingCriteria.PER_PERSON}>Per Person</SelectItem>
                                                    <SelectItem value={BookingCriteria.HYBRID}>Hybrid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                Capacity (People) *
                                                <span className="text-xs text-gray-500 font-normal">(Max guests per room)</span>
                                            </label>
                                            <input type="number" min={1} step="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={roomForm.capacity} onChange={(e) => setRoomForm((p) => ({ ...p, capacity: parseInt(e.target.value) || 0 }))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                Base Price (₹) *
                                                <span className="text-xs text-gray-500 font-normal">(Per night/person)</span>
                                            </label>
                                            <input type="number" min={0} step="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={roomForm.basePrice} onChange={(e) => setRoomForm((p) => ({ ...p, basePrice: parseInt(e.target.value) || 0 }))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                Total Rooms *
                                                <span className="text-xs text-gray-500 font-normal">(Rooms of this type)</span>
                                            </label>
                                            <input type="number" min={1} step="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={roomForm.totalRooms} onChange={(e) => setRoomForm((p) => ({ ...p, totalRooms: parseInt(e.target.value) || 0 }))} required />
                                            <p className="text-xs text-gray-500">Example: If you have 3 identical double rooms, enter 3</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20" value={roomForm.description} onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            Room Amenities
                                            <span className="text-xs text-gray-500 font-normal">(One per line, e.g., WiFi, TV, AC)</span>
                                        </label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-20"
                                            value={roomForm.amenities}
                                            onChange={(e) => setRoomForm((p) => ({ ...p, amenities: e.target.value }))}
                                            placeholder="WiFi\nAir Conditioning\nAttached Bathroom\nTV\nHot Water"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block">Room Images</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#005246] transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                                className="hidden"
                                                id="room-image-upload"
                                                disabled={isUploading}
                                            />
                                            <label
                                                htmlFor="room-image-upload"
                                                className="flex flex-col items-center justify-center cursor-pointer"
                                            >
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    {isUploading ? 'Uploading...' : 'Click to upload room images'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                            </label>
                                        </div>

                                        {uploadingImageNames.size > 0 && (
                                            <div className="space-y-1">
                                                {Array.from(uploadingImageNames).map((name) => (
                                                    <div key={name} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Uploading {name}...
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {roomForm.imageUrls.length > 0 && (
                                            <div className="grid grid-cols-3 gap-3 mt-4">
                                                {roomForm.imageUrls.map((url, index) => (
                                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                                                        <Image src={url} alt={`Room image ${index + 1}`} fill className="object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button type="submit" disabled={createRoom.isPending || updateRoom.isPending || isUploading} className="px-5 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 flex items-center gap-2">
                                        {(createRoom.isPending || updateRoom.isPending) && <Loader2 size={16} className="animate-spin" />}
                                        {editingRoom ? 'Update' : 'Create'} Room
                                    </button>
                                    {editingRoom && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </form>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <DoorOpen size={18} className="text-gray-700" />
                                    Rooms ({homestay.rooms?.length ?? 0})
                                </h3>
                                {(!homestay.rooms || homestay.rooms.length === 0) && (
                                    <p className="text-gray-600">No rooms created yet.</p>
                                )}
                                {homestay.rooms && homestay.rooms.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {homestay.rooms.map((room) => (
                                            <div key={room.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                {room.imageUrls && room.imageUrls.length > 0 && (
                                                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                                                        <Image
                                                            src={room.imageUrls[0]}
                                                            alt={room.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {room.imageUrls.length > 1 && (
                                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                                +{room.imageUrls.length - 1} more
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold">{room.name}</p>
                                                            {room.description && (
                                                                <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                                                            )}
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                <span className="font-medium">Capacity:</span> {room.capacity} people ·
                                                                <span className="font-medium"> Rooms:</span> {room.totalRooms}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Price:</span> ₹{room.basePrice.toLocaleString('en-IN')} / {room.bookingCriteria}
                                                            </p>
                                                            {room.amenities && room.amenities.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs font-medium text-gray-700">Amenities:</p>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                                                            <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                                                {amenity}
                                                                            </span>
                                                                        ))}
                                                                        {room.amenities.length > 3 && (
                                                                            <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handleEditRoom(room)}
                                                                title="Edit room"
                                                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            >
                                                                <Edit2 size={16} className="text-gray-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (availabilityView === room.id) {
                                                                        setAvailabilityView(null)
                                                                    } else {
                                                                        setAvailabilityView(room.id)
                                                                    }
                                                                }}
                                                                title="Manage availability"
                                                                className={`p-2 border rounded-lg ${availabilityView === room.id
                                                                    ? 'bg-[#005246] text-white border-[#005246]'
                                                                    : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                                                    }`}
                                                            >
                                                                <CalendarDays size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteRoom(room.id, room.name)}
                                                                disabled={deleteRoom.isPending}
                                                                className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {availabilityView === room.id && (
                                                        <div className="border-t pt-3 space-y-4 bg-gray-50 -m-4 p-4 rounded-b-lg">
                                                            <div className="flex items-start gap-2">
                                                                <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                                                <div className="text-sm text-gray-700">
                                                                    <p className="font-medium mb-1">Room Availability Management</p>
                                                                    <p className="text-xs text-gray-600">
                                                                        Set how many rooms are available for booking for specific date ranges. This applies to both online bookings through the platform and offline bookings you manage.
                                                                        For example, if you have {room.totalRooms} total rooms but 2 are occupied or reserved offline, set "Available Rooms" to {Math.max(0, room.totalRooms - 2)}.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                                                        From Date *
                                                                    </label>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal h-10">
                                                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                                                {formatDisplayDate(bulkAvailability.startDate)}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                selected={parseDateString(bulkAvailability.startDate)}
                                                                                onSelect={(date) => {
                                                                                    if (date) {
                                                                                        setBulkAvailability({ ...bulkAvailability, startDate: toDateString(date) })
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                                                        To Date *
                                                                    </label>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal h-10">
                                                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                                                {formatDisplayDate(bulkAvailability.endDate)}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0" align="start">
                                                                            <Calendar
                                                                                mode="single"
                                                                                selected={parseDateString(bulkAvailability.endDate)}
                                                                                onSelect={(date) => {
                                                                                    if (date) {
                                                                                        setBulkAvailability({ ...bulkAvailability, endDate: toDateString(date) })
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                                                        Available Rooms *
                                                                        <span className="text-gray-500 font-normal">(Max: {room.totalRooms})</span>
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max={room.totalRooms}
                                                                        value={bulkAvailability.available}
                                                                        onChange={(e) => setBulkAvailability({ ...bulkAvailability, available: parseInt(e.target.value) || 0 })}
                                                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#005246] focus:border-transparent"
                                                                        placeholder={`Enter 0-${room.totalRooms}`}
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">Number of rooms available for booking on these dates</p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                                                        Special Price (Optional)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        placeholder={`Default: ₹${room.basePrice}`}
                                                                        value={bulkAvailability.priceOverride || ''}
                                                                        onChange={(e) => setBulkAvailability({ ...bulkAvailability, priceOverride: e.target.value ? parseFloat(e.target.value) : undefined })}
                                                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#005246] focus:border-transparent"
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">Leave empty to use default price</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSetBulkAvailability(room.id)}
                                                                disabled={setAvailability.isPending || !bulkAvailability.startDate || !bulkAvailability.endDate}
                                                                className="w-full px-4 py-2.5 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                                                            >
                                                                {setAvailability.isPending && <Loader2 size={14} className="animate-spin" />}
                                                                Update Availability for Selected Dates
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </RoleGuard>
    )
}
