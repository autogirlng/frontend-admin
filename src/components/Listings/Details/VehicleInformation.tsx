import cn from "classnames";
import Chip from "@/components/shared/chip";
import Button from "@/components/shared/button";
import Link from "next/link";
import { ReactNode } from "react";
import { ListingInformation } from "@/utils/types";
import {
  addSpaceBeforeUppercase,
  formatNumberWithCommas,
} from "@/utils/functions";

type Props = {
  listingDetails: ListingInformation | null;
};

export default function VehicleInformation({ listingDetails }: Props) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
        <h5 className="text-xl md:text-h6 3xl:text-h5 !font-semibold text-black">
          Vehicle Details
        </h5>
        <Link href={`/dashboard/vehicle-onboarding?id=${listingDetails?.id}`}>
          <Button className="!text-xs 3xl:!text-base text-primary-500 !bg-primary-75 rounded-[31px] !py-1.5 3xl:!py-2 !px-3 3xl:!px-4">
            Edit Vehicle Listing
          </Button>
        </Link>
      </div>
      <VehicleDetailsSection
        title="License Plate Number"
        text={listingDetails?.licensePlateNumber}
      />
      <VehicleDetailsSection
        title="Location (only you can see this)"
        text={listingDetails?.address}
      />
      <VehicleDetailsSection
        title="Description"
        text={listingDetails?.vehicleDescription}
      />
      <VehicleDetailsSection title="Vehicle Features">
        <div className="flex flex-wrap gap-3">
          {listingDetails?.features?.map((feature: any, index: number) => {
            return (
              <Chip
                key={index}
                text={addSpaceBeforeUppercase(feature)}
                variant="filled"
                radius="sm"
                color="light"
              />
            );
          })}
        </div>
      </VehicleDetailsSection>
      <VehicleDetailsSection title="Tracker Enabled">
        <FeatureStatus status={listingDetails?.hasTracker || false} />
      </VehicleDetailsSection>
      <VehicleDetailsSection title="Is This Vehicle Insured?">
        <FeatureStatus status={listingDetails?.hasInsurance || false} />
      </VehicleDetailsSection>

      <VehicleDetailsSection title="Pricing">
        <div className="space-y-2 md:space-y-5">
          <PricingSection
            text="Daily"
            value={`NGN ${formatNumberWithCommas(
              listingDetails?.pricing?.dailyRate?.value || "-"
            )}`}
          />
          <PricingSection
            text="Extra Hours"
            value={`NGN ${formatNumberWithCommas(
              listingDetails?.pricing?.extraHoursFee || "-"
            )}`}
          />
          <PricingSection
            text="Airport pickup and dropoffs"
            value={`NGN ${formatNumberWithCommas(
              listingDetails?.pricing?.airportPickupFee || "-"
            )}`}
          />
          <PricingSection
            text="Outskirts"
            value={`NGN ${formatNumberWithCommas(
              listingDetails?.outskirtsPrice || "-"
            )}`}
          />
        </div>
      </VehicleDetailsSection>
      <VehicleDetailsSection title="Discounts">
        <div className="space-y-2 md:space-y-5">
          {listingDetails?.pricing?.discounts?.map((item, index) => (
            <PricingSection
              key={index}
              text={`${item?.durationInDays}+ days`}
              value={`${item?.percentage || "-"}% off`}
            />
          ))}
        </div>
      </VehicleDetailsSection>
    </>
  );
}

const VehicleDetailsSection = ({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: ReactNode;
}) => (
  <div className="space-y-5">
    <p className="text-sm md:text-xl 3xl:text-h6 text-black !font-medium">
      {title}
    </p>
    {text ? (
      <p className="text-xs md:text-base 3xl:text-xl text-grey-900 !font-normal">
        {text}
      </p>
    ) : (
      children
    )}
  </div>
);

const FeatureStatus = ({ status }: { status: boolean }) => (
  <div
    className={cn(
      "py-2 px-3 text-sm rounded-lg w-fit",
      status ? "bg-primary-75 text-primary-500" : "bg-grey-100 text-grey-500"
    )}
  >
    {status ? "Yes" : "No"}
  </div>
);

const PricingSection = ({ text, value }: { text: string; value: string }) => (
  <div className="py-4 px-7 text-black rounded-[18px] bg-grey-90 w-fulll flex flex-col sm:flex-row gap-2 justify-between">
    <p className="text-sm 3xl:text-base md:font-medium">{text}</p>
    <p className="text-sm md:text-base 3xl:text-xl font-semibold md:font-normal">
      {value}
    </p>
  </div>
);
