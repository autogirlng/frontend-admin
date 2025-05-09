"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define trip data structure
interface Location {
  code: string;
  name: string;
}

interface DayTrips {
  date: string;
  displayDate: string;
  isToday?: boolean;
  isTomorrow?: boolean;
  locations: Location[];
}

const TripsTimeline: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Sample trip data
  const tripsData: DayTrips[] = [
    {
      date: "2025-08-11",
      displayDate: "11th Aug 2025",
      isToday: true,
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-12",
      displayDate: "12th Aug 2025",
      isTomorrow: true,
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-13",
      displayDate: "13th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-14",
      displayDate: "14th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-15",
      displayDate: "15th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-16",
      displayDate: "16th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-17",
      displayDate: "17th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-18",
      displayDate: "18th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-19",
      displayDate: "19th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
    {
      date: "2025-08-20",
      displayDate: "20th Aug 2025",
      locations: [
        { code: "831", name: "Lagos" },
        { code: "831", name: "Abuja" },
        { code: "831", name: "Port H" },
        { code: "831", name: "Accra" },
        { code: "831", name: "Others" },
      ],
    },
  ];

  // Handle scroll buttons
  const scroll = (direction: "left" | "right"): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Update scroll button states
  const handleScroll = (): void => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 10);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Check if device is mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 640);
    handleScroll();
  };

  // Add scroll event listener and handle resize
  useEffect(() => {
    const container = scrollContainerRef.current;

    // Initial check for mobile
    checkIfMobile();

    if (container) {
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", checkIfMobile);

      // Check initial scroll state
      handleScroll();

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", checkIfMobile);
      };
    }
  }, []);

  return (
    <div className="w-full bg-white border-gray-200">
      <div className="w-full">
        <div className="flex justify-between items-center px-2 sm:px-4 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg font-medium text-[#344054]">
            Trips Timeline
          </h2>
          <a
            href="#"
            className="text-[#667185] hover:text-blue-800 text-xs sm:text-sm"
            style={{ paddingRight: 10 }}
          >
            View All
          </a>
        </div>

        <div className="relative mb-4">
          {/* Left scroll button - only shown when scrollable to left */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black rounded-full shadow-md p-0.5 sm:p-1 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </button>
          )}

          {/* Right scroll button - only shown when scrollable to right */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black rounded-full shadow-md p-0.5 sm:p-1 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 pt-2 no-scrollbar pl-2 pr-2 sm:pl-4 sm:pr-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {tripsData.map((day, index) => (
              <div
                key={day.date}
                className={`flex-shrink-0 mx-1 sm:mx-2 ${
                  index === 0 ? "ml-0" : ""
                } rounded-lg overflow-hidden ${
                  day.isToday
                    ? "bg-[#0673FF] text-white"
                    : "bg-white border border-gray-500"
                }`}
                style={{
                  minWidth: isMobile ? "230px" : "270px",
                  maxWidth: isMobile ? "85%" : "none",
                  paddingBottom: 10,
                  paddingTop: 10,
                  borderRadius: 25,
                }}
              >
                {/* Date header */}
                <div
                  className={`px-3 sm:px-4 py-2 ${
                    day.isToday ? "text-white" : ""
                  }`}
                >
                  <div className="flex items-center text-sm sm:text-base">
                    {day.isToday && (
                      <span className="mr-2 font-medium">Today</span>
                    )}
                    {day.isTomorrow && (
                      <span className="mr-2 font-medium">Tomorrow</span>
                    )}
                    <span
                      className={`${
                        day.isToday || day.isTomorrow ? "" : "font-medium"
                      }`}
                    >
                      {day.displayDate}
                    </span>
                  </div>
                </div>

                {/* Locations grid - Only vertical lines, no horizontal line */}
                <div
                  className={`grid ${
                    isMobile ? "grid-cols-3" : "grid-cols-5"
                  } divide-x`}
                >
                  {day.locations
                    .slice(0, isMobile ? 3 : 5)
                    .map((location, locIndex) => (
                      <div
                        key={`${day.date}-${locIndex}`}
                        className={`flex flex-col items-center justify-center py-2 sm:py-3 px-1`}
                      >
                        <span
                          className={`text-center font-medium text-sm sm:text-base ${
                            day.isToday ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {location.code}
                        </span>
                        <span
                          className={`text-xs text-center truncate w-full ${
                            day.isToday ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {location.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbars */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TripsTimeline;
