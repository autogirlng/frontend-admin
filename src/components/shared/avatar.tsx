import * as Avatar from "@radix-ui/react-avatar";
import cn from "classnames";
import { ReactNode } from "react";

type AvatarProps = {
  image?: string;
  initials: string | ReactNode;
  size?: string;
  color?: string;
};

export const AvatarImage = ({ image, initials, size, color }: AvatarProps) => (
  <Avatar.Root
    className={cn(
      "inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle",
      size ? size : ""
    )}
  >
    {image && (
      <Avatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={image}
        alt=""
      />
    )}

    <Avatar.Fallback
      className={cn(
        "text-white flex h-full w-full items-center justify-center bg-grey-800 text-sm 3xl:text-base font-medium",
        color ? color : ""
      )}
      delayMs={600}
    >
      {initials}
    </Avatar.Fallback>
  </Avatar.Root>
);

export const AvatarInitials = ({ initials, size, color }: AvatarProps) => (
  <Avatar.Root
    className={cn(
      "inline-flex h-[50px] w-[50px] select-none overflow-hidden rounded-full align-middle",
      size ? size : ""
    )}
  >
    <Avatar.Fallback
      className={cn(
        "text-white flex h-full w-full items-center justify-center bg-grey-800 text-sm 3xl:text-base font-medium",
        color ? color : ""
      )}
    >
      {initials}
    </Avatar.Fallback>
  </Avatar.Root>
);
