import { useQuery, apiRequest } from '@/hooks';
import { DASHBOARD_ROUTES } from '@/routes/dashboardRoutes';
import { Dashboard } from '@/types';

export function useDashboard() {
  return useQuery<Dashboard>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      return await apiRequest<Dashboard>({
        method: 'GET',
        url: DASHBOARD_ROUTES.GET,
      });
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
