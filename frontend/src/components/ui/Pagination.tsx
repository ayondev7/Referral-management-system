import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center
          h-10 px-4 rounded-md
          text-sm font-medium
          transition-colors duration-200
          ${
            currentPage === 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }
        `}
        aria-label="Go to previous page"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-10 w-10 text-slate-600"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`
                flex items-center justify-center
                h-10 w-10 rounded-md
                text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }
              `}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center
          h-10 px-4 rounded-md
          text-sm font-medium
          transition-colors duration-200
          ${
            currentPage === totalPages
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }
        `}
        aria-label="Go to next page"
      >
        Next
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;
