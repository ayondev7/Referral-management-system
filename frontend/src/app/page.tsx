'use client';

import React from 'react';
import { LoginForm } from '@components/auth/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
