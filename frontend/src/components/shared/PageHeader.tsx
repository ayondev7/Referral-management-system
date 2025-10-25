'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-sm sm:text-base text-slate-600">{subtitle}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
