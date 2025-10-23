import axios from 'axios';
import { AUTH_ROUTES } from '@/routes/authRoutes';
import { BASE_URL } from '@/routes';

const authClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string; referralCode?: string }) =>
    authClient.post(AUTH_ROUTES.REGISTER, data),
  guestLogin: () =>
    authClient.post(AUTH_ROUTES.GUEST_LOGIN),
};
