'use client';

import React from 'react';
import Image from 'next/image';
import { PurchasedCourse } from '@/types/purchaseTypes';

interface Props {
  purchase: PurchasedCourse;
}

export default function PurchaseCard({ purchase }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full h-48 bg-slate-100">
        {purchase.courseId?.imageUrl ? (
          <Image
            src={purchase.courseId.imageUrl}
            alt={purchase.courseId.title || purchase.courseName}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        {purchase.isFirstPurchase && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              First
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
          {purchase.courseId?.title || purchase.courseName}
        </h3>
        <p className="text-sm text-slate-600 mb-3">{purchase.courseId?.author || 'N/A'}</p>
        <div className="flex items-center justify-between mb-3">
          {purchase.courseId?.category && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
              {purchase.courseId.category}
            </span>
          )}
          <span className="text-lg font-bold text-slate-900">${purchase.amount.toFixed(2)}</span>
        </div>
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Purchased on {new Date(purchase.paymentInfo?.paidAt || purchase.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
