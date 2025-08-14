import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getInitialsFromName } from "@/utils/functions";
import { AvatarInitials, AvatarImage } from "../shared/avatar";
import { HorizontalDivider } from "../shared/divider";
import Icons from "@/utils/Icon";
import MobileNavItem from "@/components/Navbar/MobileNavItem";
import {
  dashboardNavItems,
  popupNavItems,
  popupNavItemsforNoUser,
} from "@/utils/data";
import { User } from "@/utils/types";
import { ImageAssets } from "@/utils/ImageAssets";

type Props = { userToken?: string; user: User | null };

export default function MobileNav({ userToken, user }: Props) {
  const [openNav, setOpenNav] = useState<boolean>(false);

  return (
    <header className="block md:hidden px-8 py-3 bg-grey-50">
      <div className="flex items-center justify-between">
        <Image
          className=""
          src={ImageAssets.logo}
          alt=""
          width={100}
          height={15}
        />
        <button
          className="bg-white border border-grey-300 rounded-[33px] p-1 pr-2 flex items-center gap-2"
          onClick={() => setOpenNav(!openNav)}
        >
          <AvatarInitials
            initials={
              user
                ? getInitialsFromName(user.firstName, user.lastName)
                : Icons.ic_user
            }
            size="!w-8 !h-8"
            color="!bg-primary-100 !text-primary-800 !text-[10px] !font-bold *:!w-5 *!h-5"
          />
          {Icons.ic_menu}
        </button>
      </div>
      <nav
        className={cn(
          "fixed top-[60px] transition-transform overflow-auto",
          openNav
            ? "right-0 z-10 w-full min-h-screen h-full bg-white px-8 py-14 translate-x-0 visible"
            : "h-0 w-0 translate-x-[100%] invisible"
        )}
      >
        {userToken || user ? (
          <div className="space-y-6 pb-8">
            <AvatarImage
              image={user?.businessLogo ?? user?.profileImage ?? ""}
              initials={
                user
                  ? getInitialsFromName(user.firstName, user.lastName)
                  : Icons.ic_user
              }
              size="!w-20 !h-20"
            />
            <div className="space-y-1">
              {user && (
                <p className="text-sm">
                  {user.firstName} {user.lastName}
                </p>
              )}
              <Link href="/profile" className="text-xs text-primary-500">
                View profile
              </Link>
            </div>

            <HorizontalDivider variant="light" />

            <ul className="list-none space-y-3">
              {dashboardNavItems.map((item, index) => (
                <MobileNavItem
                  handleClick={() => setOpenNav(false)}
                  key={index}
                  icon={item.icon}
                  name={item.name}
                  link={item.link}
                />
              ))}
            </ul>

            <HorizontalDivider variant="light" />

            <ul className="list-none space-y-3">
              {popupNavItems.map((item, index) => (
                <MobileNavItem
                  handleClick={() => setOpenNav(false)}
                  key={index}
                  icon={item.icon}
                  name={item.name}
                  link={item.link}
                  className="!py-1.5"
                />
              ))}
            </ul>
          </div>
        ) : (
          <ul className="list-none space-y-3 pb-8">
            {popupNavItemsforNoUser.map((item, index) => (
              <MobileNavItem
                handleClick={() => setOpenNav(false)}
                key={index}
                icon={item.icon}
                name={item.name}
                link={item.link}
                className="!py-1.5"
              />
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
