'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import Tabs from '@/components/ui/Tabs';

type ViewMode = 'table' | 'grid';

interface Props {
  totalPurchases: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const VIEW_TABS = [
  { id: 'table' as ViewMode, label: 'Table View' },
  { id: 'grid' as ViewMode, label: 'Grid View' },
];

export default function Header({ totalPurchases, viewMode, setViewMode }: Props) {
  const subtitle = totalPurchases > 0
    ? `You have purchased ${totalPurchases} ${totalPurchases === 1 ? 'course' : 'courses'}`
    : 'Start your learning journey by purchasing your first course';

  const action = (
    <Tabs<ViewMode>
      tabs={VIEW_TABS}
      activeTab={viewMode}
      onTabChange={setViewMode}
      className="lg:w-[300px]"
    />
  );

  return (
    <PageHeader 
      title="My Courses" 
      subtitle={subtitle} 
      action={action} 
    />
  );
}
