import { useQuery, apiRequest } from '@/hooks';
import { REFERRAL_ROUTES } from '@/routes/referralRoutes';
import { Referral, ReferralStats, ReferralsResponse } from '@/types';

export function useReferrals() {
  return useQuery<Referral[]>({
    queryKey: ['referrals'],
    queryFn: async () => {
      return await apiRequest<Referral[]>({
        method: 'GET',
        url: REFERRAL_ROUTES.GET_ALL,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useReferralsPaginated(page: number = 1, limit: number = 8) {
  return useQuery<ReferralsResponse>({
    queryKey: ['referrals', 'paginated', page, limit],
    queryFn: async () => {
      return await apiRequest<ReferralsResponse>({
        method: 'GET',
        url: `${REFERRAL_ROUTES.GET_PAGINATED}?page=${page}&limit=${limit}`,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useReferralStats() {
  return useQuery<ReferralStats>({
    queryKey: ['referralStats'],
    queryFn: async () => {
      return await apiRequest<ReferralStats>({
        method: 'GET',
        url: REFERRAL_ROUTES.GET_STATS,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}
