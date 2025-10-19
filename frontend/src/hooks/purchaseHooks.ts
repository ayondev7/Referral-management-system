import { useMutation, useQuery } from '@/hooks';
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

interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PurchasedCourse {
  _id: string;
  userId: string;
  courseId: Course;
  courseName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  isFirstPurchase: boolean;
  paymentInfo?: {
    cardHolder: string;
    last4: string;
    paidAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PurchasedCoursesResponse {
  purchases: PurchasedCourse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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

export function usePurchasedCourses(page: number = 1, limit: number = 8) {
  return useQuery<PurchasedCoursesResponse, Error>({
    queryKey: ['purchasedCourses', page, limit],
    queryFn: async () => {
      const response = await purchaseAPI.getPurchasedCourses(page, limit);
      return response.data;
    },
  });
}