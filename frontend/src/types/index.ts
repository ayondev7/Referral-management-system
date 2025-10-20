export interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
}

export interface Dashboard {
  totalReferredUsers: number;
  convertedUsers: number;
  totalCredits: number;
  referralLink: string;
}

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

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  totalCourses?: number;
  limit?: number;
  itemsPerPage?: number;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  hasPrevPage?: boolean;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: Pagination;
}

export interface PurchasedCoursesResponse {
  purchases: PurchasedCourse[];
  pagination: Pagination;
}

export interface Referral {
  _id: string;
  referrerId: string;
  referredId: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  status: 'pending' | 'converted';
  createdAt: string;
  updatedAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  pendingReferrals: number;
  totalCreditsEarned: number;
}

export interface ReferralsResponse {
  referrals: Referral[];
  pagination: Pagination;
}
