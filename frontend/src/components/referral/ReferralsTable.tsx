import React from 'react';
import { Referral } from '@/types';

interface ReferralsTableProps {
  referrals: Referral[];
}

const ReferralsTable: React.FC<ReferralsTableProps> = ({ referrals }) => {
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

  const getStatusBadge = (status: 'pending' | 'converted') => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      converted: 'bg-green-100 text-green-700 border-green-200',
    };

    const statusText = {
      pending: 'Pending',
      converted: 'Converted',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[status]
        }`}
      >
        {statusText[status]}
      </span>
    );
  };

  if (!referrals || referrals.length === 0) {
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2">No Referrals Yet</h3>
          <p className="text-sm sm:text-base text-slate-600">Share your referral link to start earning credits.</p>
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
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  User Name
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Referred On
                </th>
                <th className="text-left py-3 lg:py-4 px-3 lg:px-6 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {referrals.map((referral, index) => (
                <tr
                  key={referral._id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <span className="text-sm font-semibold text-slate-900">
                      #{index + 1}
                    </span>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <p className="text-sm font-semibold text-slate-900">
                      {referral.referredId?.name || 'N/A'}
                    </p>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <p className="text-sm text-slate-700">
                      {referral.referredId?.email || 'N/A'}
                    </p>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    <div className="flex flex-col">
                      <p className="text-sm text-slate-700">
                        {formatDate(referral.createdAt)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatTime(referral.createdAt)}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 lg:py-4 px-3 lg:px-6">
                    {getStatusBadge(referral.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {referrals.map((referral, index) => (
          <div
            key={referral._id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-900">
                #{index + 1}
              </span>
              {getStatusBadge(referral.status)}
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">User Name</p>
                <p className="text-sm font-semibold text-slate-900">
                  {referral.referredId?.name || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="text-sm text-slate-700 break-all">
                  {referral.referredId?.email || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Referred On</p>
                <p className="text-sm text-slate-700">
                  {formatDate(referral.createdAt)} at {formatTime(referral.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReferralsTable;
