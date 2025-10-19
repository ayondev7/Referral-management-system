'use client';

import React, { Suspense } from 'react';
import { RegisterForm } from '@components/auth/RegisterForm';
import { Loader } from '@components/ui/Loader';

function RegisterContent() {
  return <RegisterForm />;
}

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Suspense fallback={<Loader />}>
          <RegisterContent />
        </Suspense>
      </div>
    </div>
  );
}
