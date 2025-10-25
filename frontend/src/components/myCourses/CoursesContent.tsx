'use client';

import React from 'react';
import PurchasedCoursesTable from '@/components/purchase/PurchasedCoursesTable';
import PurchasesGrid from '@/components/myCourses/PurchasesGrid';
import { PurchasedCourse } from '@/types/purchaseTypes';

type ViewMode = 'table' | 'grid';

interface Props {
  viewMode: ViewMode;
  purchases: PurchasedCourse[];
}

export default function CoursesContent({ viewMode, purchases }: Props) {
  if (viewMode === 'table') {
    return <PurchasedCoursesTable purchases={purchases} />;
  }

  return <PurchasesGrid purchases={purchases} />;
}
