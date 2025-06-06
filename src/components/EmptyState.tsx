import Image from "next/image";
import cn from "classnames";
import { ReactNode } from "react";
import Button from "./shared/button";
import Icons from "@/utils/Icon";

type Props = {
  title: string;
  message?: string | ReactNode;
  image: string;
  imageSize?: string;
  noBg?: boolean;
  buttonText?: string;
  buttonAction?: VoidFunction;
};

export default function EmptyState({
  title,
  message,
  image,
  imageSize,
  noBg,
  buttonAction,
  buttonText,
}: Props) {
  return (
    <div
      className={cn(
        " px-5 space-y-6 2xl:space-y-10 flex flex-col items-center justify-center",
        noBg ? "py-16" : "py-[88px] bg-grey-75 rounded-[40px]"
      )}
    >
      <Image
        src={image}
        alt=""
        width={182}
        height={151}
        className={cn("w-[112px] 3xl:w-[182px]", imageSize)}
      />
      <div className="space-y-3 2xl:space-y-6 text-center text-grey-500">
        <h3 className="text-h6 2xl:text-h4 4xl:text-h3 font-medium">{title}</h3>
        {message && (
          <p className="text-base 2xl:text-xl 4xl:text-h6 font-medium">
            {message}
          </p>
        )}
        {buttonAction && (
          <Button
            onClick={buttonAction}
            color="primary"
            className="flex gap-1 justify-center text-sm text-nowrap items-center w-sm max-w-sm  flex-shrink-0"
          >
            {Icons.ic_add}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
