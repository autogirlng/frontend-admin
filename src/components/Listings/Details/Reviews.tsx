import { useState } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import { Review } from "@/utils/types";
import Pagination from "@/components/shared/pagination";
import ReviewCard from "@/components/ReviewCard";
import useVehicleReview from "@/components/Listings/Details/hooks/useVehicleReview";
import EmptyState from "@/components/EmptyState";

type Props = { id: string };

export default function VehicleReviews({ id }: Props) {
  const pageLimit = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    vehicleReviews,
    isError,
    isLoading,

    totalCount,
  } = useVehicleReview({ id, currentPage, pageLimit });

  if (isLoading) {
    return <FullPageSpinner />;
  }
  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-10">
        {vehicleReviews.length > 0 ? (
          vehicleReviews.map((review: Review, index: number) => (
            <ReviewCard key={index} review={review} />
          ))
        ) : (
          <EmptyState
            title="No Reviews Yet"
            message="Your Customers Reviews Will Appear Here"
            image="/icons/empty_review_state.png"
            imageSize="w-[182px] 3xl:w-[265px]"
            noBg
          />
        )}
      </div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={totalCount}
        pageLimit={pageLimit}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
