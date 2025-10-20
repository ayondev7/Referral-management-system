import React from 'react';
import Image from 'next/image';
import { PurchasedCourse } from '@/types';

interface PurchasedCoursesTableProps {
  purchases: PurchasedCourse[];
}

const PurchasedCoursesTable: React.FC<PurchasedCoursesTableProps> = ({ purchases }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getLevelBadge = (category?: string) => {
    if (!category) return null;
    
    const categoryColors: Record<string, string> = {
      basic: 'bg-blue-100 text-blue-700',
      intermediate: 'bg-purple-100 text-purple-700',
      expert: 'bg-orange-100 text-orange-700',
      advanced: 'bg-pink-100 text-pink-700',
    };

    const color = categoryColors[category.toLowerCase()] || 'bg-gray-100 text-gray-700';

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}>
        {category}
      </span>
    );
  };

  if (!purchases || purchases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2">No Purchased Courses</h3>
          <p className="text-sm sm:text-base text-slate-600">You haven&apos;t purchased any courses yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Course
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Purchased On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {purchases.map((purchase) => (
                <tr
                  key={purchase._id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {purchase.courseId?.imageUrl ? (
                          <Image
                            src={purchase.courseId.imageUrl}
                            alt={purchase.courseId.title || purchase.courseName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400"
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
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {purchase.courseId?.title || purchase.courseName}
                        </p>
                        {purchase.isFirstPurchase && (
                          <span className="inline-flex items-center w-fit mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            First Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    {getLevelBadge(purchase.courseId?.category)}
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <p className="text-sm text-slate-700 font-medium">
                      {purchase.courseId?.author || 'N/A'}
                    </p>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <p className="text-sm font-semibold text-slate-900">
                      ${purchase.amount.toFixed(2)}
                    </p>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <div className="flex flex-col">
                      <p className="text-sm text-slate-700">
                        {formatDate(purchase.paymentInfo?.paidAt || purchase.createdAt)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTime(purchase.paymentInfo?.paidAt || purchase.createdAt)}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {purchases.map((purchase) => (
          <div
            key={purchase._id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                {purchase.courseId?.imageUrl ? (
                  <Image
                    src={purchase.courseId.imageUrl}
                    alt={purchase.courseId.title || purchase.courseName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-400"
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
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {purchase.courseId?.title || purchase.courseName}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {getLevelBadge(purchase.courseId?.category)}
                  {purchase.isFirstPurchase && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      First
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Instructor</p>
                <p className="text-sm text-slate-700 font-medium">
                  {purchase.courseId?.author || 'N/A'}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-sm font-semibold text-slate-900">
                  ${purchase.amount.toFixed(2)}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Purchased On</p>
                <p className="text-sm text-slate-700">
                  {formatDate(purchase.paymentInfo?.paidAt || purchase.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PurchasedCoursesTable;
