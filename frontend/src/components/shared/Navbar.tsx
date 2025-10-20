 'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useUser } from '@/hooks/userHooks';
import Image from 'next/image';
import Button from '@components/ui/Button';
import Sidebar from '@components/shared/Sidebar';
import { CLIENT_ROUTES } from '@/routes';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { data: user } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut({ redirect: true, callbackUrl: CLIENT_ROUTES.HOME });
    } catch {
      try {
        await signOut({ redirect: false });
      } finally {
        router.push(CLIENT_ROUTES.HOME);
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user?.name}
        userCredits={user?.credits}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <header className="bg-white/90 border-b border-slate-200 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-8">
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <Link href={CLIENT_ROUTES.DASHBOARD}>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-500 cursor-pointer">
                CourseHub
              </h1>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  href={CLIENT_ROUTES.DASHBOARD}
                  className={`text-sm font-medium transition-colors ${
                    isActive(CLIENT_ROUTES.DASHBOARD)
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href={CLIENT_ROUTES.COURSES}
                  className={`text-sm font-medium transition-colors ${
                    isActive(CLIENT_ROUTES.COURSES) || pathname?.startsWith(CLIENT_ROUTES.COURSES)
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Courses
                </Link>
                <Link
                  href={CLIENT_ROUTES.MY_COURSES}
                  className={`text-sm font-medium transition-colors ${
                    isActive(CLIENT_ROUTES.MY_COURSES)
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Courses
                </Link>
                <Link
                  href={CLIENT_ROUTES.MANAGE_REFERRALS}
                  className={`text-sm font-medium transition-colors ${
                    isActive(CLIENT_ROUTES.MANAGE_REFERRALS)
                      ? 'text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Manage Referrals
                </Link>
              </nav>
            )}
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-3">
                <Image
                  src={'https://cdn-icons-png.freepik.com/512/3607/3607444.png'}
                  alt={user.name || 'User avatar'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="hidden xl:block text-sm text-slate-900 font-medium">
                  {user.name}
                </span>
              </div>

              <span className="text-xs sm:text-sm font-semibold text-blue-500 bg-blue-50 px-2 sm:px-3 py-1.5 rounded-lg">
                {user.credits}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm" loading={loggingOut} className="hidden md:block">
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
