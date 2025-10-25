"use client";

import React from "react";
import { Referral } from "@/types";

interface ReferralStatsCardProps {
  referrals: Referral[];
}

export default function ReferralStatsCard({
  referrals,
}: ReferralStatsCardProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg shadow-sm border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-[2px] md:min-w-[350px] w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
        <div
          className="bg-blue-100 rounded-full p-1.5 sm:p-2"
          style={{ backgroundColor: "rgba(21, 93, 253, 0.1)" }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: "#155dfd" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex gap-x-2 text-nowrap text-sm text-slate-600">
          <span>Converted</span>
          <span>-</span>
          <span>
            {referrals.filter((r: Referral) => r.status === "converted").length}
          </span>
        </div>
      </div>

      <div className="w-px h-8 sm:h-10 bg-slate-200"></div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
        <div
          className="bg-blue-100 rounded-full p-1.5 sm:p-2"
          style={{ backgroundColor: "rgba(21, 93, 253, 0.15)" }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: "#155dfd" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex gap-x-2 text-nowrap text-sm text-slate-600">
          <span>Pending</span>
          <span>-</span>
          <span>
            {referrals.filter((r: Referral) => r.status === "pending").length}
          </span>
        </div>
      </div>
    </div>
  );
}
