import SideNavItem from "@/components/Navbar/SideNavItem";
import Image from "next/image";
import { dashboardNavItems } from "@/utils/data";
import { ImageAssets } from "@/utils/ImageAssets";

type Props = {};

export default function SideNav({}: Props) {
  return (
    <div className="bg-white pt-8 pb-6 hidden md:block fixed left-0 top-0 md:w-[230px]  h-screen border-r border-grey-300 shadow-[12px_4px_100px_0_#00000012]">
      <div className="space-y-1 px-2 w-full">
        <div className="ml-4 pb-5">
          <Image
            className=""
            src={ImageAssets.navLogo}
            alt=""
            width={114}
            height={40}
          />
        </div>
        <ul className="list-none space-y-1.5">
          {dashboardNavItems.map((item, index) => (
            <SideNavItem
              key={index}
              icon={item.icon}
              name={item.name}
              link={item.link}
              altlink={item.altlink || ""}
              secondaryAltLink={item.secondaryAltLink || ""}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
