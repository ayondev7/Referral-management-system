"use client";

import React, { useState } from "react";
import { usePurchasedCourses } from "@/hooks";
import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/myCourses/Header";
import LoadingState from "@/components/myCourses/LoadingState";
import ErrorState from "@/components/myCourses/ErrorState";
import CoursesContent from "@/components/myCourses/CoursesContent";
import Pagination from "@/components/ui/Pagination";

type ViewMode = "table" | "grid";

export default function MyCoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const itemsPerPage = 8;

  const { data, isLoading, error } = usePurchasedCourses(currentPage, itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const { purchases = [], pagination } = data || {};
  const totalPurchases = pagination?.totalItems || 0;

  return (
    <PageContainer>
      <Header 
        totalPurchases={totalPurchases} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />
      
      <CoursesContent viewMode={viewMode} purchases={purchases} />

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 sm:mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </PageContainer>
  );
}

