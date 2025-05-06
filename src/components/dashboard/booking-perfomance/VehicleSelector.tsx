import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import type SwiperCore from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface Vehicle {
  id: string;
  name: string;
  image: string;
}

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelect: (vehicleId: string) => void;
}

const VehicleSelector = ({
  vehicles,
  selectedVehicle,
  onSelect,
}: VehicleSelectorProps) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  // Set initial slide to center if no selection
  const getInitialSlide = () => {
    const selectedIndex = vehicles.findIndex((v) => v.id === selectedVehicle);
    return selectedIndex >= 0 ? selectedIndex : Math.floor(vehicles.length / 2);
  };

  // Keyboard navigation with loop support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-1">
      {/* Carousel container */}
      <div className="relative px-2">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Keyboard]}
          slidesPerView={4}
          spaceBetween={20}
          centeredSlides
          loop={true}
          keyboard={{ enabled: true }}
          navigation={{
            nextEl: ".vehicle-next",
            prevEl: ".vehicle-prev",
          }}
          initialSlide={getInitialSlide()}
          onSlideChange={(swiper) => {
            const realIndex = swiper.realIndex; // Get correct index in loop mode
            const activeId = vehicles[realIndex]?.id;
            if (activeId) onSelect(activeId);
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
        >
          {vehicles.map((vehicle) => (
            <SwiperSlide key={vehicle.id}>
              {({ isActive }) => (
                <div
                  onClick={() => onSelect(vehicle.id)}
                  className={`flex flex-col items-center p-3 cursor-pointer  rounded-lg transition-all ${
                    isActive
                      ? "border-2 border-blue-500 bg-blue-50 scale-100"
                      : " border-1 border-grey-500 bg-grey-200 opacity-60 scale-80"
                  }`}
                >
                  <div className="h-12 flex items-center justify-center mb-2">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-full object-contain"
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    {vehicle.name}
                  </span>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation arrows */}
        <button
          className="vehicle-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Previous"
        >
          <FaChevronLeft className="text-gray-200 text-lg" />
        </button>
        <button
          className="vehicle-next absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
          aria-label="Next"
        >
          <FaChevronRight className="text-gray-200 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default VehicleSelector;
