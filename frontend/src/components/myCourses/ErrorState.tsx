'use client';

import React from 'react';
import PageContainer from '@/components/shared/PageContainer';

interface ErrorStateProps {
  error: Error | unknown;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <PageContainer>
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Error Loading Courses
          </h3>
          <p className="text-slate-600">
            {error instanceof Error
              ? error.message
              : "Failed to load your purchased courses"}
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
