'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@components/ui/Button';
import toast from 'react-hot-toast';
import { CLIENT_ROUTES } from '@/routes';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { data: user, isLoading } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);

  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
  router.push(CLIENT_ROUTES.HOME);
      router.refresh();
    } catch {
      await signOut({ redirect: false });
      router.push(CLIENT_ROUTES.HOME);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white/90 border-b border-slate-200 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href={CLIENT_ROUTES.DASHBOARD}>
            <h1 className="text-2xl font-bold text-blue-500 cursor-pointer">CourseHub</h1>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
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
            </nav>
          )}
        </div>
        
        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-900 hidden md:block">
              Welcome, {user.name}
            </span>
            <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg">
              Credits: {user.credits}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm" loading={loggingOut}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
