import { QueryClient, useQuery as useReactQuery, useMutation as useReactMutation, useQueryClient as useReactQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { BASE_URL, CLIENT_ROUTES } from '@/routes';

let cachedSession: { accessToken: string } | null = null;
let sessionCacheTime = 0;
const SESSION_CACHE_DURATION = 30000;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const now = Date.now();
      
      if (cachedSession && now - sessionCacheTime < SESSION_CACHE_DURATION) {
        if (cachedSession?.accessToken) {
          config.headers.Authorization = `Bearer ${cachedSession.accessToken}`;
        }
      } else {
        const session = await getSession();
        cachedSession = session as { accessToken: string } | null;
        sessionCacheTime = now;
        
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      cachedSession = null;
      sessionCacheTime = 0;
      
      if (typeof window !== 'undefined') {
        window.location.href = CLIENT_ROUTES.HOME;
      }
    }
    return Promise.reject(error);
  }
);

interface ApiRequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export async function apiRequest<T>(config: ApiRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || axiosError.message || 'An error occurred');
  }
}

export function useQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>
) {
  return useReactQuery<TData, TError>(options);
}

export function useMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
) {
  return useReactMutation<TData, TError, TVariables, TContext>(options);
}

export function useQueryClient() {
  return useReactQueryClient();
}

export { useUser } from './userHooks';
export { useCourse, useCourses, useLatestCourses } from './courseHooks';
export { useInitiatePurchase, usePayPurchase, usePurchasedCourses } from './purchaseHooks';
export { useDashboard } from './dashboardHooks';
export { useReferrals, useReferralsPaginated, useReferralStats, useReferralAnalytics } from './referralHooks';
