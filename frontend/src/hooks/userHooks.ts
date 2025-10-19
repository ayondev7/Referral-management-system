import { useQuery } from '@/hooks';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { AUTH_ROUTES } from '@/routes/authRoutes';

interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
}

export function useUser() {
  const { data: session, status } = useSession();

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios.get(AUTH_ROUTES.ME, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      return response.data;
    },
    enabled: status === 'authenticated' && !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
