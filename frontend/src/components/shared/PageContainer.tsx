'use client';

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
