import { copyToCipboard, keyAndValueInAChip } from "@/utils/functions";
import { BookingBadgeStatus, MappedInformation } from "@/utils/types";
import { BookingBadge } from "@/components/shared/badge";
import Chip from "@/components/shared/chip";
import Icons from "@/components/shared/icons";
import Link from "next/link";
import { ReactNode } from "react";

type BookingInfoCardsProps = {
  title: string;
  chipTitle: string;
  chipData: MappedInformation[];
  nameTitle: string;
  nameValue: string;
  link?: string;
  linkText?: string;
  copyText?: string;
  children?: ReactNode;
  status?: BookingBadgeStatus;
};

const BookingInfoCards = ({
  title,
  chipData,
  chipTitle,
  nameTitle,
  nameValue,
  link,
  linkText,
  copyText,
  children,
  status,
}: BookingInfoCardsProps) => {
  return (
    <div className="space-y-6 border-b border-dashed border-grey-300 pb-8">
      <p className="text-grey-700 text-sm 3xl:text-base uppercase !font-semibold">
        {title}
      </p>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-grey-500 text-sm 3xl:text-base">{nameTitle}</p>
          <h5 className="text-h6 3xl:text-h5 !font-bold text-black flex gap-2">
            <span className="break-all"> {nameValue}</span>
            {link && (
              <span className="text-xl 3xl:text-h6 !font-medium text-primary-500">
                <Link href={link}>{linkText}</Link>
              </span>
            )}
            {copyText && (
              <button onClick={() => copyToCipboard(copyText)}>
                {Icons.ic_copy}
              </button>
            )}
          </h5>
          {status && <BookingBadge status={status} />}
        </div>
        <div className="space-y-2">
          <p className="text-grey-500 text-sm 3xl:text-base">{chipTitle}</p>
          <div className="flex flex-wrap gap-3">
            {chipData?.map((detail, index) => {
              const [key, value] = Object.entries(detail)[0];
              return (
                <Chip
                  key={index}
                  text={keyAndValueInAChip(key, value)}
                  variant="filled"
                  radius="sm"
                  color="light"
                  className="!font-medium !text-black !h-auto"
                />
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BookingInfoCards;
