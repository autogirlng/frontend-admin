"use client";

import React, { useRef } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import { ImageAssets } from "@/app/utils/ImageAssets";

interface Booking {
  guest: string;
  host: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  location: string;
  image: string;
  index: string;
}

const bookings: Booking[] = [
  {
    guest: "Chioma Nwosu",
    host: "Mamudu Jeffrey",
    vehicle: "Toyota Camry",
    startDate: "12 Aug | 6:30PM",
    endDate: "13 Aug | 6:30PM",
    location: "ACCRA",
    image: ImageAssets.mailbox,
    index: "1/6",
  },
  {
    guest: "Chioma Nwosu",
    host: "Mamudu Jeffrey",
    vehicle: "Toyota Camry",
    startDate: "12 Aug | 6:30PM",
    endDate: "13 Aug | 6:30PM",
    location: "ACCRA",
    image: ImageAssets.mailbox,
    index: "2/6",
  },
];

interface LocationTagProps {
  location: string;
}

const LocationTag: React.FC<LocationTagProps> = ({ location }) => {
  return (
    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs rounded-full px-3 py-1">
      {location}
    </div>
  );
};

interface ImageSectionProps {
  imageSrc: string;
  location: string;
  index: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  imageSrc,
  location,
  index,
}) => {
  return (
    <div className="relative w-1/2 h-full">
      <img
        src={imageSrc}
        alt="Vehicle"
        className="object-cover h-full w-full rounded-l-lg"
      />
      <LocationTag location={location} />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs rounded-full px-3 py-1">
        {index}
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  className?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div className={`py-1 ${className}`}>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-gray-900 text-sm font-medium">{value}</p>
    </div>
  );
};

const BookingCard: React.FC<Booking> = ({
  guest,
  host,
  vehicle,
  startDate,
  endDate,
  location,
  image,
  index,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full flex h-48">
      <ImageSection imageSrc={image} location={location} index={index} />

      <div className="w-1/2 p-4 flex flex-col justify-between">
        <div>
          <DetailRow label="Guest Name" value={guest} />
          <DetailRow label="Host name" value={host} />
          <DetailRow label="Vehicle Name" value={vehicle} />
        </div>

        <div>
          <div className="flex justify-between">
            <DetailRow label="Start Date" value={startDate} />
            <DetailRow
              label="End Date"
              value={endDate}
              className="text-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsCarousel: React.FC = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  return (
    <div
      className="w-full px-4 py-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        slidesPerView={1.2}
        modules={[Autoplay, Keyboard]}
        ref={swiperRef}
        spaceBetween={16}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2.5,
          },
        }}
        className="bookings-swiper"
      >
        {bookings.map((card, i) => (
          <SwiperSlide key={i} className="h-auto">
            <BookingCard {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookingsCarousel;
