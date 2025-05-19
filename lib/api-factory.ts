// @/lib/api-factory.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";

// Extend the Axios config to include _retry
declare module "axios" {
  interface InternalAxiosRequestConfig<D> {
    _retry?: boolean;
  }
}

type ApiFactoryOptions = {
  baseURL?: string;
  secure?: boolean;
};

export type ApiInstance = {
  get: <T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
  post: <T>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
  put: <T>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
  delete: <T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
};

const createApiFactory = ({
  baseURL,
  secure = true,
}: ApiFactoryOptions = {}) => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL || "/api",
    withCredentials: true,
  });

  if (secure) {
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

// Create a default API instance
const api = createApiFactory();

export default api;
