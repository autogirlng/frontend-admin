import React, { useState, useEffect } from "react";
import { Star, X, User } from "lucide-react"; // Added User for fallback
import clsx from "clsx";
import { RatingReview } from "./types"; // Adjust import path

// --- Helper for stars ---
const StarRatingDisplay = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={clsx(
              "w-5 h-5",
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 fill-gray-100"
            )}
          />
        ))}
      </div>
      <span className="text-gray-700 font-medium">{rating}</span>
    </div>
  );
};

// --- Helper for Avatar (Simplified version of your driver modal one) ---
const ReviewerAvatar = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  const initials = (firstName[0] || "") + (lastName[0] || "");
  return (
    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
      {initials ? (
        <span className="text-lg font-semibold text-gray-600 uppercase">
          {initials}
        </span>
      ) : (
        <User className="h-6 w-6 text-gray-500" />
      )}
    </div>
  );
};

interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reviewId: string, reason: string) => void;
  actionType: "APPROVE" | "REJECT" | null;
  reviewData: RatingReview | null;
  isLoading?: boolean;
}

export const ReviewActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  reviewData,
  isLoading = false,
}: ReviewActionModalProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen || !reviewData || !actionType) return null;

  const isReject = actionType === "REJECT";
  const title = isReject ? "Reject Review" : "Approve Review";
  
  // Status badge logic
  const statusColors = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-orange-100 text-orange-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  const statusStyle = statusColors[reviewData.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";

  return (
    // 1. Overlay matches Driver Modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* 2. Container matches Driver Modal (rounded-lg, shadow-xl, max-w-2xl) */}
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl flex flex-col max-h-[90vh]">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold leading-6 text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- BODY (Scrollable content) --- */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Reviewer Info Card */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-4">
              <ReviewerAvatar 
                firstName={reviewData.reviewedBy.firstName} 
                lastName={reviewData.reviewedBy.lastName} 
              />
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {reviewData.reviewedBy.firstName} {reviewData.reviewedBy.lastName}
                </h3>
                <p className="text-sm text-gray-500">{reviewData.reviewedBy.email}</p>
              </div>
            </div>
            <span className={clsx("px-2.5 py-0.5 text-xs font-normal rounded-full capitalize", statusStyle)}>
              {reviewData.status.toLowerCase()}
            </span>
          </div>

          <div className="grid gap-6">
            {/* Rating */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Rating</h4>
              <StarRatingDisplay rating={reviewData.rating} />
            </div>

            {/* Review Text */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Review</h4>
              <div className="bg-white p-3 border border-gray-200 rounded-md text-gray-700 text-sm leading-relaxed">
                {reviewData.review}
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-900 mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                rows={3}
                className={clsx(
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 p-3",
                )}
                placeholder="Enter reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* --- FOOTER (Matches Driver Modal structure) --- */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reviewData.id, reason)}
            disabled={isLoading || !reason.trim()} // Prevent empty reason
            className={clsx(
              "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              isReject 
                ? "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600" 
                : "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600",
              (isLoading || !reason.trim()) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>

      </div>
    </div>
  );
};