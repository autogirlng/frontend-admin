import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";

type Props = { backLink: string };

export default function BackLink({ backLink }: Props) {
  return (
    <div className="flex items-center gap-0.5 text-primary-500 fill-primary-500">
      <CaretLeft size={18} fill="inherit" />
      <Link href={backLink} className="text-sm 2xl:text-base font-medium">
        Back
      </Link>
    </div>
  );
}
