import cn from "classnames";
import { Spinner } from "./spinner";
import Tooltip from "./tooltip";

type Props = {
  primary?: boolean;
  title: string;
  value: string;
  isLoading?: boolean;
  className?: string;
  tooltip?: string;
};

export default function ActivityCard({
  primary,
  title,
  value,
  tooltip,
  isLoading,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-5 space-y-4",
        // primary && value !== "-"
        //           ? "bg-primary-500 border border-grey-200 text-white"
        //

        "bg-white border border-grey-200 text-grey-500",
        className
      )}
    >
      <div className="text-xs text-[#667085] font-medium flex items-center label gap-2">
        <span>{title}</span>
        <Tooltip title={title} description={tooltip || ""} />
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <h2
          className={cn(
            "text-h3 2xl:text-4xl",
            primary && value !== "-" ? "text-white" : "text-black"
          )}
        >
          {value}
        </h2>
      )}
    </div>
  );
}
