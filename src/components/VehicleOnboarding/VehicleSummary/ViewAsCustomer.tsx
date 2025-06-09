import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import cn from "classnames";
import Link from "next/link";
import Chip from "@/components/shared/chip";
import Icons from "@/components/shared/icons";
import {
  addSpaceBeforeUppercase,
  formatNumberWithCommas,
  keyAndValueInAChip,
} from "@/utils/functions";
import useVehicleSummary from "@/components/VehicleOnboarding/VehicleSummary/useVehicleSummary";
import { VehicleInformation } from "@/utils/types";

type Props = { vehicle: VehicleInformation | null };

export default function ViewAsCustomer({ vehicle }: Props) {
  const { perks, vehicleDetails, vehicleImages } = useVehicleSummary({
    vehicle,
  });

  return (
    <div className="space-y-11">
      <div className="space-y-6 md:space-y-8">
        {/* slider */}
        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="vehicle-summary-swiper"
        >
          {vehicleImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt=""
                width={1120}
                height={460}
                className="w-full h-[218px] md:h-[460px] rounded-[42px] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* name of car */}
        <h2 className="text-h5 md:text-h3 3xl:text-4xl">
          {vehicle?.listingName}
        </h2>

        {/* car preview */}
        {/* car preview */}
        <div className="flex items-center gap-1 md:gap-7 3xl:gap-[41px] overflow-x-auto">
          {vehicleImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=""
              width={152}
              height={90}
              className="w-[152px] h-[44px] sm:h-[90px] rounded-lg sm:rounded-[18px] object-cover shrink-0"
            />
          ))}
        </div>
      </div>

      {/* advance notice */}
      <div className="bg-grey-75 p-3 flex gap-3 items-center rounded-[18px]">
        <div className="bg-warning-75 border border-warning-400 text-warning-400 h-[50px] w-[50px] flex justify-center items-center rounded-xl">
          {Icons.ic_notification}
        </div>
        <h6 className="text-grey-700 text-xs md:text-base 3xl:text-h6 !font-medium">
          {vehicle?.tripSettings.advanceNotice} advance notice required before
          booking
        </h6>
        <SectionTitle text="" />
      </div>

      <div className="flex flex-col md:flex-row items-start gap-10 ">
        <div className="w-full md:w-[62%] space-y-10">
          {/* vehicle details */}
          <div className="space-y-5">
            <SectionTitle text="Vehicle Details" />
            <div className="flex flex-wrap gap-3">
              {vehicleDetails.map((detail, index) => {
                const [key, value] = Object.entries(detail)[0];
                return (
                  <Chip
                    key={index}
                    text={keyAndValueInAChip(key, value)}
                    variant="filled"
                    radius="sm"
                    color="dark"
                  />
                );
              })}
            </div>
          </div>

          {/* vehicle description */}
          <div className="space-y-5">
            <SectionTitle text="Description" className="text-black" />
            <p className="text-xs md:text-base 3xl:text-xl max-w-[535px]">
              {vehicle?.vehicleDescription}
            </p>
          </div>

          {/* vehicle perks */}
          <div className="space-y-5">
            <SectionTitle text="Perks" />
            <div className="flex flex-wrap gap-3">
              {perks.map(
                (perk, index) =>
                  perk.status && (
                    <Chip
                      key={index}
                      text={perk.name}
                      icon={perk.icon}
                      variant="outlined"
                      radius="md"
                      color="light"
                    />
                  )
              )}
              <Link
                href="/"
                className="block w-full text-primary-500 text-base 3xl:text-xl"
              >
                Learn more about our free cancellation
              </Link>
            </div>
          </div>

          {/* vehicle features */}
          <div className="space-y-5">
            <SectionTitle text="Features" />
            <div className="flex flex-wrap gap-3">
              {vehicle?.features.map((feature, index) => (
                <Chip
                  key={index}
                  text={addSpaceBeforeUppercase(feature)}
                  variant="outlined"
                  radius="md"
                  color="light"
                />
              ))}
            </div>
          </div>

          {/* outskirt locations */}
          <div className="space-y-5">
            <SectionTitle text="Outskirt Locations" />
            <div className="flex flex-wrap gap-y-8 gap-x-[18px]">
              {vehicle?.outskirtsLocation?.map((location, index) => (
                <p
                  key={index}
                  className="text-sm md:text-base 3xl:text-xl !font-medium text-black flex items-center gap-[14px] w-[170px]"
                >
                  {Icons.ic_location}
                  <span>{location}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* pricing */}
        <div className="w-full md:w-[38%] md:border md:border-grey-200 md:rounded-[42px]">
          <div className="md:p-8 divide-y divide-grey-200 text-grey-800 !font-medium text-base 3xl:text-xl">
            <h4 className="text-h5 3xl:text-h4 !font-medium pb-[22px]">
              Pricing
            </h4>
            <div className="py-[22px] flex divide-x divide-grey-200">
              <div className="pr-6">
                <PricingTitle text="Daily (12 hrs)" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                    vehicle?.pricing?.dailyRate?.value || ""
                  )}/day`}
                />
              </div>
              <div className="pl-6">
                <PricingTitle text="Extra Hours" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                    vehicle?.pricing?.extraHoursFee || ""
                  )}/hr`}
                />
              </div>
            </div>
            <div className="py-[22px]">
              <PricingTitle text="Trip Duration" />
              <PricingDescription
                text={`Min: 1 day | Max: ${vehicle?.tripSettings?.maxTripDuration}`}
              />
            </div>
            {vehicle?.pricing?.discounts &&
              vehicle?.pricing?.discounts?.length > 0 && (
                <div className="py-[22px] space-y-2">
                  <PricingTitle text="Discounts" />
                  {vehicle.pricing.discounts.map((discount, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 max-w-[150px] md:max-w-[210px] bg-grey-75 border border-grey-300 p-2 rounded-lg text-sm md:text-xl md:text-h6"
                    >
                      <p>{discount?.durationInDays}+ days</p>
                      <p className="text-success-500">
                        {discount.percentage || 0}% off
                      </p>
                    </div>
                  ))}
                </div>
              )}
            {vehicle?.pricing?.airportPickupFee && (
              <div className="py-[22px]">
                <PricingTitle text="Airport Pickups & dropoffs" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                    vehicle?.pricing?.airportPickupFee || ""
                  )}/hr`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SectionTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <h6
    className={cn("text-grey-700 text-xl 3xl:text-h6 !font-medium", className)}
  >
    {text}
  </h6>
);

const PricingTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-xs md:text-base 3xl:text-xl", className)}>{text}</p>
);

const PricingDescription = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-sm md:text-xl 3xl:text-h6 !font-medium", className)}>
    {text}
  </p>
);
