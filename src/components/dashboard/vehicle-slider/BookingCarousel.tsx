import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useRef } from "react";

import Icons from "@/utils/Icon";
import { FullPageSpinner } from "@/components/shared/spinner";
import { VehicleBooking } from "@/types/Dashboard";
import BookingVehicle from "./BookingVehicle";
import Link from "next/link";
import { LocalRoute } from "@/utils/LocalRoutes";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";

interface Props {
  vehicles: VehicleBooking[];
  isLoading: Boolean;
}

const defaultVehicleImages = [
  "/images/vehicles/1.png",
  "/images/vehicles/2.png",
  "/images/vehicles/3.png",
];

function BookingCarousel({ vehicles, isLoading }: Props) {
  const swiperRef = useRef<SwiperRef>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  return (
    <section className="mt-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-4 py-2 rounded-xl text-sm font-medium text-[#1E93FF]">
          {Icons.ic_user}
          <span className="text-grey-900">Recent Bookings</span>
        </div>
        <Link href={LocalRoute.bookingPage}>
          <span className="text-base text-grey-700 text-lg">View All</span>
        </Link>
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
              className="hero-vehicle-swiper !py-4"
            >
              {vehicles.map((vehicle, index) => (
                <SwiperSlide key={vehicle.id || index} className="!w-auto py-2">
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
          <EmptyState
            image={ImageAssets.mailbox}
            title="No Bookings"
            message="No bookings yet"
          />
        )}
      </div>
    </section>
  );
}
export default BookingCarousel;
