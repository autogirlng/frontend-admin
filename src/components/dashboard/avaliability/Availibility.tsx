"use client";

import cn from "classnames";
import { JSX, useEffect, useState } from "react";
import EmptyState from "../../EmptyState";
import DesktopNav from "../../Navbar/DesktopNav";
import MobileNav from "../../Navbar/MobileNav";
import BackLink from "@/components/BackLink";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import Image from "next/image";
import useAvailability from "./hooks/availability";

import AllFilters from "./AllFilters";
import MainFilters from "./MainFilters";
import { FullPageSpinner } from "@/components/shared/spinner";
import ExploreVehicleCard from "./VehicleCard";
import SearchBookings from "@/components/SearchBookings";
import Icons from "@/utils/Icon";

// Default placeholder images
const placeholderImages = [
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/1.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/2.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/3.png`,
];

type Props = {
  title?: string;
  icon?: JSX.Element;
  type: "top-rated" | "all" | "search";
  location?: string;
  search?: string;
  fromDate?: string;
  fromTime?: string;
  untilDate?: string;
  untilTime?: string;
};

export default function AvailabilityLayout({
  title,
  icon,
  type,
  location,
  search,
  fromDate,
  fromTime,
  untilDate,
  untilTime,
}: Props) {
  const { user } = useAppSelector((state) => state.user);
  const pageLimit = 10;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDisplayList, setIsDisplayList] = useState<boolean>(true);
  const [showAllFilters, setShowAllFilters] = useState<boolean>(false);

  const [filters, setFilters] = useState<{
    price: number[];
    type: string[];
    make: string[];
    yearOfRelease: string[];
    numberOfSeats: string[];
    features: string[];
  }>({
    price: [0, 100000],
    type: [],
    make: [],
    yearOfRelease: [],
    numberOfSeats: [],
    features: [],
  });

  const [searchValue, setSearchValue] = useState<string>(search || "");
  const [fromDateValue, setFromDateValue] = useState<Date | null>(
    fromDate ? new Date(fromDate) : null
  );
  const [fromTimeValue, setFromTimeValue] = useState<Date | null>(
    fromTime ? new Date(fromTime) : null
  );
  const [untilDateValue, setUntilDateValue] = useState<Date | null>(
    untilDate ? new Date(untilDate) : null
  );
  const [untilTimeValue, setUntilTimeValue] = useState<Date | null>(
    untilTime ? new Date(untilTime) : null
  );

  const { listings, totalCount, isError, isLoading } = useAvailability({
    currentPage,
    pageLimit,
    filters,
    type,
    search: searchValue,
    fromDate: fromDateValue?.toISOString(),
    untilDate: untilDateValue?.toISOString(),
    fromTime: fromTimeValue?.toISOString(),
    untilTime: untilTimeValue?.toISOString(),
    location,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string | number[]) => {
    const processedValue =
      filterName === "numberOfSeats"
        ? (value as string).split(" ")[0].replace("+", "")
        : value;

    setFilters((prev) => ({
      ...prev,
      [filterName]:
        filterName === "price"
          ? value
          : Array.isArray(prev[filterName as keyof typeof prev])
          ? (prev[filterName as keyof typeof prev] as any[]).includes(
              processedValue
            )
            ? (prev[filterName as keyof typeof prev] as any[]).filter(
                (item) => item !== processedValue
              )
            : [
                ...(prev[filterName as keyof typeof prev] as any[]),
                processedValue,
              ]
          : processedValue,
    }));
  };

  // Function to get valid image URLs from vehicle data
  const getVehicleImages = (vehicle: any) => {
    if (!vehicle?.VehicleImage) return placeholderImages;

    const images = [
      vehicle.VehicleImage.frontView,
      vehicle.VehicleImage.backView,
      vehicle.VehicleImage.sideView1,
      vehicle.VehicleImage.sideView2,
      vehicle.VehicleImage.interior,
      vehicle.VehicleImage.other,
    ].filter(Boolean); // Remove any undefined/null values

    return images.length > 0 ? images : placeholderImages;
  };

  return (
    <div>
      <DesktopNav user={null} explorePage>
        <div className="max-w-[1024px]">
          <SearchBookings
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            fromDateValue={fromDateValue}
            setFromDateValue={setFromDateValue}
            fromTimeValue={fromTimeValue}
            setFromTimeValue={setFromTimeValue}
            untilDateValue={untilDateValue}
            setUntilDateValue={setUntilDateValue}
            untilTimeValue={untilTimeValue}
            setUntilTimeValue={setUntilTimeValue}
          />
        </div>
      </DesktopNav>
      <MobileNav user={user}></MobileNav>
      <div className="pb-14 pt-10 md:pt-44 px-8">
        <div
          className={cn(
            "space-y-8 mx-auto",
            showAllFilters
              ? "lg:w-[102%] 3xl:w-[103%] max-w-[1650px] 3xl:max-w-[1700px]"
              : "w-full max-w-[1400px]"
          )}
        >
          <div
            className={cn(
              "space-y-4 md:space-y-8",
              showAllFilters && "md:ml-[290px] 2xl:ml-[480px] mr-2"
            )}
          >
            <BackLink backLink="/" />
            {type !== "search" && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="*:h-8 md:*:h-10 text-primary-500">
                    {icon}
                  </span>
                  <h1 className="text-base md:text-h5 3xl:text-h4 !font-bold">
                    {title}
                  </h1>
                </div>
                <div className="hidden md:block space-x-2">
                  <button
                    onClick={() => setIsDisplayList(true)}
                    className={cn(
                      "*:h-4 3xl:*:h-6 *:w-4 3xl:*:w-6 p-2 rounded-xl",
                      isDisplayList
                        ? "bg-primary-500 text-white"
                        : "border border-grey-300 text-grey-700"
                    )}
                  >
                    {Icons.ic_note_list}
                  </button>
                  <button
                    onClick={() => setIsDisplayList(false)}
                    className={cn(
                      "*:h-4 3xl:*:h-6 *:w-4 3xl:*:w-6 p-2 rounded-xl",
                      !isDisplayList
                        ? "bg-primary-500 text-white"
                        : "border border-grey-300 text-grey-700"
                    )}
                  >
                    {Icons.ic_dashboard_square}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <h5 className="text-sm md:text-h5 3xl:text-h5">
                Vehicle Availability {/* {totalCount}+ vehicles available */}
              </h5>
              <button
                onClick={() => setShowAllFilters(true)}
                className="md:hidden bg-white border border-grey-300 rounded-lg p-2 flex items-center gap-2 text-grey-500"
              >
                {Icons.ic_filter}
              </button>
            </div>
          </div>

          {showAllFilters ? (
            <AllFilters
              filters={filters}
              handleFilterChange={handleFilterChange}
              setShowAllFilters={setShowAllFilters}
            />
          ) : (
            <MainFilters
              filters={filters}
              handleFilterChange={handleFilterChange}
              setShowAllFilters={setShowAllFilters}
            />
          )}
          <div
            className={cn(
              "space-y-8",
              showAllFilters && "md:ml-[290px] 2xl:ml-[480px] mr-2"
            )}
          >
            {isLoading ? (
              <FullPageSpinner />
            ) : isError ? (
              <p>Something went wrong</p>
            ) : listings.length > 0 ? (
              <div
                className={cn(
                  isDisplayList
                    ? "flex flex-col gap-8"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
                )}
              >
                {listings.map((vehicle, index) => (
                  <ExploreVehicleCard
                    key={index}
                    vehicleId={vehicle?.id ?? ""}
                    fromDate={fromDateValue?.toISOString()}
                    untilDate={untilDateValue?.toISOString()}
                    fromTime={fromTimeValue?.toISOString()}
                    untilTime={untilTimeValue?.toISOString()}
                    showAllFilters={showAllFilters}
                    isDisplayList={isDisplayList}
                    name={vehicle?.listingName || "Premium Vehicle"}
                    type={vehicle?.vehicleType || "Luxury"}
                    location={vehicle.location || "City"}
                    dailyPrice={vehicle?.pricing?.dailyRate?.value || 0}
                    currency={"NGN"}
                    extraHoursFee={vehicle?.pricing?.extraHoursFee}
                    vehicleImages={getVehicleImages(vehicle)}
                    vehicleDetails={
                      [
                        {
                          driverAvailable: vehicle?.tripSettings?.provideDriver
                            ? "Yes"
                            : "No",
                          icon: Icons.ic_driver,
                        },
                        {
                          fuelAvailable: vehicle?.tripSettings?.fuelProvided
                            ? "Yes"
                            : "No",
                          icon: Icons.ic_fuel,
                        },
                        {
                          seats: vehicle?.numberOfSeats?.toString(),
                          icon: Icons.ic_seat,
                        },
                      ] as Array<{ [key: string]: string | JSX.Element }>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Listings Found"
                image="/icons/empty_booking_state.png"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
