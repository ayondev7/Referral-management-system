import { BASE_URL } from './index';

const AUTH_BASE = `${BASE_URL}/api/auth`;

export const AUTH_ROUTES = {
  REGISTER: `${AUTH_BASE}/register`,
  LOGIN: `${AUTH_BASE}/login`,
  ME: `${AUTH_BASE}/me`,
  REFRESH: `${AUTH_BASE}/refresh`,
  LOGOUT: `${AUTH_BASE}/logout`,
} as const;
