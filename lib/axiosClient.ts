import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";

export const refreshClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

export const apiClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true
});

let isRefreshing = false;
let refreshTokenFailed = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        // Token is managed by httpOnly cookies automatically with withCredentials: true
        return config;
    },
    (err) => Promise.reject(err)
);

apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // If refresh token is known to be failed/missing, don't attempt refresh
        if (refreshTokenFailed) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        // No need to manually set header, cookies handle it
                        return apiClient(originalRequest);
                    })
                    .catch((e) => Promise.reject(e));
            }

            isRefreshing = true;

            try {
                // Backend will use httpOnly refresh cookie automatically
                await refreshClient.post("/auth/refresh-token");
                refreshTokenFailed = false; // Reset on successful refresh
                processQueue(null, "refreshed");

                return apiClient(originalRequest);
            } catch (err: any) {
                // If refresh token is missing (404) or invalid, mark as failed to prevent infinite retries
                // 403 also means the refresh session is expired/invalid in our backend.
                if (err.response?.status === 404 || err.response?.status === 401 || err.response?.status === 403) {
                    refreshTokenFailed = true;
                }
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Reset refresh token failed flag when a new token is set (e.g., after login)
export const resetRefreshTokenState = () => {
    refreshTokenFailed = false;
};
