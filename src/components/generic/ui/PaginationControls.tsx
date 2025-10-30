"use client";

import React from "react";
import Button from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  /** The current page number (0-indexed) */
  currentPage: number;
  /** The total number of pages */
  totalPages: number;
  /** Callback function when a page is changed */
  onPageChange: (newPage: number) => void;
  /** (Optional) Disables buttons during data fetch */
  isLoading?: boolean;
}

/**
 * A reusable pagination component with "Previous" and "Next" buttons.
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationControlsProps) {
  // Don't render pagination if there's only 1 page (or less)
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(Math.max(currentPage - 1, 0));
  };

  const handleNext = () => {
    onPageChange(Math.min(currentPage + 1, totalPages - 1));
  };

  // Disable "Previous" if on the first page or loading
  const isPrevDisabled = currentPage === 0 || isLoading;
  // Disable "Next" if on the last page or loading
  const isNextDisabled = currentPage === totalPages - 1 || isLoading;

  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        variant="secondary"
        className="w-auto px-4"
        onClick={handlePrevious}
        disabled={isPrevDisabled}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-gray-700">
        Page <span className="font-semibold">{currentPage + 1}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <Button
        variant="secondary"
        className="w-auto px-4"
        onClick={handleNext}
        disabled={isNextDisabled}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
