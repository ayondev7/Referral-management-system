'use client';

import React, { useState } from 'react';
import { useReferralsPaginated, useReferralAnalytics, useUser } from '@/hooks';
import ReferralsTable from '@/components/referral/ReferralsTable';
import ReferralCharts from '@/components/referral/ReferralCharts';
import ReferralStatsCard from '@/components/manageReferral/ReferralStatsCard';
import ReferralCard from '@/components/dashboard/ReferralCard';
import Pagination from '@/components/ui/Pagination';
import Loader from '@/components/ui/Loader';
import Tabs, { TabOption } from '@/components/ui/Tabs';
import { Referral } from '@/types';

const TABS = [
  { id: 'daily' as TabOption, label: 'Daily' },
  { id: 'monthly' as TabOption, label: 'Monthly' },
  { id: 'yearly' as TabOption, label: 'Yearly' },
];

export default function ManageReferralsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState<TabOption>('monthly');
  const itemsPerPage = 8;

  const { data, isLoading, error } = useReferralsPaginated(currentPage, itemsPerPage);
  const { data: analyticsData, isLoading: analyticsLoading } = useReferralAnalytics(timeRange);
  const { data: user } = useUser();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const referralLink = user?.referralCode
    ? `${window.location.origin}/register?ref=${user.referralCode}`
    : '';

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
          <div className="flex flex-col gap-4">
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
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
              <div className="flex-1 w-full lg:w-auto">
                {referralLink && <ReferralCard referralLink={referralLink} />}
              </div>
              
              <div className="flex items-center gap-4">
                <ReferralStatsCard referrals={referrals} />
                <Tabs tabs={TABS} activeTab={timeRange} onTabChange={setTimeRange} />
              </div>
            </div>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="flex items-center justify-center h-64 mb-8">
            <Loader />
          </div>
        ) : analyticsData?.chartData ? (
          <ReferralCharts data={analyticsData.chartData} timeRange={timeRange} />
        ) : null}

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
