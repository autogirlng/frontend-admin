import { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import Icons from "@/utils/Icon";
import { VerticalDivider } from "@/components/shared/divider";
import Chip from "@/components/shared/chip";
import { formatNumberWithCommas, keyAndValueInAChip } from "@/utils/functions";
import cn from "classnames";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";

type Props = {
  vehicleId: string;
  showAllFilters: boolean;
  isDisplayList: boolean;
  vehicleImages: string[];
  vehicleDetails: { [key: string]: string | JSX.Element }[];
  name: string;
  type: string;
  location: string;
  dailyPrice: number;
  extraHoursFee: number;
  currency: string;
  fromDate?: string;
  untilDate?: string;
  fromTime?: string;
  untilTime?: string;
};

const ExploreVehicleCard = ({
  vehicleId,
  showAllFilters,
  isDisplayList,
  vehicleImages,
  name,
  type,
  location,
  dailyPrice,
  extraHoursFee,
  currency,
  vehicleDetails,
  fromDate,
  untilDate,
  fromTime,
  untilTime,
}: Props) => (
  <div
    className={cn(
      "w-full border border-grey-200 rounded-[42px]",
      isDisplayList && showAllFilters
        ? "flex flex-col xl:flex-row xl:pr-4 xl:h-[230px]"
        : isDisplayList
        ? "flex flex-col md:flex-row pr-4 md:h-[230px]"
        : ""
    )}
  >
    <div
      className={cn(
        "w-full relative",
        isDisplayList && showAllFilters
          ? "xl:w-[350px]"
          : isDisplayList
          ? "md:w-[350px]"
          : ""
      )}
    >
      <div className="absolute top-3 left-3 z-10 text-grey-800 bg-white py-1 px-3 rounded-3xl flex items-center gap-0.5">
        <span className="*:!w-3 *:!h-3">{Icons.ic_location_filled}</span>
        <span className="uppercase text-xs 3xl:text-sm !font-semibold tracking-wider">
          {location}
        </span>
      </div>
      <Swiper
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="hero-vehicle-swiper"
      >
        {vehicleImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image ?? "/images/vehices/sedan.png"}
              alt=""
              width={328}
              height={233}
              className={cn(
                "w-full h-[182px] md:h-[230px] object-cover",
                isDisplayList && showAllFilters
                  ? "rounded-t-3xl xl:rounded-tr-none xl:rounded-s-3xl"
                  : isDisplayList
                  ? "rounded-t-3xl md:rounded-tr-none md:rounded-s-3xl"
                  : "rounded-t-3xl"
              )}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    <div
      className={cn(
        "w-full",
        isDisplayList && showAllFilters
          ? "py-6 xl:py-0 px-4 xl:px-0 space-y-3 xl:space-y-0 xl:w-[calc(100%-350px)] flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
          : isDisplayList
          ? "md:w-[calc(100%-350px)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 md:py-0 px-4 md:px-0"
          : "py-6 px-4 3xl:px-8 space-y-3"
      )}
    >
      <div
        className={cn(
          "text-grey-600 text-base md:text-xl 3xl:text-h6",
          isDisplayList && showAllFilters
            ? "xl:px-5 xl:min-w-[230px] 2xl:min-w-fit space-y-4"
            : isDisplayList
            ? "md:px-5 3xl:px-10 md:py-8 space-y-4"
            : "space-y-3"
        )}
      >
        <Link
          href={`${LocalRoute.vehiclePage}/${vehicleId}${
            fromDate || fromTime || untilDate || untilTime
              ? // || bookingType
                `?${[
                  fromDate && `startDate=${fromDate}`,
                  fromTime && `startTime=${fromTime}`,
                  untilDate && `endDate=${untilDate}`,
                  untilTime && `endTime=${untilTime}`,
                  // bookingType && `bookingType=${bookingType}`,
                ]
                  .filter(Boolean)
                  .join("&")}`
              : ""
          }`}
        >
          <h5 className="text-grey-800 text-xl md:text-h6 3xl:text-h5 !font-semibold">
            {name}
          </h5>
        </Link>
        <div
          className={cn(
            isDisplayList
              ? "flex items-center divide-x divide-grey-200 space-x-3"
              : "space-y-3",
            showAllFilters && "2xl:divide-x 2xl:divide-grey-200 "
          )}
        >
          <div>
            {isDisplayList && <p className="text-sm 3xl:text-base">Daily</p>}
            <p className="text-sm md:text-base 3xl:text-xl !font-semibold">
              {currency} {formatNumberWithCommas(dailyPrice)}{" "}
              {!isDisplayList && "/day"}
            </p>
          </div>
          <div className="pl-3">
            {isDisplayList && (
              <p className="text-sm 3xl:text-base">Extra Hours</p>
            )}
            <p className="text-sm md:text-base 3xl:text-xl !font-semibold">
              {currency} {extraHoursFee} {!isDisplayList && "/extra hour"}
            </p>
          </div>
        </div>
        <p>{type}</p>
      </div>

      {isDisplayList && (
        <VerticalDivider
          className={showAllFilters ? "hidden xl:block" : "hidden md:block"}
        />
      )}

      {isDisplayList && (
        <div
          className={cn(
            "flex flex-wrap gap-3 3xl:max-w-[400px]",
            showAllFilters ? "xl:max-w-[365px]" : "xl:max-w-[365px]"
          )}
        >
          {vehicleDetails?.map((detail, index) => {
            const [key, value] = Object.entries(detail)[0];
            if (key !== "icon") {
              return (
                <Chip
                  icon={detail.icon}
                  key={index}
                  text={keyAndValueInAChip(key, value as string)}
                  variant="filled"
                  radius="sm"
                  color="lighter"
                  className="!px-2 !text-grey-900 !bg-grey-75 border border-grey-200"
                />
              );
            }
          })}
        </div>
      )}

      {isDisplayList && (
        <VerticalDivider
          className={showAllFilters ? "hidden xl:block" : "hidden md:block"}
        />
      )}

      <div className="bg-grey-90 text-grey-600 h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center">
        {Icons.ic_whishlist}
      </div>
    </div>
  </div>
);

export default ExploreVehicleCard;
