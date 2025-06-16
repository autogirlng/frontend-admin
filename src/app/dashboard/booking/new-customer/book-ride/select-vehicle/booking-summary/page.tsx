import { Suspense } from "react";
import BookingSummary from "./BookingSummaryComponent";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSummary />
    </Suspense>
  );
}
