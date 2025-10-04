import Icons from "./icons";
import cn from "classnames";

type Props = { className?: string };

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "*:w-4 *:h-4",
  md: "*:w-6 *:h-6",
  lg: "*:w-8 *:h-8",
};

export function FullPageSpinner({ className }: Props) {
  return (
    <div
      className={cn(
        "w-full min-h-screen flex justify-center items-center",
        className
      )}
    >
      <div className="animate-spin w-fit *:w-8 *:h-8 text-grey-500">
        {Icons.ic_spinner}
      </div>
    </div>
  );
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin w-fit text-grey-500",
        sizeClasses[size],
        className
      )}
    >
      {Icons.ic_spinner}
    </div>
  );
}
