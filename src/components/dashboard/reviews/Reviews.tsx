"use client";

import React, { useRef, useState } from "react";
import clsx from "clsx";
import { formatDate } from "date-fns";
import Select, { Option } from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { Eye, Search, Star, X, Check, AlertCircle } from "lucide-react";
import { RatingReview, ReviewStatus } from "./types";
import { DateRange } from "react-day-picker";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { DatePickerWithRange } from "../availability/DatePickerWithRange";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ConfirmModal } from "@/components/generic/ui/CustomModal"; 
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import CustomLoader from "@/components/generic/CustomLoader";
import { useReviews, useModerateReview } from "@/lib/hooks/reviews/useReviews";
import { ReviewActionModal } from "./ReviewActionModal";
import { ReviewDetailsPanel } from "./ReviewDetailsPanel";

// ... (Keep statusOptions, ratingOptions, helper functions exactly as they are) ...
const statusOptions: Option[] = [
  { id: "", name: "All Statuses" },
  ...Object.values(ReviewStatus || {}).map((status) => ({
    id: status,
    name: formatStatus(status),
  })),
];

const ratingOptions: Option[] = [
    { id: "", name: "All Ratings" },
    { id: "5", name: "5 Stars" },
    { id: "4", name: "4 Stars" },
    { id: "3", name: "3 Stars" },
    { id: "2", name: "2 Stars" },
    { id: "1", name: "1 Star" },
];

function formatStatus(status: string) {
  return (status || "").split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase()).join(" ");
}

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED': case 'SUCCESSFUL': return 'bg-green-500 text-white';
    case 'PENDING': return 'bg-[#F3A218] text-white';
    case 'REJECTED': case 'FAILED': return 'bg-[#FF383C] text-white';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={clsx("w-5 h-5", star <= Math.round(rating) ? "fill-[#F5B546] text-[#F5B546]" : "text-gray-300 fill-gray-100")} />
        ))}
      </div>
      <span className="text-gray-600 text-sm font-normal">{rating}</span>
    </div>
);

const ReviewCell = ({ text, onViewMore }: { text: string; id: string, onViewMore: () => void }) => {
  const isLongText = (text || "").length > 70;
  return (
    <div className="max-w-[300px]">
      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed" title={text}>{text}</p>
      {isLongText && (
        <button 
            className="text-blue-500 text-xs mt-1 font-medium hover:underline focus:outline-none" 
            onClick={(e) => { 
                e.stopPropagation(); 
                onViewMore(); // Trigger parent handler
            }}
        >
          View More
        </button>
      )}
    </div>
  );
};

