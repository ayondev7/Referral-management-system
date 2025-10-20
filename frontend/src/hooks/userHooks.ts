import { useQuery, apiRequest } from '@/hooks';
import { useSession } from 'next-auth/react';
import { AUTH_ROUTES } from '@/routes/authRoutes';
import { User } from '@/types';

export function useUser() {
  const { data: session, status } = useSession();

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }

      return await apiRequest<User>({
        method: 'GET',
        url: AUTH_ROUTES.ME,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    },
    enabled: status === 'authenticated' && !!session?.accessToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
