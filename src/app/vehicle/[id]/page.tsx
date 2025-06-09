"use client";

import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MappedInformation } from "@/utils/types";
import { FullPageSpinner } from "@/components/shared/spinner";
import AppTabs from "@/components/shared/tabs";
import Icons from "@/utils/Icon";
import ListingDetailsHeader from "@/components/Listings/Details/Header";
import ListingDetailsVehicleImages from "@/components/Listings/Details/VehicleImages";
import ListingDetailsVehicleAvailability from "@/components/Listings/Details/VehicleAvailability";
import ListingDetailsVehicleDetails from "@/components/Listings/Details/VehicleDetails";
import ListingDetailsEarnings from "@/components/Listings/Details/Earnings";
import ListingDetailsUpcomingBookings from "@/components/Listings/Details/UpcomingBookings";
import VehicleInformation from "@/components/Listings/Details/VehicleInformation";
import VehicleReviews from "@/components/Listings/Details/Reviews";
import DriversDetails from "@/components/Listings/Details/DriversDetails";
import useGetListingById from "@/components/Listings/Details/hooks/useGetListingById";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LocalRoute } from "@/utils/LocalRoutes";

type Extras = {
  name: string;
  icon: ReactNode;
  id: string;
};

const initialExtras: Extras[] = [
  { name: "Fuel Included", icon: Icons.ic_fuel_station, id: "fuelProvided" },
  {
    name: "Driver Available",
    icon: Icons.ic_wheel,
    id: "provideDriver",
  },
  // {
  //   name: "Tracker Available",
  //   icon: Icons.ic_driver_provided,
  //   id: "hasTracker",
  // },
  // {
  //   name: "Insured",
  //   icon: Icons.ic_driver_provided,
  //   id: "hasInsurance",
  // },
];

export default function VehiclePage() {
  const params = useParams(); // Get all parameters
  const id = params.id as string; // Access 'id' and cast to string for type safety

  const router = useRouter();
  const [extras, setExtras] = useState<Extras[]>(initialExtras);
  const {
    listingDetail,
    isError,
    isLoading,
    isSuccess,
    vehicleDetails,
    vehicleImages,
  } = useGetListingById({
    id: id,
  });

  useEffect(() => {
    if (!id) {
      router.push(LocalRoute.fleetPage);
    }
  }, [id]);

  // use useMemo here
  useEffect(() => {
    if (isSuccess) {
      // update extras
      const updatedExtras = extras.map((extra) => {
        if (extra.id === "fuelProvided") {
          return {
            ...extra,
            status: listingDetail?.tripSettings?.fuelProvided || false,
          };
        } else if (extra.id === "provideDriver") {
          return {
            ...extra,
            status: listingDetail?.tripSettings?.provideDriver || false,
          };
        }
        return extra;
      });
      setExtras(updatedExtras);
    }
  }, [isSuccess]);

  const tabs = [
    {
      name: "Vehicle information",
      value: "tab1",
      content: <VehicleInformation listingDetails={listingDetail} />,
    },
    {
      name: "Reviews",
      value: "tab2",
      content: <VehicleReviews id={id} />,
    },
    {
      name: "Driver details",
      value: "tab3",
      content: <DriversDetails id={id} />,
    },
  ];

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <p>something went wrong </p>;
  }

  return (
    <DashboardLayout title="Settings" currentPage="Settings">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11">
        <main className="flex gap-5">
          <div className="py-[56px] w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-360px)] 3xl:w-[calc(100%-500px)]">
            <div className="text-grey-800 space-y-[52px]">
              {" "}
              {/* name */}
              <ListingDetailsHeader
                name={listingDetail?.listingName}
                id={listingDetail?.id}
                status={listingDetail?.status}
              />
              <ListingDetailsVehicleImages
                vehicleImages={vehicleImages as string[]}
              />
              <ListingDetailsVehicleAvailability
                vehicleStatus={listingDetail?.vehicleStatus}
                // isActive={listingDetail?.isActive}
                id={listingDetail?.id}
              />
              <ListingDetailsVehicleDetails
                extras={extras}
                vehicleDetails={vehicleDetails as MappedInformation[]}
              />
              <ListingDetailsEarnings
                statistics={listingDetail?.user?.statistics}
              />
              <AppTabs label="listing details tabs" tabs={tabs} />
            </div>
            <ListingDetailsUpcomingBookings
              vehicleId={listingDetail?.id || ""}
            />
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
