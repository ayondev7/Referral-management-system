import { Course } from './courseTypes';
import { Pagination } from './courseTypes';

export interface PurchasedCourse {
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

export interface PurchasedCoursesResponse {
  purchases: PurchasedCourse[];
  pagination: Pagination;
}
