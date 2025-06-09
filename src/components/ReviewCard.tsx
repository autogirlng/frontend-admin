import cn from "classnames";
import Image from "next/image";
import { format } from "date-fns";
import { Review, ReviewReply } from "@/utils/types";
import StarRating from "@/components/shared/starRating";

const ReviewCard = ({
  review,
  onClick,
  isReviewDetail,
  isSelected,
  size,
  gap,
}: {
  review: Review | ReviewReply;
  onClick?: () => void;
  isReviewDetail?: boolean;
  isSelected?: boolean;

  size?: string;
  gap?: string;
}) => {
  const isReview = "rating" in review;

  return (
    <div
      className={cn(
        "space-y-6",
        onClick && "cursor-pointer",
        isReviewDetail ? "" : "p-6 bg-grey-90 rounded-[32px]",
        isSelected && "border border-primary-500"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-3 items-center">
          {review?.user?.profileImage && (
            <Image
              src={review?.user?.profileImage}
              alt=""
              height={40}
              width={40}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="space-y-[2px]">
            <p className="text-grey-700 text-sm 3xl:text-base">{`${review?.user?.firstName} ${review?.user?.lastName}`}</p>
            <p className="text-grey-500 text-xs 3xl:text-sm">
              {`${format(
                new Date(review?.updatedAt),
                "MMM d, yyyy"
              )} | ${format(new Date(review?.updatedAt), "hh:mma")}`}
            </p>
          </div>
        </div>
        {isReview && review?.rating && (
          <StarRating n={review.rating} size={size} gap={gap} />
        )}
      </div>
      <div className="text-black text-sm 3xl:text-base">{review.message}</div>
    </div>
  );
};

export default ReviewCard;
