import { useMutation } from '@/hooks';
import { purchaseAPI } from '@/lib/api';

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
      const response = await purchaseAPI.initiate(params);
      return response.data;
    },
  });
}

export function usePayPurchase() {
  return useMutation<void, Error, PayPurchaseParams>({
    mutationFn: async (params) => {
      await purchaseAPI.pay(params.purchaseId, {
        cardNumber: params.cardNumber,
        expiry: params.expiry,
        cvv: params.cvv,
        cardHolder: params.cardHolder,
      });
    },
  });
}