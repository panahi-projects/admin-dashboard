// @/lib/api-factory.ts
import { useAuthStore } from "@/stores/auth-store";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

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
  isError: (error: unknown) => error is AxiosError;
};

const createApiFactory = ({
  baseURL,
  secure = true,
}: ApiFactoryOptions = {}) => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL || "/api",
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't already retried
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          await axios.post(
            "/api/auth/refresh",
            {},
            {
              withCredentials: true,
            }
          );

          // Retry original request with new token
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear auth state
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

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
    isError: isAxiosError,
  };
};

// Create a default API instance
const api = createApiFactory();

export default api;
