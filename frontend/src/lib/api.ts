import axios from 'axios';
import { getSession } from 'next-auth/react';
import { AUTH_ROUTES } from '@/routes/authRoutes';
import { PURCHASE_ROUTES } from '@/routes/purchaseRoutes';
import { REFERRAL_ROUTES } from '@/routes/referralRoutes';
import { DASHBOARD_ROUTES } from '@/routes/dashboardRoutes';
import { BASE_URL } from '@/routes';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from NextAuth session
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, NextAuth will handle this
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; referralCode?: string }) =>
    axios.post(AUTH_ROUTES.REGISTER, data),
};

export const purchaseAPI = {
  initiate: (data: { courseId: string; courseName: string; amount: number }) =>
    api.post(PURCHASE_ROUTES.INITIATE, data),
  pay: (purchaseId: string, data: { cardNumber: string; expiry: string; cvv: string; cardHolder: string }) =>
    api.post(PURCHASE_ROUTES.PAY(purchaseId), data),
  getAll: () => api.get(PURCHASE_ROUTES.GET_ALL),
};

export const dashboardAPI = {
  get: () => api.get(DASHBOARD_ROUTES.GET),
};

export const referralAPI = {
  getAll: () => api.get(REFERRAL_ROUTES.GET_ALL),
  getStats: () => api.get(REFERRAL_ROUTES.GET_STATS),
};

export const courseAPI = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get('/courses', { params }),
  getLatest: (limit?: number) =>
    api.get('/courses/latest', { params: { limit } }),
  getById: (id: string) =>
    api.get(`/courses/${id}`),
};
