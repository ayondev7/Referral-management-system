import { useQuery as useReactQuery } from '@tanstack/react-query';
import { apiRequest } from '@/hooks';
import { REFERRAL_ROUTES } from '@/routes/referralRoutes';
import { Referral, ReferralStats, ReferralsResponse, ReferralAnalyticsResponse } from '@/types';
import { TabOption } from '@/components/ui/Tabs';

export function useReferrals() {
  return useReactQuery<Referral[]>({
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
  return useReactQuery<ReferralsResponse>({
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
  return useReactQuery<ReferralStats>({
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

export function useReferralAnalytics(timeRange: TabOption) {
  return useReactQuery<ReferralAnalyticsResponse>({
    queryKey: ['referralAnalytics', timeRange],
    queryFn: async () => {
      return await apiRequest<ReferralAnalyticsResponse>({
        method: 'GET',
        url: `${REFERRAL_ROUTES.GET_ANALYTICS}?timeRange=${timeRange}`,
      });
    },
    staleTime: 5 * 60 * 1000,
  });
}
