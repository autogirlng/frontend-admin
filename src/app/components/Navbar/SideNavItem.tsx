import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import cn from "classnames";

type Props = { link: string; name: string; icon: ReactNode };

export default function SideNavItem({ link, name, icon }: Props) {
  const pathname = usePathname();
  return (
    <li>
      <Link
        href={link}
        className={cn(
          "flex items-center gap-3 p-4 rounded-[18px] group hover:bg-primary-50",
          cn(pathname.includes(link) && "bg-primary-50")
        )}
      >
        <span
          className={cn(
            pathname.includes(link)
              ? "text-primary-900"
              : "text-black group-hover:text-primary-500"
          )}
        >
          {icon}
        </span>
        <p
          className={cn(
            "text-sm 2xl:text-base",
            pathname.includes(link)
              ? "text-primary-900 !font-medium"
              : "text-grey-700 group-hover:text-primary-500"
          )}
        >
          {name}
        </p>
      </Link>
    </li>
  );
}
