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
    async createAddress(data: CreateAddressRequest): Promise<Address> {
        const response = await apiClient.post<{ data: Address }>("/address", data);
        return response.data.data;
    }

    async getAddress(id: string): Promise<Address> {
        const response = await apiClient.get<{ data: Address }>(`/address/byId/${id}`);
        return response.data.data;
    }

    async updateAddress(id: string, data: UpdateAddressRequest): Promise<Address> {
        const response = await apiClient.put<{ data: Address }>(`/address/byId/${id}`, data);
        return response.data.data;
    }

    async getNearbyAddresses(params: NearbyAddressParams): Promise<Address[]> {
        const response = await apiClient.get<{ data: Address[] }>("/address/nearby", { params });
        return response.data.data;
    }
}

export const addressService = new AddressService();
