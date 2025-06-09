import { ReactNode } from "react";

type Props = { icon?: ReactNode; title: string };

export default function DashboardSectionTitle({ icon, title }: Props) {
  return (
    <p className="flex items-center gap-2 text-base 2xl:text-xl text-grey-700">
      {icon}
      <span>{title}</span>
    </p>
  );
}
