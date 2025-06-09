import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useEffect, useRef } from "react";
import cn from "classnames";
import Image from "next/image";
import Icons from "@/utils/Icon";
import { FullPageSpinner } from "@/components/shared/spinner";
import { VehicleBooking } from "@/types/Dashboard";
import BookingVehicle from "./BookingVehicle";
import MostBookedVehicle from "./MostBookedVehicle";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";

interface Props {
  vehicles: VehicleBooking[];
  isLoading: Boolean;
}

const defaultVehicleImages = [
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/1.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/2.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/3.png`,
];

function MostBookedVehicleCarousel({ vehicles, isLoading }: Props) {
  const swiperRef = useRef<SwiperRef>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  return (
    <section className="pt-[45px] ">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {Icons.ic_user}
          <span className="text-grey-900">Most Booked Vehicles</span>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <FullPageSpinner className="!min-h-[300px]" />
        ) : vehicles.length > 0 ? (
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Swiper
              keyboard
              ref={swiperRef}
              slidesPerView={"auto"}
              modules={[Pagination, Autoplay]}
              spaceBetween={20}
              pagination={{
                type: "bullets",
                clickable: true,
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: {
                  spaceBetween: 4,
                },
                600: {
                  spaceBetween: 20,
                },
              }}
              loop={true}
              className="hero-vehicle-swiper !py-8"
            >
              {vehicles.map((vehicle, index) => (
                <SwiperSlide key={vehicle.id || index} className="!w-auto py-5">
                  <MostBookedVehicle
                    currency={vehicle.currencyCode}
                    rides={"100"}
                    type={vehicle.vehicle.vehicleType}
                    rate={`${vehicle.amount.toString()}/day`}
                    location={vehicle.vehicle.location}
                    vehicleName={vehicle.vehicle.listingName}
                    vehicleId={vehicle?.id ?? ""}
                    vehicleImages={
                      [
                        vehicle?.vehicle.VehicleImage?.frontView,
                        vehicle?.vehicle.VehicleImage?.backView,
                        vehicle?.vehicle.VehicleImage?.sideView1,
                        vehicle?.vehicle.VehicleImage?.sideView2,
                        vehicle?.vehicle.VehicleImage?.interior,
                        vehicle?.vehicle.VehicleImage?.other,
                      ].filter(Boolean) as string[]
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <EmptyState
            image={ImageAssets.mailbox}
            title="No Most  Booked Vehicle"
            message="No most booked  vehicles yet"
          />
        )}
      </div>
    </section>
  );
}
export default MostBookedVehicleCarousel;
