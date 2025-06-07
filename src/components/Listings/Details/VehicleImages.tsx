import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Props = { vehicleImages: string[] };

export default function ListingDetailsVehicleImages({ vehicleImages }: Props) {
  return (
    <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-3">
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className="vehicle-summary-swiper w-full z-[-1]"
      >
        {vehicleImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt=""
              width={793}
              height={472}
              className="w-full h-[218px] lg:h-[400px] xl:h-[472px] rounded-3xl object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-row lg:flex-col items-center gap-1 min-w-[75px] lg:w-[75px]">
        {vehicleImages.map(
          (image, index) =>
            index !== 0 && (
              <Image
                key={index}
                src={image}
                alt=""
                width={75}
                height={90}
                className="w-full h-[50px] lg:h-[77px] xl:h-[90px] rounded-lg object-cover"
              />
            )
        )}
      </div>
    </div>
  );
}
