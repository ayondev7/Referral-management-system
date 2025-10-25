'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { IoIosArrowForward } from 'react-icons/io';
import { useDashboard, useLatestCourses } from '@/hooks';
import StatsCard from '@components/dashboard/StatsCard';
import ReferralCard from '@components/dashboard/ReferralCard';
import CourseCard from '@/components/dashboard/CourseCard';
import Loader from '@components/ui/Loader';
import Button from '@components/ui/Button';
import { CLIENT_ROUTES } from '@/routes';

export default function DashboardPage() {
  const { status } = useSession();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: courses = [], isLoading: coursesLoading } = useLatestCourses(6);

  if (status === 'loading' || dashboardLoading || !dashboard) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 bg-slate-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-900 opacity-70">
            Manage your referrals and purchase courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Latest Courses</h2>
            <Link href={CLIENT_ROUTES.COURSES}>
              <Button variant="ghost" size="sm" className='flex justify-center items-center' icon={<IoIosArrowForward className="w-4 h-4" />}>
                View All Courses
              </Button>
            </Link>
          </div>

          {coursesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="md" />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
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
