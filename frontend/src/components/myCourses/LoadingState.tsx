'use client';

import React from 'react';
import PageContainer from '@/components/shared/PageContainer';
import Loader from '@/components/ui/Loader';

export default function LoadingState() {
  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    </PageContainer>
  );
}
