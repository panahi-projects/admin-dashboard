import { RequestInterceptor } from "@/types/global";

let interceptors: RequestInterceptor[] = [];

export function registerInterceptor(interceptor: RequestInterceptor) {
  interceptors.push(interceptor);
  return () => {
    interceptors = interceptors.filter((i) => i !== interceptor);
  };
}

export function unregisterInterceptor(interceptor: RequestInterceptor) {
  interceptors = interceptors.filter((i) => i !== interceptor);
}

let responseInterceptors: ((response: Response) => Promise<Response>)[] = [];

export function registerResponseInterceptor(
  interceptor: (response: Response) => Promise<Response>
) {
  responseInterceptors.push(interceptor);
  return () => {
    responseInterceptors = responseInterceptors.filter(
      (i) => i !== interceptor
    );
  };
}

export function unregisterResponseInterceptor(
  interceptor: (response: Response) => Promise<Response>
) {
  responseInterceptors = responseInterceptors.filter((i) => i !== interceptor);
}
