"use client";
import { BookingSummaryLayout } from "@/components/bookings/booking-summary/BookingSummaryLayout";
import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";

const BookingSummary = () => {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <BookingSummaryLayout />
    </Suspense>
  );
};

export default BookingSummary;
