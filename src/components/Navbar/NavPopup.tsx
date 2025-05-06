import Link from "next/link";
import { usePathname } from "next/navigation";
import { popupNavItems, popupNavItemsHome } from "@/utils/data";
import { getInitialsFromName } from "@/utils/functions";
import { useAppSelector } from "@/lib/hooks";
import { HorizontalDivider } from "../shared/divider";
import { AvatarImage } from "../shared/avatar";
import MobileNavItem from "@/components/Navbar/MobileNavItem";
import { User } from "@/utils/types";

type Props = { handleClick?: () => void; user: User | null };

export default function NavPopup({ handleClick, user }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {user && (
        <>
          <AvatarImage
            image={user?.businessLogo ?? user?.profileImage ?? ""}
            initials={getInitialsFromName(user.firstName, user.lastName)}
            size="!w-11 !h-11"
          />
          <div className="space-y-1">
            <p className="text-sm">
              {user.businessName ?? `${user.firstName} ${user.lastName}`}
            </p>
            <Link href="/profile" className="text-xs text-primary-500">
              View profile
            </Link>
          </div>
          <HorizontalDivider variant="light" />
        </>
      )}

      <ul className="list-none space-y-3">
        {pathname === "/"
          ? popupNavItemsHome.map((item, index) => (
              <MobileNavItem
                handleClick={handleClick}
                key={index}
                icon={item.icon}
                name={item.name}
                link={item.link}
                className="!py-1.5"
              />
            ))
          : popupNavItems.map((item, index) => (
              <MobileNavItem
                handleClick={handleClick}
                key={index}
                icon={item.icon}
                name={item.name}
                link={item.link}
                className="!py-1.5"
              />
            ))}
      </ul>
    </div>
  );
}
