import axios from 'axios';
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

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(AUTH_ROUTES.REFRESH, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; referralCode?: string }) =>
    axios.post(AUTH_ROUTES.REGISTER, data),
  login: (data: { email: string; password: string }) =>
    axios.post(AUTH_ROUTES.LOGIN, data),
  logout: () => axios.post(AUTH_ROUTES.LOGOUT),
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
