import { BASE_URL } from './index';

const DASHBOARD_BASE = `${BASE_URL}/api/dashboard`;

export const DASHBOARD_ROUTES = {
  GET: DASHBOARD_BASE,
} as const;
