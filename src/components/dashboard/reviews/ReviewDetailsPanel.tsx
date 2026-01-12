"use client";

import React from "react";
import { X, Star, User, Clock } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { RatingReview } from "./types";

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-[#F3A218] text-white", // Updated to match your table style
    REJECTED: "bg-[#FF383C] text-white", // Updated to match your table style
  };
  // Fallback for unknown statuses
  const style = styles[status?.toUpperCase() as keyof typeof styles] || "bg-gray-100 text-gray-700";

  return (
    <span className={clsx("px-3 py-1 text-xs font-normal rounded-full capitalize", style)}>
      {status?.toLowerCase()}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            "w-4 h-4",
            star <= Math.round(rating) ? "fill-[#F5B546] text-[#F5B546]" : "text-gray-200 fill-gray-100"
          )}
        />
      ))}
    </div>
    <span className="text-gray-900 font-medium">{rating}</span>
  </div>
);

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

// --- Main Component ---

interface ReviewDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  review: RatingReview | null;
  onAction: (action: "APPROVED" | "REJECTED") => void;
}

export const ReviewDetailsPanel = ({
  isOpen,
  onClose,
  review,
  onAction,
}: ReviewDetailsPanelProps) => {
  
  if (!isOpen || !review) return null;

  const isPending = review.status === "PENDING";

  // --- Dynamic History Logic ---
  const timelineEvents = [
    {
      status: "Pending",
      date: review.createdAt,
      actor: review.reviewedBy.firstName + " " + review.reviewedBy.lastName, 
      title: "Initial Submission",
      reason: null as string | null // Initial submission has no reason
    }
  ];

  if (!isPending) {
    // Determine the actor name safely
    const actorName = review.moderatedBy 
      ? `${review.moderatedBy.firstName} ${review.moderatedBy.lastName} (${review.moderatedBy.userType})`
      : "System/Admin";

    timelineEvents.unshift({
      status: review.status,
      date: review.updatedAt,
      actor: actorName,
      title: review.status === "APPROVED" ? "Review Approved" : "Review Rejected",
      reason: review.moderatedReason 
    });
  }

  return (
    <div className="fixed inset-0 z-60 flex justify-end pointer-events-none">
      {/* Backdrop - pointer events auto to allow clicking */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity pointer-events-auto" 
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className={clsx(
        "relative bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out pointer-events-auto",
        "w-full max-w-md", // Base width
        // Mobile Layout: Margin on all sides, calculated height, rounded corners
        "m-4 h-[calc(100%-2rem)] rounded-2xl", 
        // Desktop Layout (md): No margins, full height, square corners
        "md:m-0 md:h-full md:rounded-none",
        isOpen ? "translate-x-0" : "translate-x-[120%]"
      )}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col">
            {/* Row 1: Close Button (Top Right) */}
            <div className="flex justify-end mb-2">
                <button 
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Row 2: User Info & Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex items-center space-x-4">
                        <ReviewerAvatar 
                            firstName={review?.reviewedBy?.firstName || ""} 
                            lastName={review?.reviewedBy?.lastName || ""} 
                        /> 
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900">
                            {review?.reviewedBy?.firstName} {review?.reviewedBy?.lastName}
                        </h2>
                        <p className="text-xs text-gray-500">{review?.reviewedBy?.email}</p>
                    </div>
                </div>
                
                <StatusBadge status={review.status} />
            </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Rating Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500">Rating</h3>
                <StarRating rating={review?.rating || 0} />
            </div>

            {/* Review Section */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500">Review</h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {review?.review}
                </p>
            </div>

            {/* Submitted Section */}
            <div className="space-y-2 pb-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500">Submitted</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                        {review?.createdAt 
                            ? format(new Date(review.createdAt), "MMMM do, yyyy 'at' h:mm a") 
                            : "-"}
                    </span>
                </div>
            </div>

            {/* Status History Section (Dynamic Timeline) */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500">Status History</h3>
                
                <div className="relative space-y-8 pl-1">
                    {/* Vertical Line */}
                    <div className="absolute top-2 left-[3px] bottom-2 w-0.5 bg-gray-100 -z-10" />

                    {timelineEvents.map((item, index) => (
                        <div key={index} className="relative bg-white"> 
                            <div className="flex items-center justify-between mb-1">
                                {item.status === 'Submitted' 
                                    ? <span className="px-3 py-1 text-xs font-normal rounded-full bg-gray-100 text-gray-600">Submitted</span>
                                    : <StatusBadge status={item.status} />
                                }
                                <span className="text-xs text-gray-500">
                                    {item.date ? format(new Date(item.date), "MMM d, yyyy") : "-"}
                                </span>
                            </div>
                            
                            <div className="pl-1">
                                <p className="text-sm text-gray-400 font-medium mb-1">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <User className="w-3 h-3" />
                                    <span>{item.actor}</span>
                                </div>

                                {/* ✅ MODERATION REASON DISPLAY */}
                                {item.reason && (
                                    <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                                            Reason
                                        </span>
                                        <p className="text-sm text-gray-700 italic">
                                            &quot;{item.reason}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer Actions - ONLY SHOW IF PENDING */}
        {isPending && (
            <div className="p-6 border-t border-gray-100 bg-white md:rounded-none rounded-b-2xl">
                <h3 className="text-sm font-semibold text-gray-500 mb-4">Quick Actions</h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => onAction("APPROVED")}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Approve Review
                    </button>
                    <button
                        onClick={() => onAction("REJECTED")}
                        className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Reject Review
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};