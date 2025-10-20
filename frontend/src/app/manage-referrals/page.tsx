'use client';

import React, { useState } from 'react';
import { useReferralsPaginated } from '@/hooks';
import ReferralsTable from '@/components/referral/ReferralsTable';
import Pagination from '@/components/ui/Pagination';
import Loader from '@/components/ui/Loader';
import { Referral } from '@/types';

export default function ManageReferralsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data, isLoading, error } = useReferralsPaginated(currentPage, itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error Loading Referrals
              </h3>
              <p className="text-slate-600">
                {error instanceof Error ? error.message : 'Failed to load your referrals'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { referrals = [], pagination } = data || {};
  const totalReferrals = pagination?.totalItems || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Manage Referrals
              </h1>
              <p className="text-slate-600">
                {totalReferrals > 0
                  ? `You have referred ${totalReferrals} ${totalReferrals === 1 ? 'user' : 'users'}`
                  : 'Start earning credits by referring friends'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Converted</p>
                  <p className="text-lg font-bold text-slate-900">
                    {referrals.filter((r: Referral) => r.status === 'converted').length}
                  </p>
                </div>
              </div>
              
              <div className="w-px h-10 bg-slate-200"></div>
              
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 rounded-full p-2">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Pending</p>
                  <p className="text-lg font-bold text-slate-900">
                    {referrals.filter((r: Referral) => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReferralsTable referrals={referrals} />

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
