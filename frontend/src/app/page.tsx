'use client';

import React from 'react';
import { LoginForm } from '@components/auth/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 auth-gradient-bg">
      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
