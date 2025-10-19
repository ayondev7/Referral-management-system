'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useDashboardStore } from '@store/dashboardStore';
import { dashboardAPI, courseAPI } from '@lib/api';
import { StatsCard } from '@components/dashboard/StatsCard';
import { ReferralCard } from '@components/dashboard/ReferralCard';
import { CourseItem } from '@components/dashboard/CourseItem';
import { Loader } from '@components/ui/Loader';
import { Button } from '@components/ui/Button';
import { CLIENT_ROUTES } from '@/routes';

interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
}

export default function DashboardPage() {
  const { status } = useSession();
  const { dashboard, loading, setDashboard, setLoading } = useDashboardStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
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

    const fetchLatestCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await courseAPI.getLatest(6);
        setCourses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchDashboard();
    fetchLatestCourses();
  }, [status, setDashboard, setLoading]);

  if (status === 'loading' || loading || !dashboard) {
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

        {/* Latest Courses Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Latest Courses</h2>
              <Link href={CLIENT_ROUTES.COURSES}>
              <Button variant="outline" size="sm">
                View All Courses
              </Button>
            </Link>
          </div>

          {loadingCourses ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="md" />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseItem key={course._id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-300">
              <p className="text-slate-600">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
