import { BASE_URL } from './index';

const REFERRAL_BASE = `${BASE_URL}/api/referrals`;

export const REFERRAL_ROUTES = {
  GET_ALL: REFERRAL_BASE,
  GET_PAGINATED: `${REFERRAL_BASE}/paginated`,
  GET_STATS: `${REFERRAL_BASE}/stats`,
} as const;
