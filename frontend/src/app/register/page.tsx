'use client';

import React, { Suspense, useEffect } from 'react';
import RegisterForm from '@components/auth/RegisterForm';
import Loader from '@components/ui/Loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES } from '@/routes';

function RegisterContent() {
  return <RegisterForm />;
}

export default function RegisterPage() {
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
        <Suspense fallback={<Loader />}>
          <RegisterContent />
        </Suspense>
      </div>
    </div>
  );
}