export default function Reviews() {
    // --- State ---
    const [currentPage, setCurrentPage] = useState(0);
    const topRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<Option | null>(null);
    const [ratingFilter, setRatingFilter] = useState<Option | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

    // 2. Separate states for Approve vs Reject modals
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<RatingReview | null>(null);

    // --- Hooks ---
    const { 
        data: apiResponse, 
        isLoading, 
        isError, 
        isPlaceholderData 
    } = useReviews({
        page: currentPage,
        size: 10,
        status: statusFilter?.id, 
        rating: ratingFilter?.id,
        search: debouncedSearchTerm,
        startDate: dateRange?.from,
        endDate: dateRange?.to
    });

    const { mutate: moderateReview, isPending: isSubmittingAction } = useModerateReview();

    const reviews = apiResponse?.data?.content || [];
    const totalPages = apiResponse?.data?.totalPages || 0;

    const handleDateChange = (newDateRange: DateRange | undefined) => {
        setDateRange(newDateRange);
        setCurrentPage(0);
    };

    // --- Action Handlers ---

    // 1. Unified Handler for API Calls
    const executeReviewAction = (reviewId: string, action: "APPROVED" | "REJECTED", reason: string) => {
        moderateReview(
            { id: reviewId, status: action, reason },
            {
                onSuccess: () => {
                    // Close BOTH modals to be safe
                    setIsRejectModalOpen(false);
                    setIsApproveModalOpen(false);
                    setIsDetailsPanelOpen(false);
                    setSelectedReview(null);
                }
            }
        );
    };

    // 2. Reject Modal Handler
    const handleRejectConfirm = (reviewId: string, reason: string) => {
        executeReviewAction(reviewId, "REJECTED", reason);
    };

    // 3. Approve Modal Handler
    const handleApproveConfirm = () => {
        if (selectedReview) {
            executeReviewAction(selectedReview.id, "APPROVED", "This review is in full compliance with our guidelines.");
        }
    };

    const handlePanelAction = (action: "APPROVED" | "REJECTED") => {
        if (!selectedReview) return;

        if (action === "APPROVED") {
            // If approving from panel, do it immediately (or add window.confirm if preferred)
            setIsApproveModalOpen(true);
        } else if (action === "REJECTED") {
            // If rejecting, we MUST open the modal to get a reason
            // 1. Close the Details Panel
            setIsDetailsPanelOpen(false); 
            // 2. Open the Reject Modal (selectedReview is already set)
            setIsRejectModalOpen(true);
        }
    };

    // --- Action Menu Logic ---
    const getReviewActions = (review: RatingReview): ActionMenuItem[] => {
        const isPending = review.status === "PENDING";
        const actions: ActionMenuItem[] = [
            {
                label: "View Details",
                icon: Eye,
                onClick: () => {
                    setSelectedReview(review);
                    setIsDetailsPanelOpen(true);
                },
            },
        ];

        if (isPending) {
            actions.push(
                {
                    label: "Approve Review",
                    icon: Check,
                    // LOGIC: Open Approve Modal
                    onClick: () => {
                        setSelectedReview(review);
                        setIsApproveModalOpen(true);
                    },
                },
                {
                    label: "Reject Review",
                    icon: X,
                    danger: true,
                    // LOGIC: Open Reject Modal
                    onClick: () => {
                        setSelectedReview(review);
                        setIsRejectModalOpen(true);
                    },
                }
            );
        }
        return actions;
    };

    // --- Columns Definition ---
    const columns: ColumnDefinition<RatingReview>[] = [
        {
            header: "Reviewer",
            accessorKey: "reviewedBy", 
            cell: (item) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {/* ✅ CHECK IS ANONYMOUS */}
                        {item.isAnonymous 
                            ? "Anonymous" 
                            : `${item.reviewedBy?.firstName} ${item.reviewedBy?.lastName}`
                        }
                    </div>
                    <div className="text-xs text-gray-500">
                        {/* ✅ HIDE EMAIL IF ANONYMOUS */}
                        {item.isAnonymous ? "" : item.reviewedBy?.email}
                    </div>
                </div>
            ),
        },
        {
            header: "Rating",
            accessorKey: "rating",
            cell: (item) => <StarRating rating={item.rating || 0} />,
        },
        {
            header: "Review",
            accessorKey: "review",
            cell: (item) => (
                <ReviewCell 
                    text={item.review} 
                    id={item.id} 
                    onViewMore={() => {
                        setSelectedReview(item);
                        setIsDetailsPanelOpen(true);
                    }}
                />
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (item) => (
                <span className={clsx("inline-flex items-center px-3 py-1 rounded-full text-xs font-normal", getStatusStyles(item.status))}>
                    {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                </span>
            ),
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (item) => (
                <span className="text-sm text-gray-500">
                    {item.createdAt ? formatDate(new Date(item.createdAt), "MMM dd, yyyy") : "-"}
                </span>
            ),
        },
        {
            header: "Actions",
            accessorKey: "id",
            cell: (item) => <ActionMenu actions={getReviewActions(item)} />,
        },
    ];

    return (
        <main className="py-3 max-w-8xl mx-auto relative">
            <div ref={topRef}>
                <div className="flex flex-wrap items-center justify-between mb-8">
                    <div className="my-1">
                        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
                        <p className="text-lg text-gray-600 mt-1">Manage and moderate customer feedback</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <TextInput
                        label="Search Reviews"
                        id="search"
                        hideLabel
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                        className="w-full"
                        style={{ paddingLeft: 35 }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Select
                        label="Status"
                        hideLabel
                        placeholder="Filter by status"
                        options={statusOptions}
                        selected={statusFilter}
                        onChange={(option) => { setStatusFilter(option); setCurrentPage(0); }}
                    />
                    <Select
                        label="Rating"
                        hideLabel
                        placeholder="Filter by rating"
                        options={ratingOptions}
                        selected={ratingFilter}
                        onChange={(option) => { setRatingFilter(option); setCurrentPage(0); }}
                    />
                    <DatePickerWithRange date={dateRange} setDate={handleDateChange} />
                </div>
            </div>

            {/* Table Area */}
            {isLoading && !apiResponse && <CustomLoader />}

            {isError && (
                <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-8 w-8" />
                    <span className="font-semibold">Failed to load reviews.</span>
                </div>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
                <div className="flex justify-center p-10 text-gray-500">
                    <p>No reviews found for the selected filters.</p>
                </div>
            )}

            {!isError && (reviews.length > 0 || (isLoading && !!apiResponse)) && (
                <div className={clsx(isPlaceholderData && "opacity-60 pointer-events-none")}>
                    <CustomTable
                        columns={columns}
                        data={reviews}
                        getUniqueRowId={(item) => item.id}
                    />
                </div>
            )}

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                isLoading={isPlaceholderData || isLoading}
            />

            {/* --- Modals --- */}
            
            {/* 1. Review Action Modal (Custom UI for Rejection with Reason) */}
            <ReviewActionModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectConfirm}
                actionType="REJECT" 
                reviewData={selectedReview}
                isLoading={isSubmittingAction}
            />

            {/* 2. Confirm Modal (Standard UI for Approval) */}
            <ConfirmModal
                isOpen={isApproveModalOpen}
                onCancel={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveConfirm}
                title="Approve Review"
                message={`Are you sure you want to approve the review by ${selectedReview?.reviewedBy?.firstName}? It will be visible to the public.`}
                isLoading={isSubmittingAction}
                confirmLabel="Yes, Approve"
                cancelLabel="Cancel"
                variant="primary"
            />

            {/* ✅ The New Details Panel */}
            <ReviewDetailsPanel 
                isOpen={isDetailsPanelOpen}
                onClose={() => setIsDetailsPanelOpen(false)}
                review={selectedReview}
                onAction={handlePanelAction}
            />
        </main>
    );
}