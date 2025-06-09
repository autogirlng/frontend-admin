import cn from "classnames";
import { Fragment } from "react";
import { Notification } from "@/utils/types";
import { FullPageDialog } from "../shared/dialog";
import { formatRelative } from "date-fns";
import { HorizontalDivider } from "../shared/divider";
import {
  getNotificationBgColor,
  getNotificationIcon,
  getNotificationIconColor,
} from "@/utils/functions";
import { FullPageSpinner } from "../shared/spinner";

type Props = {
  isError: boolean;
  isLoading: boolean;
  notifications: Notification[];
  isDivider?: boolean;
};

export default function Notifications({
  notifications,
  isLoading,
  isError,
  isDivider = false,
}: Props) {
  if (isLoading) {
    return <FullPageSpinner className="min-h-[480px]" />;
  }
  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="space-y-7">
      {notifications.map((item, index) => (
        <Fragment key={index}>
          <div key={index} className="flex items-center gap-3">
            <div
              className={cn(
                "w-[52px] h-[52px] rounded-full flex items-center justify-center *:!w-6 *:!h-6 ",
                getNotificationBgColor(item.notificationType),
                getNotificationIconColor(item.notificationType)
              )}
            >
              {getNotificationIcon(item.notificationType)}
            </div>
            <div className="space-y-2">
              <p className="text-base 3xl:text-xl text-grey-900 !font-medium">
                {item.title}
              </p>
              <p className="text-xs 3xl:text-sm text-grey-600">
                {item.message}
              </p>
              <p className="text-xs 3xl:text-sm text-grey-400">
                {item.createdAt
                  ? `${formatRelative(item?.createdAt, new Date())} `
                  : "-"}
              </p>
            </div>
          </div>
          {isDivider && <HorizontalDivider variant="dark" />}
        </Fragment>
      ))}
    </div>
  );
}
