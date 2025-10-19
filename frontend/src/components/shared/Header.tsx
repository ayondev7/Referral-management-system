'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { Button } from '@components/ui/Button';
import { authAPI } from '@lib/api';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      logout();
      router.push('/');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-white/90 border-b border-slate-200 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500 cursor-pointer">CourseHub</h1>
        
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
