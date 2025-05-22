// @/lib/api-factory.ts
import { useAuthStore } from "@/stores/auth-store";
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
  isCancel,
} from "axios";

type ApiFactoryOptions = {
  baseURL?: string;
  secure?: boolean;
};

export type RequestConfig = InternalAxiosRequestConfig & {
  signal?: AbortSignal;
  headers?: AxiosHeaders | Record<string, string>;
};

export type ApiInstance = {
  get: <T>(url: string, config?: RequestConfig) => Promise<AxiosResponse<T>>;
  post: <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<AxiosResponse<T>>;
  put: <T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ) => Promise<AxiosResponse<T>>;
  delete: <T>(url: string, config?: RequestConfig) => Promise<AxiosResponse<T>>;
  isError: (error: unknown) => error is AxiosError;
  createAbortController: () => AbortController;
  isCancel: (error: unknown) => boolean;
  headers: AxiosHeaders;
};

const createApiFactory = ({ baseURL }: ApiFactoryOptions = {}): ApiInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL: baseURL || "/api",
    withCredentials: true,
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (isCancel(error)) {
        return Promise.reject({
          isCancel: true,
          message: "Request was aborted",
        });
      }

      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshAbortController = new AbortController();

          await axios.post(
            "/api/auth/refresh",
            {},
            {
              withCredentials: true,
              signal: refreshAbortController.signal,
              headers: new AxiosHeaders(),
            }
          );

          return instance({
            ...originalRequest,
            _retry: true,
          });
        } catch (refreshError) {
          if (!isCancel(refreshError)) {
            useAuthStore.getState().logout();
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Separate handlers for methods with different signatures
  const wrapGetDelete = <T>(
    method: (url: string, config?: RequestConfig) => Promise<AxiosResponse<T>>
  ) => {
    return (url: string, config?: RequestConfig) => {
      const controller = new AbortController();
      const finalConfig = {
        ...config,
        signal: controller.signal,
        headers: new AxiosHeaders(config?.headers),
      };
      return method(url, finalConfig);
    };
  };

  const wrapPostPut = <T>(
    method: (
      url: string,
      data?: unknown,
      config?: RequestConfig
    ) => Promise<AxiosResponse<T>>
  ) => {
    return (url: string, data?: unknown, config?: RequestConfig) => {
      const controller = new AbortController();
      const finalConfig: RequestConfig | unknown = config
        ? { ...config, signal: controller.signal }
        : { signal: controller.signal };
      return method(url, data, finalConfig as RequestConfig);
    };
  };

  return {
    get: wrapGetDelete(instance.get),
    post: wrapPostPut(instance.post),
    put: wrapPostPut(instance.put),
    delete: wrapGetDelete(instance.delete),
    isError: (error: unknown): error is AxiosError =>
      isAxiosError(error) && !(error as { isCancel?: boolean }).isCancel,
    createAbortController: () => new AbortController(),
    isCancel: (error: unknown): boolean => isCancel(error),
    headers: new AxiosHeaders(),
  };
};

const api = createApiFactory();
export default api;
