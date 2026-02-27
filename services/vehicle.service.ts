import { apiClient } from "@/lib/axiosClient";
import type { PaginatedResponse, MessageResponse } from "@/types/common";
import type {
    Vehicle,
    CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleQueryParams,
} from "@/types/vehicle";

// ──────────────────────────────────────────────
// Vehicle Service
// ──────────────────────────────────────────────

class VehicleService {
    async getVehicles(params?: VehicleQueryParams): Promise<PaginatedResponse<Vehicle>> {
        const response = await apiClient.get<PaginatedResponse<Vehicle>>("/vehicle", { params });
        return response.data;
    }

    async getNearbyVehicles(params: { latitude: number; longitude: number; radius?: number }): Promise<Vehicle[]> {
        const response = await apiClient.get<{ data: Vehicle[] }>("/vehicle/nearby", { params });
        return response.data.data;
    }

    async getMyVehicles(): Promise<Vehicle[]> {
        const response = await apiClient.get<{ data: Vehicle[] }>("/vehicle/provider/my-vehicles");
        return response.data.data;
    }

    async getVehicle(id: string): Promise<Vehicle> {
        const response = await apiClient.get<{ data: Vehicle }>(`/vehicle/${id}`);
        return response.data.data;
    }

    async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
        const response = await apiClient.post<{ data: Vehicle }>("/vehicle", data);
        return response.data.data;
    }

    async updateVehicle(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
        const response = await apiClient.patch<{ data: Vehicle }>(`/vehicle/${id}`, data);
        return response.data.data;
    }

    async deleteVehicle(id: string): Promise<MessageResponse> {
        const response = await apiClient.delete<MessageResponse>(`/vehicle/${id}`);
        return response.data;
    }
}

export const vehicleService = new VehicleService();
