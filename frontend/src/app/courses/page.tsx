'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES } from '@/routes';
import { useAuthStore } from '@store/authStore';
import { useSession } from 'next-auth/react';
import { useCourses } from '@/hooks';
import CourseCard from '@components/dashboard/CourseCard';
import Loader from '@components/ui/Loader';
import Pagination from '@components/ui/Pagination';

export default function CoursesPage() {
  const router = useRouter();
  const { isAuthenticated: storeAuth } = useAuthStore();
  const { data: session, status } = useSession();

  type SessionWithToken = { accessToken?: string };
  const hasAccessToken = !!(session && 'accessToken' in session && (session as SessionWithToken).accessToken);
  const isAuthenticated = status === 'authenticated' || !!storeAuth || hasAccessToken;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useCourses(currentPage, 9);
  const courses = data?.courses || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    limit: 9,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(CLIENT_ROUTES.HOME);
      return;
    }
  }, [isAuthenticated, router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] p-8 bg-slate-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">All Courses</h1>
          <p className="text-base text-slate-900 opacity-70">
            Browse and purchase from our collection of {pagination.totalCourses} courses
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mb-8"
            />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Courses Available</h3>
              <p className="text-slate-600">
                Check back later for new courses or contact support for assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
