import { Pagination } from './courseTypes';

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
