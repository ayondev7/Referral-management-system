'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { Button } from '@components/ui/Button';
import { authAPI } from '@lib/api';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo">CourseHub</h1>
        
        {isAuthenticated && user && (
          <div className="header-actions">
            <span className="header-user">
              Welcome, {user.name}
            </span>
            <span className="header-credits">
              Credits: {user.credits}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
