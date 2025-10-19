import { BASE_URL } from './index';

const PURCHASE_BASE = `${BASE_URL}/api/purchases`;

export const PURCHASE_ROUTES = {
  INITIATE: `${PURCHASE_BASE}/initiate`,
  PAY: (purchaseId: string) => `${PURCHASE_BASE}/pay/${purchaseId}`,
  GET_ALL: PURCHASE_BASE,
  GET_PURCHASED_COURSES: `${PURCHASE_BASE}/purchased-courses`,
} as const;
