import { useMutation, useQuery, apiRequest } from '@/hooks';
import { PURCHASE_ROUTES } from '@/routes/purchaseRoutes';
import { PurchasedCoursesResponse } from '@/types';

interface InitiatePurchaseParams {
  courseId: string;
  courseName: string;
  amount: number;
}

interface InitiatePurchaseResponse {
  purchaseId: string;
}

interface PayPurchaseParams {
  purchaseId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
}

export function useInitiatePurchase() {
  return useMutation<InitiatePurchaseResponse, Error, InitiatePurchaseParams>({
    mutationFn: async (params) => {
      return await apiRequest<InitiatePurchaseResponse>({
        method: 'POST',
        url: PURCHASE_ROUTES.INITIATE,
        data: params,
      });
    },
  });
}

export function usePayPurchase() {
  return useMutation<void, Error, PayPurchaseParams>({
    mutationFn: async (params) => {
      await apiRequest<void>({
        method: 'POST',
        url: PURCHASE_ROUTES.PAY(params.purchaseId),
        data: {
          cardNumber: params.cardNumber,
          expiry: params.expiry,
          cvv: params.cvv,
          cardHolder: params.cardHolder,
        },
      });
    },
  });
}

export function usePurchasedCourses(page: number = 1, limit: number = 8) {
  return useQuery<PurchasedCoursesResponse, Error>({
    queryKey: ['purchasedCourses', page, limit],
    queryFn: async () => {
      return await apiRequest<PurchasedCoursesResponse>({
        method: 'GET',
        url: PURCHASE_ROUTES.GET_PURCHASED_COURSES,
        params: { page, limit },
      });
    },
    staleTime: 2 * 60 * 1000,
  });
}