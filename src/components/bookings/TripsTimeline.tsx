"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LocationData {
  [key: string]: number;
}

interface AnalyticsItem {
  date: string;
  data: LocationData;
}

interface ApiResponse {
  totalTrips: number;
  analytics: AnalyticsItem[];
}

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

const fetchTripsAnalytics = async (
  period: string = "next_7_days"
): Promise<ApiResponse> => {
  const token = localStorage.getItem("user_token");
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`${API_BASE_URL}/admin/trips/analytics`);
  url.searchParams.append("period", period);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(
      errorData.message || `Failed to fetch data: ${response.statusText}`
    );
  }

  return response.json();
};

const formatDateWithOrdinal = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();

  let suffix = "th";
  if (day % 10 === 1 && day % 100 !== 11) suffix = "st";
  if (day % 10 === 2 && day % 100 !== 12) suffix = "nd";
  if (day % 10 === 3 && day % 100 !== 13) suffix = "rd";

  return `${day}${suffix} ${month} ${year}`;
};

const TripsTimeline: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: apiData,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["tripsAnalytics", "next_7_days"],
    queryFn: () => fetchTripsAnalytics("next_7_days"),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const tripsData = useMemo<DayTrips[]>(() => {
    if (!apiData?.analytics) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return apiData.analytics.map((day) => {
      const currentDate = new Date(`${day.date}T00:00:00`);
      const isToday = currentDate.getTime() === today.getTime();
      const isTomorrow = currentDate.getTime() === tomorrow.getTime();

      const locations: Location[] = Object.entries(day.data).map(
        ([name, count]) => ({
          name: name === "Port Harcourt" ? "Port H" : name,
          code: String(count),
        })
      );

      return {
        date: day.date,
        displayDate: formatDateWithOrdinal(currentDate),
        isToday,
        isTomorrow,
        locations,
      };
    });
  }, [apiData]);

  const scroll = (direction: "left" | "right"): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 640);
    handleScroll();
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    checkIfMobile();

    if (container) {
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", checkIfMobile);

      handleScroll();

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", checkIfMobile);
      };
    }
  }, [tripsData]);

  return (
    <div className="w-full bg-white border-gray-200">
      <div className="w-full">
        <div className="flex justify-between items-center px-2 sm:px-4 py-3 sm:py-4">
          <h2 className="text-base sm:text-lg font-medium text-[#344054]">
            Trips Timeline
          </h2>
          <Link
            href="/dashboard/bookings/trips"
            className="text-[#667185] hover:text-blue-800 text-xs sm:text-sm"
            style={{ paddingRight: 10 }}
          >
            View All
          </Link>
        </div>

        {isLoading && (
          <div className="text-center py-10 text-gray-500">
            Loading timeline...
          </div>
        )}
        {isError && (
          <div className="text-center py-10 text-red-600">
            Error: {error?.message || "Could not fetch trip data."}
          </div>
        )}
        {!isLoading && !isError && tripsData.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No trips found for this period.
          </div>
        )}

        {!isLoading && !isError && tripsData.length > 0 && (
          <div className="relative mb-4">
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black rounded-full shadow-md p-0.5 sm:p-1 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black rounded-full shadow-md p-0.5 sm:p-1 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-6 pt-2 no-scrollbar pl-2 pr-2 sm:pl-4 sm:pr-4"
            >
              {tripsData.map((day, index) => (
                <div
                  key={day.date}
                  className={`flex-shrink-0 mx-1 sm:mx-2 ${
                    index === 0 ? "ml-0" : ""
                  } rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 ${
                    day.isToday
                      ? "bg-[#0673FF] text-white hover:text-white hover:border-[#fff] hover:shadow-xl hover:brightness-110"
                      : "bg-white border border-gray-300 hover:shadow-lg"
                  }`}
                  style={{
                    minWidth: isMobile ? "230px" : "270px",
                    maxWidth: isMobile ? "85%" : "none",
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderRadius: 25,
                  }}
                >
                  <Link
                    href="/dashboard/bookings/trips"
                    className="hover:no-underline"
                  >
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

                    <div
                      className={`grid ${
                        isMobile ? "grid-cols-3" : "grid-cols-5"
                      } divide-x ${
                        day.isToday ? "divide-blue-400" : "divide-gray-300"
                      }`}
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
                                day.isToday
                                  ? "text-primary-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {location.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
