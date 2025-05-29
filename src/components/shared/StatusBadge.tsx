// src/components/StatusBadge.tsx
import cn from "classnames";
import { Status } from "@/utils/types";
type StatusBadgeProps = {
  status: Status;
  type?: "table" | "regular"; // 'table' for compact, 'regular' for larger badges
};

export const StatusBadge = ({ status, type = "regular" }: StatusBadgeProps) => {
  let badgeClasses = "";
  let displayText = status.charAt(0).toUpperCase() + status.slice(1); // Default capitalized

  switch (status) {
    // --- Success/Positive States ---
    case Status.Accepted:
    case Status.Approved:
    case Status.Successful:
    case Status.Paid:
    case Status.Active:
    case Status.Booked:
    case Status.Joined:
    case Status.Completed:
    case Status.Success:
    case Status.Published:
      if (type === "table") {
        badgeClasses = "bg-success-500 text-white";
      } else {
        badgeClasses = "bg-success-100 text-success-600";
      }
      break;

    // --- Warning/Pending/Review States ---
    case Status.Pending:
    case Status.InReview:
    case Status.Review:
    case Status.Maintenance:
    case Status.Draft:
    case Status.Submitted:
    case Status.Warning:
    case Status.Processing:
    case Status.OnHold:
      if (type === "table") {
        badgeClasses = "bg-warning-400 text-white";
      } else {
        badgeClasses = "bg-warning-75 text-warning-500";
      }
      break;

    // --- Error/Negative/Inactive States ---
    case Status.Rejected:
    case Status.Cancelled:
    case Status.Failed:
    case Status.Unavailable:
    case Status.Inactive:
    case Status.Suspended:
    case Status.Feedback: // Often implies something needs correction
    case Status.Error:
    case Status.Expired:
    case Status.Deleted:
      if (type === "table") {
        badgeClasses = "bg-error-900 text-white";
      } else {
        badgeClasses = "bg-error-100 text-error-900";
      }
      break;

    // --- Neutral/Default States ---
    case Status.Archived:
    case Status.Info:
    case Status.Unassigned: // Or categorize as neutral
      if (type === "table") {
        badgeClasses = "bg-grey-500 text-white";
      } else {
        badgeClasses = "bg-grey-300 text-grey-500";
      }
      break;

    default:
      // Fallback for any unhandled status, or if you prefer a generic neutral look
      if (type === "table") {
        badgeClasses = "bg-grey-500 text-white";
      } else {
        badgeClasses = "bg-grey-300 text-grey-500";
      }
      break;
  }

  // Handle specific display text variations
  if (status === Status.InReview) {
    displayText = "In Review";
  } else if (status === Status.OnHold) {
    displayText = "On Hold";
  } else if (status === Status.Unassigned) {
    displayText = "Unassigned";
  }

  return (
    <div
      className={cn(
        "font-medium capitalize w-fit",
        type === "table"
          ? "px-3 py-[2px] text-sm rounded-xl" // Compact table style
          : "px-6 py-2 text-sm 3xl:text-base rounded-[121px]", // Regular/larger style
        badgeClasses
      )}
    >
      {displayText}
    </div>
  );
};
