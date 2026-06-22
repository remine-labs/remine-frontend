import axios from "axios";
import router from "../router";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/refresh" &&
      originalRequest.url !== "/api/logout"
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        router.replace("/");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
