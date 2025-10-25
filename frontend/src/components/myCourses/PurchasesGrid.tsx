'use client';

import React from 'react';
import { PurchasedCourse } from '@/types/purchaseTypes';
import PurchaseCard from './PurchaseCard';

interface Props {
  purchases: PurchasedCourse[];
}

export default function PurchasesGrid({ purchases }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {purchases.map((purchase) => (
        <PurchaseCard key={purchase._id} purchase={purchase} />
      ))}
    </div>
  );
}
