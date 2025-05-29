import { VehicleOnboardingStatus } from "@/utils/types";
import cn from "classnames";

type BookingBadgeProps = {
  status: "ACCEPTED" | "PENDING" | "CANCELLED" | "APPROVED" | "COMPLETED";
};

export const BookingTableBadge = ({ status }: BookingBadgeProps) => {
  const badgeColor =
    status === "ACCEPTED" || status === "APPROVED"
      ? "bg-success-500"
      : status === "CANCELLED"
      ? "bg-error-900"
      : status === "PENDING"
      ? "bg-warning-400"
      : "bg-grey-500";

  return (
    <div
      className={cn(
        "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
        badgeColor
      )}
    >
      {status === "APPROVED" ? "accepted" : status.toLocaleLowerCase()}
    </div>
  );
};

type VehicleOnboardingTableBadgeProps = {
  status:
    | "accepted"
    | "pending"
    | "rejected"
    | "inReview"
    | "approved"
    | "Active"
    | "Inactive"
    | "Successful"
    | "Admin"
    | "Customer Support "
    | "Finance Manager"
    | "Operation Manager";
};

export const VehicleOnboardingTableBadge = ({
  status,
}: VehicleOnboardingTableBadgeProps) => {
  const badgeColor =
    status === VehicleOnboardingStatus.ACCEPTED ||
    status === VehicleOnboardingStatus.APPROVED
      ? "bg-success-500"
      : status === VehicleOnboardingStatus.REJECTED
      ? "bg-error-900"
      : status === VehicleOnboardingStatus.PENDING
      ? "bg-warning-400"
      : "bg-grey-500";

  return (
    <div
      className={cn(
        "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
        badgeColor
      )}
    >
      {status === VehicleOnboardingStatus.ACCEPTED
        ? "accepted"
        : status.toLocaleLowerCase()}
    </div>
  );
};

export const BookingBadge = ({ status }: BookingBadgeProps) => {
  const badgeColor =
    status === "APPROVED"
      ? "bg-success-100 text-success-600"
      : status === "CANCELLED"
      ? "bg-error-100 text-error-900"
      : status === "PENDING"
      ? "bg-warning-75 text-warning-500"
      : "bg-grey-90 text-grey-500";

  return (
    <div
      className={cn(
        "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px] w-fit",
        badgeColor
      )}
    >
      {status.toLocaleLowerCase()}
    </div>
  );
};

type VehicleListingBadgeProps = {
  status:
    | "draft"
    | "active"
    | "pending"
    | "maintenance"
    | "booked"
    | "submitted"
    | "unavailable"
    | "inactive";
};

export const VehicleListingBadge = ({ status }: VehicleListingBadgeProps) => {
  const badgeColor =
    status === "booked" || status === "active"
      ? "bg-success-100 text-success-600"
      : status === "pending" || status === "maintenance"
      ? "bg-warning-75 text-warning-500"
      : status === "unavailable" || status === "inactive"
      ? "bg-error-100 text-error-900"
      : "bg-grey-300 text-grey-500";

  return (
    <div
      className={cn(
        "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px]",
        badgeColor
      )}
    >
      {status}
    </div>
  );
};

type ListingBadgeProps = {
  status:
    | "suspended"
    | "approved"
    | "rejected"
    | "review"
    | "feedback"
    | "accepted";
};

export const ListingBadge = ({ status }: ListingBadgeProps) => {
  const badgeColor =
    status === "approved"
      ? "bg-success-100 text-success-600"
      : status === "review"
      ? "bg-warning-75 text-warning-500"
      : status === "rejected" || status === "feedback"
      ? "bg-error-100 text-error-900"
      : "bg-grey-300 text-grey-500";

  return (
    <div
      className={cn(
        "px-6 py-2 text-sm 3xl:text-base font-medium capitalize rounded-[121px]",
        badgeColor
      )}
    >
      {status}
    </div>
  );
};

type TransactionBadgeProps = {
  status: "SUCCESS" | "PENDING" | "FAILED";
};

export const TransactionBadge = ({ status }: TransactionBadgeProps) => {
  const badgeColor =
    status === "SUCCESS"
      ? "bg-success-500"
      : status === "FAILED"
      ? "bg-error-800"
      : "bg-warning-500";

  return (
    <div
      className={cn(
        "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
        badgeColor
      )}
    >
      {status.toLocaleLowerCase()}
    </div>
  );
};

type PaymentBadgeProps = {
  status: "successful" | "pending" | "failed" | "paid" | "cancelled";
};

export const PaymentBadge = ({ status }: PaymentBadgeProps) => {
  const badgeColor =
    status === "successful" || status === "paid"
      ? "bg-success-500"
      : status === "failed" || status === "cancelled"
      ? "bg-error-800"
      : "bg-warning-500";

  return (
    <div
      className={cn(
        "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
        badgeColor
      )}
    >
      {status}
    </div>
  );
};

type ReferralBadgeProps = {
  status: "JOINED" | "PENDING";
};

export const ReferralBadge = ({ status }: ReferralBadgeProps) => {
  const badgeColor = status === "JOINED" ? "bg-success-500" : "bg-warning-500";

  return (
    <div
      className={cn(
        "px-3 py-[2px] text-sm font-medium capitalize text-white rounded-xl w-fit",
        badgeColor
      )}
    >
      {status.toLocaleLowerCase()}
    </div>
  );
};

type BadgeProps = {
  status: string;
};

export function getBadgeComponent(status: string) {
  // Normalize status for matching
  const normalized = status.toLowerCase();

  // BookingTableBadge
  if (
    ["accepted", "pending", "cancelled", "approved", "completed"].includes(
      normalized
    )
  ) {
    return <BookingTableBadge status={status.toUpperCase() as any} />;
  }

  // BookingBadge
  if (
    ["accepted", "pending", "cancelled", "approved", "completed"].includes(
      normalized
    )
  ) {
    return <BookingBadge status={status.toUpperCase() as any} />;
  }

  // VehicleListingBadge
  if (
    [
      "draft",
      "active",
      "pending",
      "maintenance",
      "booked",
      "submitted",
      "unavailable",
      "inactive",
    ].includes(normalized)
  ) {
    return <VehicleListingBadge status={normalized as any} />;
  }

  // ListingBadge
  if (
    [
      "suspended",
      "approved",
      "rejected",
      "review",
      "feedback",
      "accepted",
    ].includes(normalized)
  ) {
    return <ListingBadge status={normalized as any} />;
  }

  // TransactionBadge
  if (["success", "pending", "failed"].includes(normalized)) {
    return <TransactionBadge status={status.toUpperCase() as any} />;
  }

  // PaymentBadge
  if (
    ["successful", "pending", "failed", "paid", "cancelled"].includes(
      normalized
    )
  ) {
    return <PaymentBadge status={normalized as any} />;
  }

  // ReferralBadge
  if (["joined", "pending"].includes(normalized)) {
    return <ReferralBadge status={status.toUpperCase() as any} />;
  }

  // Default fallback
  return <span>{status}</span>;
}
