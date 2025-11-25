"use client";

import React from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationControlsProps) {
  const getVisiblePages = () => {
    const delta = 1;
    const current = currentPage + 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const handlePrevious = () => onPageChange(Math.max(currentPage - 1, 0));
  const handleNext = () =>
    onPageChange(Math.min(currentPage + 1, totalPages - 1));

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      <Button
        variant="secondary"
        className="h-9 w-9 p-0 sm:w-auto sm:px-4"
        onClick={handlePrevious}
        disabled={currentPage === 0 || isLoading}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Previous</span>{" "}
      </Button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            );
          }

          const isCurrent = page === currentPage + 1;

          return (
            <button
              key={page}
              onClick={() => onPageChange((page as number) - 1)}
              disabled={isLoading}
              className={`
                h-9 w-9 flex items-center justify-center text-sm font-medium transition-colors
                ${
                  isCurrent
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        className="h-9 w-9 p-0 sm:w-auto sm:px-4"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || isLoading}
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>{" "}
        <ChevronRight className="h-4 w-4 sm:ml-2" />
      </Button>
    </div>
  );
}
