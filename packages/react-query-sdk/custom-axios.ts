import { setupAxiosInterceptors } from "@react-auth-setup";
import { useAuthStore } from "@react-auth-storage";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { functionsUrlSuffix } from "./constants";

const apiAxiosInstance = axios.create({
  paramsSerializer: { indexes: null },
  baseURL: process.env.EXPO_PUBLIC_OPEN_API_SERVER_URL,
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY,
  },
});

const functionsAxiosInstance = axios.create({
  paramsSerializer: { indexes: null },
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_API_KEY,
  },
});

// Setup interceptors for both instances
const setupInterceptors = (instance: typeof apiAxiosInstance) => {
  setupAxiosInterceptors({
    axiosInstance: instance,
    customErrorMiddleware: async (error) => {
      if (error?.response.status === 401) {
        console.log("401 error - trying to refresh session", error);
        const accessToken = await useAuthStore.getState().refreshSession();
        if (accessToken) {
          const originalRequest = error.config;
          // update the token in the original request and retry
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          console.log("Retrying");
          return instance(originalRequest);
        }
      }
      throw error;
    },
  });
};

setupInterceptors(apiAxiosInstance);
setupInterceptors(functionsAxiosInstance);

const customAxios = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  // Determine which instance to use based on URL path
  const isAFunction = config.url?.startsWith(functionsUrlSuffix);

  const instance = isAFunction ? functionsAxiosInstance : apiAxiosInstance;
  try {
    const { data } = await instance.request({
      ...config,
      ...options,
    });
    return data;
  } catch (e) {
    throw e;
  }
};

type ErrorType<Error> = AxiosError<Error>;

export { customAxios };
export type { ErrorType };
