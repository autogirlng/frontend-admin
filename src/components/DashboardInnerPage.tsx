import cn from "classnames";
import { ReactNode } from "react";
import BackLink from "@/components/BackLink";

type Props = {
  isInnerPage?: boolean;
  title: string;
  description?: string;
  backLink?: string;
  children: ReactNode;
};

export default function DashboardInnerPage({
  isInnerPage = false,
  title,
  description,
  backLink,
  children,
}: Props) {
  return (
    <main
      className={cn(
        "space-y-10 2xl:space-y-[52px]",
        isInnerPage ? "py-8 2xl:py-11" : "py-11 2xl:py-[70px]"
      )}
    >
      <div className="space-y-3 2xl:space-y-5">
        {isInnerPage && <BackLink backLink={backLink || ""} />}
        <h2 className="text-grey-700 text-h4 2xl:text-4xl font-bold">
          {title}
        </h2>
       {description && <p className="text-grey-500 text-sm 2xl:text-base">{description}</p>}
        {!isInnerPage && (
          <h6 className="text-base 2xl:text-h6 text-black font-semibold">
            Tasks
          </h6>
        )}
      </div>
      {children}
    </main>
  );
}
