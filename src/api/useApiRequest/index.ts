import axios, { AxiosError, AxiosResponse } from 'axios';
import { useBetsieStore } from '../../store/useBetsieStore';
import { Endpoint } from '../types';

// --- Create Axios instance ---
const axiosInstance = axios.create();

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  config => {
    const { token } = useBetsieStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('❌ Token expired or invalid. Logging out...');
      const { logout } = useBetsieStore.getState();

      // Clear stored credentials and state
      await logout();

      // ⚠️ Optional: you can trigger navigation back to Login here
      // e.g. useNavigation().reset(...)
    }

    return Promise.reject(error);
  },
);

// --- Helper: build URL with params ---
function buildUrl(url: string, params?: Record<string, any>) {
  if (!params) return url;
  let finalUrl = url;
  Object.keys(params).forEach(key => {
    finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(params[key]));
  });
  return finalUrl;
}

// --- API Request Wrapper ---
async function apiRequest<T = any>(
  endpoint: Endpoint,
  data?: any,
  contentType: string = 'application/json',
  params?: Record<string, any>,
): Promise<T | { success: false; status?: number; message: string; data?: any }> {
  try {
    const res: AxiosResponse<T> = await axiosInstance({
      method: endpoint.method,
      url: buildUrl(endpoint.url, params),
      data,
      headers: {
        'Content-Type': contentType,
      },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || 'Something went wrong',
      data: error.response?.data,
    };
  }
}

// --- Hook wrapper ---
function useApiRequest() {
  return async <T = any>(
    endpoint: Endpoint,
    data?: any,
    contentType: string = 'application/json',
    params?: Record<string, any>,
  ) => {
    return await apiRequest<T>(endpoint, data, contentType, params);
  };
}

export { apiRequest, useApiRequest, axiosInstance };
