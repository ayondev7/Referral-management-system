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
      <div className="dashboard-loading">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your referrals and purchase courses
          </p>
        </div>

        <div className="stats-grid">
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
