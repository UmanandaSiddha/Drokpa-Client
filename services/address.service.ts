import { apiClient } from "@/lib/axiosClient";
import type { MessageResponse } from "@/types/common";
import type {
    Address,
    CreateAddressRequest,
    UpdateAddressRequest,
    NearbyAddressParams,
} from "@/types/address";

// ──────────────────────────────────────────────
// Address Service
// ──────────────────────────────────────────────

class AddressService {
    private extractAddress(payload: any): Address {
        return payload?.data ?? payload;
    }

    private extractAddressList(payload: any): Address[] {
        const list = payload?.data ?? payload;
        return Array.isArray(list) ? list : [];
    }

    async createAddress(data: CreateAddressRequest): Promise<Address> {
        const response = await apiClient.post<Address | { data: Address }>("/address", data);
        return this.extractAddress(response.data);
    }

    async getAddress(id: string): Promise<Address> {
        const response = await apiClient.get<Address | { data: Address }>(`/address/byId/${id}`);
        return this.extractAddress(response.data);
    }

    async updateAddress(id: string, data: UpdateAddressRequest): Promise<Address> {
        const response = await apiClient.put<Address | { data: Address }>(`/address/byId/${id}`, data);
        return this.extractAddress(response.data);
    }

    async getNearbyAddresses(params: NearbyAddressParams): Promise<Address[]> {
        const response = await apiClient.get<Address[] | { data: Address[] }>("/address/nearby", { params });
        return this.extractAddressList(response.data);
    }
}

export const addressService = new AddressService();
