"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { addressService } from "@/services/address.service";
import type { Address } from "@/types/address";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressSearchSelectProps {
    value?: string;
    onSelect: (addressId: string, address: Address) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

export function AddressSearchSelect({
    value,
    onSelect,
    label = "Select Address",
    placeholder = "Enter latitude & longitude, then search...",
    required = false,
}: AddressSearchSelectProps) {
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [radiusKm, setRadiusKm] = useState("10");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [createForm, setCreateForm] = useState({
        street: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const normalizeAddresses = (payload: unknown): Address[] => {
        return Array.isArray(payload) ? (payload as Address[]) : [];
    };

    const formatAddress = (addr: Address) => {
        return [addr.street, addr.city, addr.state, addr.country, addr.postalCode]
            .filter(Boolean)
            .join(", ");
    };

    const isValidLatitude = (lat: number) => lat >= -90 && lat <= 90;
    const isValidLongitude = (lng: number) => lng >= -180 && lng <= 180;

    const handleSearchNearby = useCallback(async () => {
        if (latitude.trim() === "" || longitude.trim() === "") {
            setSearchAttempted(true);
            setSearchError("Please enter both latitude and longitude before searching.");
            setAddresses([]);
            return;
        }

        const parsedLat = Number(latitude);
        const parsedLng = Number(longitude);
        const parsedRadius = Number(radiusKm || "10");

        setSearchAttempted(true);
        setSearchError(null);
        setCreateError(null);

        if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
            setSearchError("Please enter valid numeric coordinates.");
            setAddresses([]);
            return;
        }

        if (!isValidLatitude(parsedLat) || !isValidLongitude(parsedLng)) {
            setSearchError("Latitude must be between -90 to 90 and longitude between -180 to 180.");
            setAddresses([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await addressService.getNearbyAddresses({
                latitude: parsedLat,
                longitude: parsedLng,
                radius: Number.isFinite(parsedRadius) && parsedRadius > 0 ? parsedRadius : 10,
            });
            setSelectedAddress(null);
            setAddresses(normalizeAddresses(response));
        } catch (_error) {
            setSearchError("Failed to search nearby addresses.");
            setAddresses([]);
        } finally {
            setIsSearching(false);
        }
    }, [latitude, longitude, radiusKm]);

    useEffect(() => {
        const loadSelectedFromValue = async () => {
            if (!value || selectedAddress?.id === value) return;
            try {
                const existing = await addressService.getAddress(value);
                setSelectedAddress(existing);
                setLatitude(String(existing.latitude));
                setLongitude(String(existing.longitude));
            } catch (_error) {
                // Ignore prefill errors silently; user can still search/create.
            }
        };

        loadSelectedFromValue();
    }, [value, selectedAddress?.id]);

    const handleSelect = useCallback(
        (address: Address) => {
            setSelectedAddress(address);
            setCreateError(null);
            onSelect(address.id, address);
        },
        [onSelect]
    );

    const handleCreateAddress = useCallback(async () => {
        const parsedLat = Number(latitude);
        const parsedLng = Number(longitude);

        setCreateError(null);

        if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
            setCreateError("Please enter valid coordinates before creating an address.");
            return;
        }

        if (!createForm.city.trim() || !createForm.state.trim()) {
            setCreateError("City and State are required to create a new address.");
            return;
        }

        setIsCreating(true);
        try {
            const created = await addressService.createAddress({
                street: createForm.street.trim() || undefined,
                city: createForm.city.trim(),
                state: createForm.state.trim(),
                country: createForm.country.trim() || "India",
                postalCode: createForm.postalCode.trim() || undefined,
                latitude: parsedLat,
                longitude: parsedLng,
            });

            setSelectedAddress(created);
            setAddresses([created]);
            onSelect(created.id, created);
        } catch (_error) {
            setCreateError("Failed to create address. Please verify the details and try again.");
        } finally {
            setIsCreating(false);
        }
    }, [createForm, latitude, longitude, onSelect]);

    const showCreateForm = searchAttempted && !isSearching && (addresses?.length ?? 0) === 0;

    return (
        <div className="space-y-3">
            {label && <Label>{label}</Label>}

            <p className="text-xs text-gray-600">{placeholder}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => {
                        setLatitude(e.target.value);
                        setSelectedAddress(null);
                    }}
                    required={required && !selectedAddress}
                />
                <Input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => {
                        setLongitude(e.target.value);
                        setSelectedAddress(null);
                    }}
                    required={required && !selectedAddress}
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min="1"
                        placeholder="Radius (km)"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleSearchNearby}
                        disabled={isSearching}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        Search
                    </button>
                </div>
            </div>

            {searchError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {searchError}
                </div>
            )}

            {(addresses?.length ?? 0) > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Select from nearby addresses</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {addresses.filter((address): address is Address => Boolean(address?.id)).map((address) => (
                            <button
                                key={address.id}
                                type="button"
                                onClick={() => handleSelect(address)}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors flex gap-3"
                            >
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-medium text-gray-900 truncate">
                                        {address.street || "No street"}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate">{formatAddress(address)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showCreateForm && (
                <div className="space-y-3 p-3 border border-amber-200 rounded-lg bg-amber-50">
                    <p className="text-sm text-amber-800">No nearby address found. Add a new address below.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                            placeholder="Street (optional)"
                            value={createForm.street}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, street: e.target.value }))}
                        />
                        <Input
                            placeholder="Postal code (optional)"
                            value={createForm.postalCode}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                        />
                        <Input
                            placeholder="City *"
                            value={createForm.city}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, city: e.target.value }))}
                            required={required && !selectedAddress}
                        />
                        <Input
                            placeholder="State *"
                            value={createForm.state}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, state: e.target.value }))}
                            required={required && !selectedAddress}
                        />
                        <Input
                            placeholder="Country"
                            value={createForm.country}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, country: e.target.value }))}
                        />
                    </div>

                    {createError && <p className="text-sm text-red-700">{createError}</p>}

                    <button
                        type="button"
                        onClick={handleCreateAddress}
                        disabled={isCreating}
                        className="px-4 py-2 bg-[#005246] text-white rounded-lg hover:bg-[#003d34] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {isCreating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Address"
                        )}
                    </button>
                </div>
            )}

            {selectedAddress && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm">
                        <span className="font-medium text-green-900">Selected Address: </span>
                        <span className="text-green-700 block">{formatAddress(selectedAddress)}</span>
                        <span className="text-xs text-green-700 block mt-1">Address ID: {selectedAddress.id}</span>
                    </div>
                </div>
            )}

            {!searchAttempted && (
                <div className="text-xs text-gray-500">Enter coordinates and search to pick an address or create a new one.</div>
            )}
        </div>
    );
}
