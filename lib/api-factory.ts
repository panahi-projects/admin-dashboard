// @/lib/api-factory.ts
import { useAuthStore } from "@/stores/auth-store";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

type ApiFactoryOptions = {
  baseURL?: string;
  secure?: boolean;
};

const createApiFactory = ({
  baseURL,
  secure = true,
}: ApiFactoryOptions = {}) => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL || "http://localhost:5019/api",
  });

  if (secure) {
    // Attach token from Zustand store
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (config?.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return {
    get: <T>(url: string, config?: InternalAxiosRequestConfig) =>
      instance.get<T>(url, config),
    post: <T>(
      url: string,
      data?: unknown,
      config?: InternalAxiosRequestConfig
    ) => instance.post<T>(url, data, config),
    put: <T>(
      url: string,
      data?: unknown,
      config?: InternalAxiosRequestConfig
    ) => instance.put<T>(url, data, config),
    delete: <T>(url: string, config?: InternalAxiosRequestConfig) =>
      instance.delete<T>(url, config),
  };
};

export default createApiFactory;
