'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@components/auth/LoginForm';
import { useSession } from 'next-auth/react';
import { CLIENT_ROUTES } from '@/routes';
import Loader from '@components/ui/Loader';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace(CLIENT_ROUTES.DASHBOARD);
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
        <Loader />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
