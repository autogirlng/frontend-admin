"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoveDiagonal
} from "lucide-react";
import ActionComponent from "./ActionComponent";
import { AddressModal } from "./modals/AddressModal";
import { TripBookingResponse, TripBookingItem } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { Spinner } from "../shared/spinner";
import { format } from "date-fns"
import FilterBy from "../shared/filter";
import { TripFilters } from "@/utils/data";


const BookingReuseTable: React.FC = () => {
  const http = useHttp()
  const [trips, setTrips] = useState<TripBookingItem[]>()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loadingTrips, setLoadingTrips] = useState<boolean>(false)
  const [filter, setFilter] = useState<Record<string, string[]>>()
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>()
  const [pageCount, setPageCount] = useState<{ page: number, totalCount: number }>({ page: 1, totalCount: 1 })
  const limit = useRef(10)
  const baseURL = `/admin/trips?page=${pageCount.page}&limit=${limit.current}`

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentSearchTerm = e.target.value;
    setSearchTerm(currentSearchTerm);
  };
  const handleFilterChange = (selectedFilters: Record<string, string[]>, dateRange?: { startDate: Date | null; endDate: Date | null }) => {
    setFilter(selectedFilters)
    dateRange && setDateRange(dateRange)

  }



  const fetchTrips = async () => {
    setLoadingTrips(true)
    try {
      const trips = await http.get<TripBookingResponse>(`${baseURL}&search=${searchTerm}`)

      if (trips) {
        setTrips(trips.data)
        setPageCount((prev) => ({ ...prev, totalCount: trips.totalCount }))
      }

    } catch (error) {
      console.log(error)
    }
    setLoadingTrips(false)
  }
  const applyFilters = async () => {
    setLoadingTrips(true)

    try {
      const periods = filter?.Period
      if (periods && periods.length > 0) {
        const trips = await http.get<TripBookingResponse>(`${baseURL}&period=${periods[periods.length - 1]}`)
        if (trips) {
          setTrips(trips.data)
        }
      }
      if (dateRange && dateRange.startDate !== null && dateRange.endDate !== null) {
        const parsedStartDate = new Date(dateRange.startDate);
        const parsedEndDate = new Date(dateRange.endDate);
        const formattedStartDate = format(parsedStartDate, 'yyyy-MM-dd');
        const formattedEndDate = format(parsedEndDate, "yyyy-MM-dd");
        const trips = await http.get<TripBookingResponse>(`${baseURL}?period=custom&date=${formattedStartDate}&endDate=${formattedEndDate}`)
        if (trips) {
          setTrips(trips.data)
        }
      }

    } catch (error) {
      console.log(error)
    }
    setLoadingTrips(false)

  }

  useEffect(() => {
    const shouldApplyFilter = filter || (dateRange?.startDate && dateRange?.endDate);

    if (shouldApplyFilter) {
      applyFilters();
    } else {
      fetchTrips();
    }
  }, [filter, dateRange])


  useEffect(() => {
    fetchTrips()
  }, [searchTerm, pageCount.page])

  // Function to render the booking status badge with appropriate color
  const renderBookingStatusBadge = (status: "PAID" | "UNPAID" | "PENDING" | "COMPLETED" | "REJECTED" | "CANCELLED") => {
    const statusStyles = {
      PAID: "bg-[#0AAF24] text-white",
      UNPAID: "bg-[#101928] text-white",
      PENDING: "bg-[#F3A218] text-white",
      COMPLETED: "bg-[#0673FF] text-white",
      REJECTED: "bg-[#667185] text-white",
      CANCELLED: "bg-[#F83B3B] text-white",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  const prevPage = () => {
    setPageCount((prev) => ({ ...prev, page: pageCount.page - 1 }))
  }
  const nextPage = () => {
    setPageCount((prev) => ({ ...prev, page: pageCount.page + 1 }))
  }
  // Function to render the trip status badge with appropriate color
  const renderTripStatusBadge = (status: "UNCONFIRMED" | "CONFIRMED" | "ONGOING" | "EXTRA_TIME" | "CANCELLED" | "COMPLETED") => {
    const statusStyles = {
      UNCONFIRMED: "bg-[#667185] text-white",
      CONFIRMED: "bg-[#0AAF24] text-white",
      ONGOING: "bg-[#B6FCBF] text-[#0F581D]",
      EXTRA_TIME: "bg-[#F3A218] text-white",
      CANCELLED: "bg-[#F83B3B] text-white",
      COMPLETED: "bg-[#0673FF] text-white",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  const openModal = (content: string) => {
    setIsOpen(true);
    setModalContent(content);
  }

  const closeModal = () => {
    setIsOpen(false);
    setModalContent("");
  }
  return (
    <div className="w-full bg-white">
      <div className="p-4">

        <h1 className="text-4xl font-bold mb-6">Trips</h1>

        <div className="flex justify-between mb-6 flex-wrap">
          <div className="relative w-full max-w-md">

            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search with Booking ID, or Guest name"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "14px" }}
              onChange={handleSearch}
            />
          </div>

          <FilterBy
            categories={TripFilters}
            dateEnabled={true}
            onChange={handleFilterChange}
          />
        </div>


        {
          loadingTrips ? <div className="flex justify-center"> <Spinner /> </div> : <div
            className="overflow-x-auto min-h-screen"
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          >
            <table className="min-w-full min-h-full">
              <thead>
                <tr
                  className="bg-[#F7F9FC] border-b border-[#D0D5DD]"
                  style={{ height: "60px" }}
                >
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Customer Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Service Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    City
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Booking Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Pickup Location
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Vehicle
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Booking Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Trip Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>

                {
                  trips?.map((trip, index) => {
                    return <tr key={`${trip.id}`} className={`border-b border-[#D0D5DD] hover:bg-gray-50
                     ${index === trips.length - 1 ? "border-b-0" : ""
                      }`}>
                      <td className="px-4 py-4 text-sm font-medium text-[#344054]"> {trip.booking.id}</td>
                      <td className="px-4 py-4 text-sm text-[#344054]">{trip.customerName}</td>
                      <td className="px-4 py-4 text-sm text-nowrap text-[#344054]">{format(trip.serviceDate, "do MMMM yyyy")}</td>
                      <td className="px-4 py-4 text-sm text-[#344054]">{trip.booking.areaOfUse}</td>
                      <td className="px-4 py-4 text-sm text-[#344054]">{trip.bookingType}</td>
                      <td className="px-4 py-4 text-sm text-[#344054] cursor-pointer">
                        <div
                          className="group relative inline-block max-w-[180px] truncate whitespace-nowrap overflow-hidden text-ellipsis"
                          onClick={() => openModal(trip.pickupLocation)}
                          title={trip.pickupLocation}
                        >
                          {trip.pickupLocation}
                          <span className="absolute -top-5 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-[#e4e7ec] p-1 rounded">
                            <MoveDiagonal className="h-4 w-4" color="#2584ff" />
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#344054]">{trip.vehicle}</td>
                      <td className="px-4 py-4  first-letter:uppercase lowercase">
                        {renderBookingStatusBadge(trip.booking.bookingStatus)}
                      </td>
                      <td className="px-4 py-4 first-letter:uppercase lowercase">
                        {renderTripStatusBadge(trip.tripStatus)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <ActionComponent actionOption={trip.tripStatus.toLowerCase()} trip={trip} />
                      </td>
                    </tr>
                  })
                }


              </tbody>
            </table>
          </div>}


        <AddressModal isOpen={isOpen} modalContent={modalContent} closeModal={closeModal} />

        <div className="flex justify-center mt-6 space-x-1">

          <button onClick={prevPage} disabled={pageCount.page == 1} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: Math.ceil(pageCount.totalCount / limit.current) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPageCount((prev) => ({ ...prev, page }))}
              className={`px-3 py-1 rounded-md ${page === pageCount.page
                ? "bg-black  text-white"
                : "border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}

          <button onClick={nextPage} disabled={pageCount.page == Math.ceil(pageCount.totalCount / limit.current)} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReuseTable;
