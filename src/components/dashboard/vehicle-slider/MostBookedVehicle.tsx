import cn from "classnames";
import Image from "next/image";
import Icons from "@/utils/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

interface VehicleProps {
  vehicleId: string;
  location: string;
  rate: string;
  currency: string;
  type?: string;
  rides: string;
  vehicleImages: string[];
  vehicleName?: string;
}

const MostBookedVehicle = ({
  vehicleId,
  vehicleImages,
  rate,
  location,
  rides,
  type,
  currency,
  vehicleName,
}: VehicleProps) => (
  <div
    className={cn(
      "bg-white border border-grey-200",
      "flex flex-col md:flex-row w-[320px] md:w-[650px] 3xl:w-[750px] rounded-[24px]",
      "border border-grey-200 gap-2"
    )}
  >
    <div className="w-full max-w-[320px] relative overflow-hidden rounded-tl-[24px] rounded-bl-[24px] md:rounded-tr-none md:rounded-br-none">
      {location && (
        <div className="absolute top-2 left-2 z-10 text-grey-700 bg-white py-0.5 px-2 rounded-3xl flex items-center gap-0.5 text-[0.7rem]">
          <span className="*:!w-2.5 *:!h-2.5">{Icons.ic_location}</span>
          <span className="uppercase text-[0.6rem] 3xl:text-xs !font-semibold tracking-wider">
            {location}
          </span>
        </div>
      )}
      {vehicleImages.length > 0 ? (
        <Swiper
          pagination={{
            type: "fraction",
            // className:
            //   "absolute bottom-2 left-2 z-20 bg-[#00000080] text-white rounded-full px-1.5 py-0.5 text-[0.6rem]",
          }}
          navigation={{
            prevEl: ".swiper-button-prev-vehicle",
            nextEl: ".swiper-button-next-vehicle",
          }}
          modules={[Pagination, Navigation, Autoplay]}
          className="hero-vehicle-swiper h-[182px] md:h-[213px]"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {vehicleImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={vehicleName || `Vehicle Image ${index + 1}`}
                width={320}
                height={213}
                className="w-full h-full object-cover"
                style={{
                  borderTopLeftRadius: "24px",
                  borderBottomLeftRadius: "24px",
                }}
                onError={(e) => {
                  {
                    Icons.ic_instagram;
                  }
                }}
              />
            </SwiperSlide>
          ))}
          <div className="absolute bottom-2 right-2 z-10 flex items-center space-x-1">
            <div className="swiper-button-prev-vehicle bg-[#00000080] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
              {" "}
              {Icons.ic_chevron_left}
              {/* Reduced icon size */}
            </div>
            <div className="swiper-button-next-vehicle bg-[#00000080] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
              {" "}
              {/* Reduced button size */}
              {Icons.ic_chevron_right}
              {/* Reduced icon size */}
            </div>
          </div>
        </Swiper>
      ) : (
        <div className="w-full h-[182px] md:h-[213px] bg-gray-100 flex items-center justify-center rounded-tl-[24px] rounded-bl-[24px]">
          {Icons.ic_instagram}
        </div>
      )}
    </div>
    <div className="w-full h-[182px] md:h-[213px] min-w-[300px] px-4 3xl:px-8 py-6  rounded-tr-[24px] rounded-br-[24px]  flex flex-col justify-between">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-grey-900">{vehicleName}</h2>
        <h4 className="text-md text-grey-700">
          {currency} {rate}/day
        </h4>
        {type && (
          <span className="inline-block text-sm text-grey-600">{type}</span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-success-600">
          {rides} Completed Rides
        </span>
        <Link href="/" className="flex items-center text-sm text-grey-700">
          View Host Information
          {Icons.ic_chevron_right}
        </Link>
      </div>
    </div>
  </div>
);
export default MostBookedVehicle;
