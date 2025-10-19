'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { useDashboardStore } from '@store/dashboardStore';
import { dashboardAPI } from '@lib/api';
import { StatsCard } from '@components/dashboard/StatsCard';
import { ReferralCard } from '@components/dashboard/ReferralCard';
import { CourseCard } from '@components/dashboard/CourseCard';
import { Loader } from '@components/ui/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { dashboard, loading, setDashboard, setLoading } = useDashboardStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.get();
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, router, setDashboard, setLoading]);

  if (loading || !dashboard) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] p-8 bg-slate-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-base text-slate-900 opacity-70">
            Manage your referrals and purchase courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Referrals"
            value={dashboard.totalReferredUsers}
            gradient="gradient-blue"
          />
          <StatsCard
            title="Converted Referrals"
            value={dashboard.convertedUsers}
            gradient="gradient-green"
          />
          <StatsCard
            title="Total Credits"
            value={dashboard.totalCredits}
            gradient="gradient-purple"
          />
        </div>

        <ReferralCard referralLink={dashboard.referralLink} />
        <CourseCard />
      </div>
    </div>
  );
}
