'use client';

import React, { Suspense } from 'react';
import { RegisterForm } from '@components/auth/RegisterForm';
import { Loader } from '@components/ui/Loader';

function RegisterContent() {
  return <RegisterForm />;
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 auth-gradient-bg">
      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<Loader />}>
          <RegisterContent />
        </Suspense>
      </div>
    </div>
  );
}
