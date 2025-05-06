import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import cn from "classnames";
import useLogout from "@/components/Navbar/useLogout";

type Props = {
  link?: string;
  name: string;
  icon: ReactNode;
  handleClick?: () => void;
  className?: string;
};

export default function MobileNavItem({
  link,
  name,
  icon,
  handleClick,
  className,
}: Props) {
  const pathname = usePathname();
  const { logoutUser } = useLogout();
  return (
    <li>
      {name === "Log out" ? (
        <button onClick={() => logoutUser()}>
          <NavItem icon={icon} name={name} />
        </button>
      ) : (
        link && (
          <Link
            onClick={handleClick ? handleClick : () => {}}
            href={link}
            className={cn(
              pathname.includes(link) ? "text-primary-500 " : "text-black",
              className
            )}
          >
            <NavItem icon={icon} name={name} link={link} />
          </Link>
        )
      )}
    </li>
  );
}

const NavItem = ({ link, name, icon }: Props) => {
  const pathname = usePathname();
  return (
    <p
      className={cn(
        "flex items-center gap-3 py-3 text-sm 2xl:text-base",
        link && pathname.includes(link)
          ? "text-primary-500"
          : "text-grey-700 hover:text-primary-500",
        name === "Log out" && "hover:!text-error-500"
      )}
    >
      <span className="*:!w-5 *:!h-5">{icon}</span>
      <span>{name}</span>
    </p>
  );
};
