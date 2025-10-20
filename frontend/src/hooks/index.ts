import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export { useUser } from './userHooks';
export { useCourse } from './courseHooks';
export { useInitiatePurchase, usePayPurchase, usePurchasedCourses } from './purchaseHooks';
