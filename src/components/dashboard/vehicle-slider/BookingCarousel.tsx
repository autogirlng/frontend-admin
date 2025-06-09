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

interface Props {
  vehicles: VehicleBooking[];
}

const defaultVehicleImages = [
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/1.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/2.png`,
  `${process.env.NEXT_PUBLIC_BASE_URL || ''}/images/vehicles/3.png`,
];

function BookingCarousel({ vehicles }: Props) {
  const swiperRef = useRef<SwiperRef>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  const isError = false;
  const isLoading = false;

  useEffect(() => {
    console.log("vehicles", vehicles);
  }, [vehicles]);

  return (
    <section className="pt-[45px] md:pt-0 md:pb-[50px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {Icons.ic_user}
          <span className="text-grey-900">Recent Bookings</span>
        </div>
        <span>View All</span>
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
                  <BookingVehicle
                    location={vehicle.vehicle.location}
                    guestName={vehicle.guestName}
                    hostName={`${vehicle.user.firstName} ${vehicle.user.lastName}`}
                    endDate={vehicle?.endDate ?? ""}
                    startDate={vehicle.startDate ?? ""}
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
          <div>
            <BookingVehicle
              vehicleId=""
              guestName=""
              location=""
              hostName="No Vehicle Available"
              //   location=""
              //   dailyPrice={0}
              //   currency="NGN"
              vehicleImages={defaultVehicleImages}
            />
          </div>
        )}
      </div>
    </section>
  );
}
export default BookingCarousel;
