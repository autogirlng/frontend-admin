import cn from "classnames";
import Image from "next/image";
import Icons from "@/utils/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface VehicleProps {
  vehicleId: string;
  vehicleImages: string[];
  location: string;
  guestName?: string;
  hostName?: string;
  vehicleName?: string;
  startDate?: string;
  endDate?: string;
}

const BookingVehicle = ({
  vehicleId,
  vehicleImages,
  location,
  guestName,
  hostName,
  vehicleName,
  startDate,
  endDate,
}: VehicleProps) => (
  <div
    className={cn(
      "bg-grey-200 p-2.5 border border-grey-200",
      "flex flex-col md:flex-row w-[320px] md:w-[650px] 3xl:w-[750px] rounded-[24px]", // Slightly reduced width
      "border border-grey-200 gap-2"
    )}
  >
    <div className="w-full max-w-[320px] relative rounded-[24px] overflow-hidden">
      {location && (
        <div className="absolute top-2 left-2 z-10 text-grey-700 bg-white py-0.5 px-2 rounded-3xl flex items-center gap-0.5 text-[0.7rem]">
          {" "}
          {/* Reduced location text size */}
          <span className="*:!w-2.5 *:!h-2.5">{Icons.ic_location}</span>
          <span className="uppercase text-[0.6rem] 3xl:text-xs !font-semibold tracking-wider">
            {" "}
            {/* Reduced location label size */}
            {location}
          </span>
        </div>
      )}
      {vehicleImages.length > 0 ? (
        <Swiper
          pagination={{
            type: "fraction",
            // className:
            //   "absolute bottom-2 left-2 z-10 bg-[#00000080] text-white rounded-full px-1.5 py-0.5 text-[0.6rem]", // Reduced pagination size
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
                height={213} // Slightly reduced height
                className="w-full object-cover rounded-[24px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/vehicles/1.png"; // Fallback image
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
        <div className="w-full h-[182px] md:h-[213px] bg-gray-100 flex items-center justify-center rounded-[24px]">
          {" "}
          {/* Reduced height */}
          {Icons.ic_instagram}
          {/* Reduced placeholder icon size */}
        </div>
      )}
    </div>
    <div className="w-full h-[182px] md:h-[213px] min-w-[300px] px-4 3xl:px-8 py-6 bg-white rounded-[24px] text-grey-600 text-sm md:text-base 3xl:text-lg">
      {" "}
      {/* Reduced base text size */}
      <div className="grid grid-cols-2 gap-y-1.8">
        <div>
          <span className="text-[0.7rem] text-grey-500">Guest Name</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {guestName}
          </p>{" "}
          {/* Reduced value size */}
        </div>
        <div className="border-l border-grey-200 pl-3">
          <span className="text-[0.7rem] text-grey-500">Host name</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {hostName}
          </p>{" "}
          {/* Reduced value size */}
        </div>
        <div>
          <span className="text-[0.7rem] text-grey-500">Host name</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {hostName}
          </p>{" "}
          {/* Reduced value size */}
        </div>
        <div className="border-l border-grey-200 pl-3">
          <span className="text-[0.7rem] text-grey-500">Vehicle Name</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {vehicleName}
          </p>{" "}
          {/* Reduced value size */}
        </div>
        <div>
          <span className="text-[0.7rem] text-grey-500">Start Date</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {" "}
            {/* Reduced value size */}
            {startDate &&
              new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(new Date(startDate))}
          </p>
        </div>
        <div className="border-l border-grey-200 pl-3">
          <span className="text-[0.7rem] text-grey-500">End Date</span>{" "}
          {/* Reduced label size */}
          <p className="text-grey-800 !font-semibold text-sm">
            {" "}
            {/* Reduced value size */}
            {endDate &&
              new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).format(new Date(endDate))}
          </p>
        </div>
      </div>
    </div>
  </div>
);
export default BookingVehicle;
