"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import {
  Loader2,
  AlertCircle,
  Search,
  CheckCircle,
  Download,
  Plus,
  X,
  Calendar,
  Clock,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import Hooks
import { useDownloadInvoice } from "@/lib/hooks/booking-management/useBookingCreation";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useGetVehicleMakes } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleMakes";
import { useGetVehicleModels } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleModels";
import { useGetCompanyBankAccounts } from "@/lib/hooks/booking-management/useCompanyBankAccounts";
import {
  useVehicleSearch,
  useBookingCalculation,
  useCreateBooking,
} from "@/lib/hooks/booking-management/useBookingCreation";

// Import Components
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import Button from "@/components/generic/ui/Button";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import CustomBack from "@/components/generic/CustomBack";
import { formatPrice } from "@/lib/utils/price-format";

// Import Types
import {
  VehicleSearchResult,
  BookingSegmentPayload,
  CalculateBookingResponse,
  CreateBookingResponse,
  BookingChannel,
  CompanyBankAccount,
  VehicleSearchFilters,
} from "./types";

interface DateTimePickerProps {
  label: string;
  dateValue: string;
  timeValue: string;
  minDate?: string;
  onDateChange: (val: string) => void;
  onTimeChange: (val: string) => void;
  required?: boolean;
}

const ModernDateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  dateValue,
  timeValue,
  minDate,
  onDateChange,
  onTimeChange,
  required,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // --- Calendar State ---
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Initialize calendar month based on value
  useEffect(() => {
    if (dateValue) {
      setCurrentMonth(new Date(dateValue));
    }
  }, [dateValue]);

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Calendar Logic ---
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    onDateChange(`${year}-${month}-${dayStr}`);
    setShowCalendar(false);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(
      currentMonth.setMonth(currentMonth.getMonth() + offset)
    );
    setCurrentMonth(new Date(newDate));
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const minimum = new Date(minDate);
    // Reset times for accurate comparison
    checkDate.setHours(0, 0, 0, 0);
    minimum.setHours(0, 0, 0, 0);
    return checkDate < minimum;
  };

  const isSelectedDate = (day: number) => {
    if (!dateValue) return false;
    const selected = new Date(dateValue);
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  // --- Time Logic ---
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 4 }, (_, i) =>
    String(i * 15).padStart(2, "0")
  ); // 00, 15, 30, 45 steps

  const handleTimeClick = (type: "hour" | "minute", val: string) => {
    const [currentH, currentM] = (timeValue || "10:00").split(":");
    if (type === "hour") onTimeChange(`${val}:${currentM || "00"}`);
    else onTimeChange(`${currentH || "10"}:${val}`);
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full relative">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex flex-col sm:flex-row py-1.5 border border-gray-300 bg-white divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {/* --- Custom Date Input Trigger --- */}
        <div
          className="relative flex-grow p-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
          onClick={() => {
            setShowCalendar(!showCalendar);
            setShowTimePicker(false);
          }}
          ref={calendarRef}
        >
          <div className="flex items-center gap-3">
            <Calendar
              className={`h-4 w-4 ${
                showCalendar
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-blue-500"
              }`}
            />
            <span
              className={`text-sm ${
                dateValue ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {dateValue || "Select Date"}
            </span>
          </div>

          {/* POPUP: Custom Calendar */}
          {showCalendar && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeMonth(-1);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <span className="font-semibold text-gray-800 text-sm">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    changeMonth(1);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <span key={d} className="text-xs font-medium text-gray-400">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const disabled = isDateDisabled(day);
                  const selected = isSelectedDate(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(day);
                      }}
                      className={`
                        h-8 w-8 rounded-full text-sm flex items-center justify-center transition-colors
                        ${
                          selected
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                        ${
                          disabled
                            ? "opacity-30 cursor-not-allowed hover:bg-transparent"
                            : ""
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- Custom Time Input Trigger --- */}
        <div
          className="relative w-full sm:w-1/3 p-2.5 hover:bg-gray-50 cursor-pointer transition-colors group bg-gray-50 sm:bg-white"
          onClick={() => {
            setShowTimePicker(!showTimePicker);
            setShowCalendar(false);
          }}
          ref={timeRef}
        >
          <div className="flex items-center gap-3">
            <Clock
              className={`h-4 w-4 ${
                showTimePicker
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-blue-500"
              }`}
            />
            <span
              className={`text-sm ${
                timeValue ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {timeValue || "00:00"}
            </span>
          </div>

          {/* POPUP: Custom Time Picker */}
          {showTimePicker && (
            <div className="absolute top-full right-0 sm:left-auto sm:-right-2 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex overflow-hidden animate-in fade-in zoom-in-95 duration-100 h-48">
              {/* Hours */}
              <div className="flex-1 overflow-y-auto border-r border-gray-100 no-scrollbar">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                  Hrs
                </div>
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTimeClick("hour", h);
                    }}
                    className={`px-4 py-2 text-sm text-center cursor-pointer hover:bg-blue-50 ${
                      timeValue?.startsWith(h)
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {h}
                  </div>
                ))}
              </div>
              {/* Minutes */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                  Min
                </div>
                {minutes.map((m) => (
                  <div
                    key={m}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTimeClick("minute", m);
                      setShowTimePicker(false);
                    }}
                    className={`px-4 py-2 text-sm text-center cursor-pointer hover:bg-blue-50 ${
                      timeValue?.endsWith(m)
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Page State Types ---
type Step = "search" | "results" | "details" | "confirm" | "success";

const initialFilters: Omit<VehicleSearchFilters, "page"> = {
  radiusInKm: 10000,
  minSeats: 1,
  pickupLocationString: "",
  dropoffLocationString: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  hostName: "",
  vehicleName: "",
  vehicleIdentifier: "",
  city: "",
  maxPrice: undefined,
  vehicleModelId: "", // Added to initial state
};

const initialBookingDetails: Partial<BookingSegmentPayload> & {
  pickupCoords: { latitude: number; longitude: number } | null;
  dropoffCoords: { latitude: number; longitude: number } | null;
} = {
  startDate: "",
  startTime: "",
  pickupLocationString: "",
  dropoffLocationString: "",
  bookingTypeId: "",
  pickupCoords: null,
  dropoffCoords: null,
};

const channelOptions: Option[] = [
  { id: "WHATSAPP", name: "WhatsApp" },
  { id: "INSTAGRAM", name: "Instagram" },
  { id: "TELEGRAM", name: "Telegram" },
  { id: "ZOHO_WHATSAPP", name: "Zoho WhatsApp" },
  { id: "TWITTER", name: "Twitter" },
];

export default function CreateBookingPage() {
  // --- State ---
  const [step, setStep] = useState<Step>("search");
  const [filters, setFilters] =
    useState<Omit<VehicleSearchFilters, "page">>(initialFilters);
  const [searchPickupCoords, setSearchPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchDropoffCoords, setSearchDropoffCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchPage, setSearchPage] = useState(0);
  const [runSearch, setRunSearch] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleSearchResult | null>(null);
  const [segments, setSegments] = useState<(typeof initialBookingDetails)[]>([
    { ...initialBookingDetails },
  ]);
  const [calculationResult, setCalculationResult] =
    useState<CalculateBookingResponse | null>(null);
  const [guestDetails, setGuestDetails] = useState({
    guestFullName: "",
    guestEmail: "",
    primaryPhoneNumber: "",
    extraDetails: "",
    purposeOfRide: "",
    channel: "WEBSITE" as BookingChannel,
  });
  const [bookingResponse, setBookingResponse] =
    useState<CreateBookingResponse | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // --- Queries ---
  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();
  const { data: vehicleTypes, isLoading: isLoadingVehicleTypes } =
    useGetVehicleTypes();
  const { data: vehicleMakes, isLoading: isLoadingVehicleMakes } =
    useGetVehicleMakes();
  const { data: vehicleModels, isLoading: isLoadingVehicleModels } =
    useGetVehicleModels();
  const { data: bankAccounts, isLoading: isLoadingBankAccounts } =
    useGetCompanyBankAccounts();

  const searchFilters: VehicleSearchFilters = {
    ...filters,
    latitude: searchPickupCoords?.latitude,
    longitude: searchPickupCoords?.longitude,
    page: searchPage,
  };

  const {
    data: searchResultsData,
    isLoading: isSearching,
    isError: isSearchError,
    isPlaceholderData: isSearchPlaceholder,
  } = useVehicleSearch(searchFilters, runSearch);

  const calculationMutation = useBookingCalculation();
  const createBookingMutation = useCreateBooking();
  const downloadInvoiceMutation = useDownloadInvoice();

  // --- Memos ---
  const bookingTypeOptions = useMemo(
    () => [
      { id: "", name: "Any Booking Type" },
      ...(bookingTypes?.map((bt) => ({ id: bt.id, name: bt.name })) || []),
    ],
    [bookingTypes]
  );

  const vehicleTypeOptions = useMemo(
    () => [
      { id: "", name: "Any Vehicle Type" },
      ...(vehicleTypes?.map((vt) => ({ id: vt.id, name: vt.name })) || []),
    ],
    [vehicleTypes]
  );

  const vehicleMakeOptions = useMemo(
    () => [
      { id: "", name: "Any Make" },
      ...(vehicleMakes?.map((vm) => ({ id: vm.id, name: vm.name })) || []),
    ],
    [vehicleMakes]
  );

  const vehicleModelOptions = useMemo(
    () => [
      { id: "", name: "Any Model" },
      ...(vehicleModels?.map((vm) => ({ id: vm.id, name: vm.name })) || []),
    ],
    [vehicleModels]
  );

  const bankAccountOptions: Option[] = useMemo(() => {
    if (!bankAccounts) return [];
    return bankAccounts.map((acct: CompanyBankAccount) => ({
      id: acct.id,
      name: `${acct.bankName} - ${acct.accountNumber} (${acct.accountName})`,
    }));
  }, [bankAccounts]);

  // --- Effects ---
  useEffect(() => {
    if (bankAccounts && !selectedAccountId) {
      const defaultAccount = bankAccounts.find((acct) => acct.default);
      if (defaultAccount) setSelectedAccountId(defaultAccount.id);
    }
  }, [bankAccounts, selectedAccountId]);

  // --- Handlers ---
  const handleFilterChange = (
    field: keyof Omit<VehicleSearchFilters, "page">,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const executeSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchPickupCoords && (!filters.startDate || !filters.endDate)) {
      toast.error(
        "Dates are required for proximity search (Location selected)."
      );
      return;
    }
    setSearchPage(0);
    setRunSearch(true);
    setStep("results");
  };

  const handleSegmentChange = (index: number, field: string, value: any) => {
    setSegments((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSegmentLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: any
  ) => {
    setSegments((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        return type === "pickup"
          ? { ...s, pickupCoords: coords }
          : { ...s, dropoffCoords: coords };
      })
    );
  };

  const addSegment = () => {
    const last = segments[segments.length - 1];
    setSegments((prev) => [
      ...prev,
      {
        ...initialBookingDetails,
        pickupLocationString: last.dropoffLocationString,
        pickupCoords: last.dropoffCoords,
        startDate: last.startDate,
        startTime: last.startTime,
      },
    ]);
  };

  const removeSegment = (index: number) =>
    setSegments((prev) => prev.filter((_, i) => i !== index));

  const handleSelectVehicle = (vehicle: VehicleSearchResult) => {
    setSelectedVehicle(vehicle);
    setCalculationResult(null);
    setSegments([
      {
        ...initialBookingDetails,
        startDate: filters.startDate,
        startTime: filters.startTime || "10:00",
        pickupLocationString: filters.pickupLocationString,
        dropoffLocationString: filters.dropoffLocationString,
        pickupCoords: searchPickupCoords,
        dropoffCoords: searchDropoffCoords,
      },
    ]);
    setStep("details");
  };

  const handleCalculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const segmentPayloads = segments.map((s) => {
      const safeStartTime = s.startTime || "";
      return {
        bookingTypeId: s.bookingTypeId || "",
        startDate: s.startDate || "",
        startTime:
          safeStartTime.length === 5 ? `${safeStartTime}:00` : safeStartTime,
        pickupLatitude: s.pickupCoords?.latitude || 0,
        pickupLongitude: s.pickupCoords?.longitude || 0,
        dropoffLatitude: s.dropoffCoords?.latitude || 0,
        dropoffLongitude: s.dropoffCoords?.longitude || 0,
        pickupLocationString: s.pickupLocationString || "",
        dropoffLocationString: s.dropoffLocationString || "",
      };
    });

    calculationMutation.mutate(
      {
        vehicleId: selectedVehicle.id,
        segments: segmentPayloads as BookingSegmentPayload[],
      },
      {
        onSuccess: (data) => {
          setCalculationResult(data);
          setStep("confirm");
        },
      }
    );
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculationResult) return;
    createBookingMutation.mutate(
      {
        calculationId: calculationResult.calculationId,
        primaryPhoneNumber: guestDetails.primaryPhoneNumber,
        guestFullName: guestDetails.guestFullName,
        guestEmail: guestDetails.guestEmail,
        extraDetails: guestDetails.extraDetails,
        purposeOfRide: guestDetails.purposeOfRide,
        channel: guestDetails.channel,
        paymentMethod: "OFFLINE",
      },
      {
        onSuccess: (data) => {
          setBookingResponse(data);
          setStep("success");
        },
      }
    );
  };

  const handleDownloadInvoice = () => {
    if (!bookingResponse) return;
    downloadInvoiceMutation.mutate({
      bookingId: bookingResponse.bookingId,
      companyBankAccountId: selectedAccountId || undefined,
    });
  };

  const resetAndGoToSearch = () => {
    setStep("search");
    setFilters(initialFilters);
    setSearchPickupCoords(null);
    setSearchDropoffCoords(null);
    setSearchPage(0);
    setRunSearch(false);
    setSelectedVehicle(null);
    setSegments([initialBookingDetails]);
    setCalculationResult(null);
    setBookingResponse(null);
  };

  // --- Render Blocks ---

  const renderSearchForm = () => (
    <form onSubmit={executeSearch} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Find a Vehicle
      </h2>

      {/* 1. Proximity / Location Trigger */}
      <div className="py-4 space-y-4">
        <div className="flex items-center gap-2 text-blue-800 mb-1">
          <MapPin className="w-4 h-4" />
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            Proximity Search
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <AddressInput
            label="Pickup Location (Triggers Proximity Search)"
            id="pickup-location"
            value={filters.pickupLocationString || ""}
            onChange={(value) =>
              handleFilterChange("pickupLocationString", value)
            }
            onLocationSelect={setSearchPickupCoords}
            placeholder="Enter pickup address"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernDateTimePicker
            label="Start Date & Time"
            dateValue={filters.startDate || ""}
            timeValue={filters.startTime || ""}
            onDateChange={(val) => handleFilterChange("startDate", val)}
            onTimeChange={(val) => handleFilterChange("startTime", val)}
          />
          <ModernDateTimePicker
            label="End Date & Time"
            dateValue={filters.endDate || ""}
            timeValue={filters.endTime || ""}
            minDate={filters.startDate}
            onDateChange={(val) => handleFilterChange("endDate", val)}
            onTimeChange={(val) => handleFilterChange("endTime", val)}
          />
        </div>
      </div>

      {/* 2. Specific Vehicle & Host Search */}
      <div className="space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <h3 className="font-semibold text-sm uppercase tracking-wide">
              Specific Filters
            </h3>
          </div>
          <span className="text-xs text-blue-600 hover:underline">
            {showAdvancedFilters ? "Hide" : "Show"}
          </span>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
            <TextInput
              label="Host Name"
              id="hostName"
              value={filters.hostName || ""}
              onChange={(e) => handleFilterChange("hostName", e.target.value)}
              placeholder="Search by Host"
            />
            <TextInput
              label="Vehicle Name"
              id="vehicleName"
              value={filters.vehicleName || ""}
              onChange={(e) =>
                handleFilterChange("vehicleName", e.target.value)
              }
              placeholder="e.g. Camry"
            />
            <TextInput
              label="Vehicle ID"
              id="vehicleIdentifier"
              value={filters.vehicleIdentifier || ""}
              onChange={(e) =>
                handleFilterChange("vehicleIdentifier", e.target.value)
              }
              placeholder="e.g. AG/TOY..."
            />
            <TextInput
              label="City"
              id="city"
              value={filters.city || ""}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              placeholder="e.g. Lagos"
            />
            <TextInput
              label="Max Price"
              id="maxPrice"
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange("maxPrice", Number(e.target.value))
              }
              placeholder="Max Price"
            />
            <TextInput
              label="Min. Seats"
              id="min-seats"
              type="number"
              min="1"
              value={filters.minSeats || 1}
              onChange={(e) =>
                handleFilterChange("minSeats", Number(e.target.value))
              }
            />
            <Select
              label="Vehicle Type"
              options={vehicleTypeOptions}
              selected={vehicleTypeOptions.find(
                (o) => o.id === filters.vehicleTypeId
              )}
              onChange={(opt) => handleFilterChange("vehicleTypeId", opt.id)}
              placeholder="Any Type"
            />
            <Select
              label="Make"
              options={vehicleMakeOptions}
              selected={vehicleMakeOptions.find(
                (o) => o.id === filters.vehicleMakeId
              )}
              onChange={(opt) => handleFilterChange("vehicleMakeId", opt.id)}
              placeholder="Any Make"
            />
            {/* ✅ ADDED MODEL FILTER */}
            <Select
              label="Model"
              options={vehicleModelOptions}
              selected={vehicleModelOptions.find(
                (o) => o.id === filters.vehicleModelId
              )}
              onChange={(opt) => handleFilterChange("vehicleModelId", opt.id)}
              placeholder="Any Model"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSearching && runSearch}
          className="w-full md:w-auto px-8 shadow-md"
        >
          <Search className="h-5 w-5 mr-2" /> Search Vehicles
        </Button>
      </div>
    </form>
  );

  const renderSearchResults = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Results</h2>
        <Button
          variant="secondary"
          onClick={() => {
            setRunSearch(false);
            setStep("search");
          }}
          className="w-auto px-4"
        >
          Adjust Filters
        </Button>
      </div>

      {isSearching && !searchResultsData && (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}

      {!isSearching &&
        !isSearchError &&
        searchResultsData?.content.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="flex justify-center"></div>
            <p className="text-gray-500 text-lg">
              No vehicles found matching your criteria.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setRunSearch(false);
                setStep("search");
              }}
            >
              Try different filters
            </Button>
          </div>
        )}

      <div className="grid grid-cols-1 gap-6">
        {searchResultsData?.content.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white border transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-64 h-48 md:h-auto relative bg-gray-200">
              <img
                src={
                  vehicle.photos.find((p) => p.isPrimary)?.cloudinaryUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    vehicle.name
                  )}&background=random&size=96`
                }
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {vehicle.vehicleTypeName}
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {vehicle.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono text-xs">
                        {vehicle.vehicleIdentifier}
                      </span>
                      <span>•</span>
                      <span>{vehicle.numberOfSeats} Seats</span>
                      <span>•</span>
                      <span>{vehicle.city}</span>
                    </div>
                  </div>
                  {/* Host Info Display */}
                  {(vehicle.hostName || vehicle.hostPhoneNumber) && (
                    <div className="hidden md:flex flex-col items-end text-right">
                      <div className="flex items-center text-sm font-medium text-indigo-900 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                        {vehicle.hostName || "Host"}
                      </div>
                      {vehicle.hostPhoneNumber && (
                        <span className="text-xs text-indigo-600 mt-0.5 flex items-center">
                          {vehicle.hostPhoneNumber}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Host Info */}
                {(vehicle.hostName || vehicle.hostPhoneNumber) && (
                  <div className="flex md:hidden items-center gap-3 mt-3 text-sm text-indigo-900 bg-indigo-50 p-2 rounded border border-indigo-100">
                    <span className="font-medium">{vehicle.hostName}</span>
                    {vehicle.hostPhoneNumber && (
                      <span className="text-indigo-600 text-xs ml-auto">
                        {vehicle.hostPhoneNumber}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-end justify-between border-t pt-4 flex-wrap">
                <div className="my-1">
                  <p className="text-sm text-gray-500">Starting from</p>
                  {vehicle.allPricingOptions.length > 0 ? (
                    <p className="text-2xl font-bold text-green-700">
                      {formatPrice(
                        Math.min(
                          ...vehicle.allPricingOptions.map((p) => p.price)
                        )
                      )}
                    </p>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      Price unavailable
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="px-6 w-[200px] my-1"
                >
                  Select Vehicle
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PaginationControls
          currentPage={searchPage}
          totalPages={searchResultsData?.totalPages || 0}
          onPageChange={setSearchPage}
          isLoading={isSearchPlaceholder}
        />
      </div>
    </div>
  );

  const renderBookingDetailsForm = () => (
    <form onSubmit={handleCalculatePrice} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">
        Booking Details: {selectedVehicle?.name}
      </h2>
      {segments.map((segment, index) => (
        <div
          key={index}
          className="py-4 space-y-4 relative border-b last:border-0"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-[#0096FF]">
              Booking #{index + 1}
            </h3>
            {segments.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeSegment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AddressInput
              label="Pickup"
              id={`pickup-${index}`}
              value={segment.pickupLocationString || ""}
              onChange={(v) =>
                handleSegmentChange(index, "pickupLocationString", v)
              }
              onLocationSelect={(c) =>
                handleSegmentLocationSelect(index, "pickup", c)
              }
              required
            />
            <AddressInput
              label="Dropoff"
              id={`dropoff-${index}`}
              value={segment.dropoffLocationString || ""}
              onChange={(v) =>
                handleSegmentChange(index, "dropoffLocationString", v)
              }
              onLocationSelect={(c) =>
                handleSegmentLocationSelect(index, "dropoff", c)
              }
              required
            />
          </div>
          <ModernDateTimePicker
            label="Date & Time"
            dateValue={segment.startDate || ""}
            timeValue={segment.startTime || ""}
            onDateChange={(val) => handleSegmentChange(index, "startDate", val)}
            onTimeChange={(val) => handleSegmentChange(index, "startTime", val)}
            required
          />
          {selectedVehicle?.allPricingOptions.length ? (
            <Select
              label="Booking Type"
              options={selectedVehicle.allPricingOptions.map((p) => ({
                id: p.bookingTypeId,
                name: `${p.bookingTypeName} (${formatPrice(p.price)})`,
              }))}
              selected={selectedVehicle.allPricingOptions
                .map((p) => ({
                  id: p.bookingTypeId,
                  name: `${p.bookingTypeName} (${formatPrice(p.price)})`,
                }))
                .find((o) => o.id === segment.bookingTypeId)}
              onChange={(opt) =>
                handleSegmentChange(index, "bookingTypeId", opt.id)
              }
            />
          ) : (
            <p className="text-red-500 text-sm">No pricing options</p>
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={addSegment}
          className="w-[200px]"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Booking
        </Button>
      </div>
      <div className="flex flex-wrap justify-between pt-4 border-t">
        <Button
          variant="secondary"
          onClick={() => setStep("results")}
          className="my-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={calculationMutation.isPending}
          className="w-[200px] my-1"
        >
          Calculate Price
        </Button>
      </div>
    </form>
  );

  const renderConfirmationForm = () => (
    <form onSubmit={handleCreateBooking} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>

      {calculationResult && (
        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Payment Summary</h3>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded border">
              REF: {calculationResult.calculationId.slice(0, 8)}...
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* Base Price */}
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>Base Booking Price</span>
              <span className="font-medium text-gray-900 text-base">
                {formatPrice(calculationResult.basePrice)}
              </span>
            </div>

            {/* Platform Fee */}
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>Platform Fee</span>
              <span className="font-medium text-gray-900 text-base">
                +{formatPrice(calculationResult.platformFeeAmount)}
              </span>
            </div>

            {/* Geofence Surcharge (Conditionally Rendered) */}
            {calculationResult.geofenceSurcharge > 0 && (
              <div className="bg-orange-50 p-3 border border-orange-100">
                <div className="flex justify-between items-start text-orange-800 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location Surcharge
                    </span>
                    {calculationResult.appliedGeofenceNames.length > 0 && (
                      <span className="text-xs text-orange-600 mt-1 pl-4">
                        Applied to:{" "}
                        {calculationResult.appliedGeofenceNames.join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">
                    +{formatPrice(calculationResult.geofenceSurcharge)}
                  </span>
                </div>
              </div>
            )}

            {/* Discount (Conditionally Rendered) */}
            {calculationResult.discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">
                <span className="font-medium">Discount Applied</span>
                <span className="font-bold">
                  -{formatPrice(calculationResult.discountAmount)}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">
                  Total Amount
                </span>
                <span className="font-bold text-2xl text-[#0096FF]">
                  {formatPrice(calculationResult.finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer with ID */}
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-right">
            <p className="text-[10px] text-gray-400 font-mono">
              Calculation ID: {calculationResult.calculationId}
            </p>
          </div>
        </div>
      )}

      {/* Guest Form Section */}
      <div className="space-y-4 pt-4">
        <h3 className="font-medium text-gray-900">Guest Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput
            label="Guest Full Name"
            id="gName"
            value={guestDetails.guestFullName}
            onChange={(e) =>
              setGuestDetails({
                ...guestDetails,
                guestFullName: e.target.value,
              })
            }
            required
          />
          <TextInput
            label="Guest Email"
            id="gEmail"
            type="email"
            value={guestDetails.guestEmail}
            onChange={(e) =>
              setGuestDetails({ ...guestDetails, guestEmail: e.target.value })
            }
            required
          />
        </div>
        <TextInput
          label="Primary Phone Number"
          id="gPhone"
          value={guestDetails.primaryPhoneNumber}
          onChange={(e) =>
            setGuestDetails({
              ...guestDetails,
              primaryPhoneNumber: e.target.value,
            })
          }
          required
        />
        <Select
          label="Booking Channel"
          options={channelOptions}
          selected={channelOptions.find((c) => c.id === guestDetails.channel)}
          onChange={(o) =>
            setGuestDetails({
              ...guestDetails,
              channel: o.id as BookingChannel,
            })
          }
        />

        <TextAreaInput
          label="Purpose of ride (Optional)"
          id="purposeOfRide"
          value={guestDetails.purposeOfRide}
          onChange={(e) =>
            setGuestDetails({ ...guestDetails, purposeOfRide: e.target.value })
          }
          rows={2}
        />

        <TextAreaInput
          label="Extra Details (Optional)"
          id="extraDetails"
          value={guestDetails.extraDetails}
          onChange={(e) =>
            setGuestDetails({ ...guestDetails, extraDetails: e.target.value })
          }
          rows={2}
        />
      </div>

      <div className="flex flex-wrap justify-between pt-6 border-t">
        <Button
          variant="secondary"
          onClick={() => setStep("details")}
          className="w-[200px] my-1"
        >
          Back to Details
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createBookingMutation.isPending}
          className="w-[200px] my-1 px-8"
        >
          Create Booking
        </Button>
      </div>
    </form>
  );

  const renderSuccess = () => (
    <div className="text-center p-8 space-y-6">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold">Success!</h2>
      <p>Booking ID: {bookingResponse?.bookingId}</p>
      <div className="max-w-xs mx-auto">
        <Select
          label="Bank Account for Invoice"
          options={bankAccountOptions}
          selected={bankAccountOptions.find((b) => b.id === selectedAccountId)}
          onChange={(o) => setSelectedAccountId(o.id)}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={handleDownloadInvoice}
          isLoading={downloadInvoiceMutation.isPending}
          disabled={!selectedAccountId}
          className="w-[200px] my-1"
        >
          <Download className="w-4 h-4 mr-2" /> Invoice
        </Button>
        <Button
          variant="secondary"
          onClick={resetAndGoToSearch}
          className="w-[200px] my-1"
        >
          New Booking
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-6 max-w-8xl">
        <div className="bg-white py-6">
          {step === "search" && renderSearchForm()}
          {step === "results" && renderSearchResults()}
          {step === "details" && renderBookingDetailsForm()}
          {step === "confirm" && renderConfirmationForm()}
          {step === "success" && renderSuccess()}
        </div>
      </main>
    </>
  );
}
