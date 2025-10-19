import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

// Export query hooks for use throughout the app
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export { useUser } from './userHooks';
export { useCourse } from './courseHooks';
export { useInitiatePurchase, usePayPurchase, usePurchasedCourses } from './purchaseHooks';
