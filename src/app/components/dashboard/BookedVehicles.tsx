"use client";

import { useRef } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import CarCard from "./CarCard";

const MostBookedVehicles = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === "left"
          ? -scrollRef.current.offsetWidth
          : scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-base font-semibold text-gray-800">
          Most Booked Vehicles
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">View All</span>|
          <button
            onClick={() => scroll("left")}
            className="text-lg hover:text-blue-600 transition-colors"
          >
            <FaCircleChevronLeft className="text-black" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="text-lg hover:text-blue-600 transition-colors"
          >
            <FaCircleChevronRight className="text-black" />
          </button>
        </div>
      </div>

      {/* Scrollable Cards (2 per view) */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto px-2 py-2 gap-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-[calc(50%-0.5rem)] snap-start flex-shrink-0"
          >
            <CarCard
              location="Lagos"
              imageUrl={
                i % 2 === 0
                  ? "/images/auth-bg.jpeg"
                  : "/images/reset-password.png"
              }
              title="Toyota Corolla 2015"
              price="NGN 20,000/day"
              type="Sedan"
              totalImages={6}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostBookedVehicles;
