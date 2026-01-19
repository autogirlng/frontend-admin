"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Loader2,
  Search,
  CheckCircle,
  Download,
  Plus,
  X,
  MapPin,
  Filter,
  Trash2,
} from "lucide-react";

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

import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import Button from "@/components/generic/ui/Button";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import CustomBack from "@/components/generic/CustomBack";
import { formatPrice } from "@/lib/utils/price-format";

import {
  VehicleSearchResult,
  BookingSegmentPayload,
  CalculateBookingResponse,
  CreateBookingResponse,
  BookingChannel,
  CompanyBankAccount,
  VehicleSearchFilters,
  CreateBookingPayload,
  AreaOfUseItem,
} from "./types";
import { ModernDateTimePicker } from "@/components/generic/ui/ModernDateTimePicker";

type Step = "search" | "results" | "details" | "confirm" | "success";

interface ExtendedBookingSegment extends Partial<BookingSegmentPayload> {
  pickupCoords: { latitude: number; longitude: number } | null;
  dropoffCoords: { latitude: number; longitude: number } | null;

  uiAreaOfUse: {
    id: number;
    name: string;
    coords: { latitude: number; longitude: number } | null;
  }[];
}

const initialFilters: Omit<VehicleSearchFilters, "page"> = {
  radiusInKm: 100,
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
  vehicleModelId: "",
};

const initialBookingDetails: ExtendedBookingSegment = {
  startDate: "",
  startTime: "",
  pickupLocationString: "",
  dropoffLocationString: "",
  bookingTypeId: "",
  pickupCoords: null,
  dropoffCoords: null,
  uiAreaOfUse: [],
};

const channelOptions: Option[] = [
  { id: "WHATSAPP", name: "WhatsApp" },
  { id: "INSTAGRAM", name: "Instagram" },
  { id: "TELEGRAM", name: "Telegram" },
  { id: "ZOHO_WHATSAPP", name: "Zoho WhatsApp" },
  { id: "TWITTER", name: "Twitter" },
];

export default function CreateBookingPage() {
  const topRef = useRef<HTMLDivElement>(null);
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
  const [segments, setSegments] = useState<ExtendedBookingSegment[]>([
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
    channel: "WHATSAPP" as BookingChannel,
    discountAmount: "",
  });

  const [bookingResponse, setBookingResponse] =
    useState<CreateBookingResponse | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchPage]);

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
    [bookingTypes],
  );

  const vehicleTypeOptions = useMemo(
    () => [
      { id: "", name: "Any Vehicle Type" },
      ...(vehicleTypes?.map((vt) => ({ id: vt.id, name: vt.name })) || []),
    ],
    [vehicleTypes],
  );

  const vehicleMakeOptions = useMemo(
    () => [
      { id: "", name: "Any Make" },
      ...(vehicleMakes?.map((vm) => ({ id: vm.id, name: vm.name })) || []),
    ],
    [vehicleMakes],
  );

  const vehicleModelOptions = useMemo(
    () => [
      { id: "", name: "Any Model" },
      ...(vehicleModels?.map((vm) => ({ id: vm.id, name: vm.name })) || []),
    ],
    [vehicleModels],
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
    value: any,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const executeSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchPickupCoords && (!filters.startDate || !filters.endDate)) {
      toast.error(
        "Dates are required for proximity search (Location selected).",
      );
      return;
    }
    setSearchPage(0);
    setRunSearch(true);
    setStep("results");
  };

  const handleSegmentChange = (
    index: number,
    field: keyof ExtendedBookingSegment,
    value: any,
  ) => {
    setSegments((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleSegmentLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: any,
  ) => {
    setSegments((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        return type === "pickup"
          ? { ...s, pickupCoords: coords }
          : { ...s, dropoffCoords: coords };
      }),
    );
  };

  // --- Area of Use Handlers ---
  const addAreaOfUse = (segmentIndex: number) => {
    setSegments((prev) =>
      prev.map((s, i) => {
        if (i !== segmentIndex) return s;
        return {
          ...s,
          uiAreaOfUse: [
            ...s.uiAreaOfUse,
            { id: Date.now(), name: "", coords: null },
          ],
        };
      }),
    );
  };

  const removeAreaOfUse = (segmentIndex: number, areaId: number) => {
    setSegments((prev) =>
      prev.map((s, i) => {
        if (i !== segmentIndex) return s;
        return {
          ...s,
          uiAreaOfUse: s.uiAreaOfUse.filter((a) => a.id !== areaId),
        };
      }),
    );
  };

  const updateAreaOfUse = (
    segmentIndex: number,
    areaId: number,
    field: "name" | "coords",
    value: any,
  ) => {
    setSegments((prev) =>
      prev.map((s, i) => {
        if (i !== segmentIndex) return s;
        return {
          ...s,
          uiAreaOfUse: s.uiAreaOfUse.map((a) =>
            a.id === areaId ? { ...a, [field]: value } : a,
          ),
        };
      }),
    );
  };

  const addSegment = () => {
    const last = segments[segments.length - 1];
    let nextStartDate = "";
    if (last.startDate) {
      const dateObj = new Date(last.startDate);
      if (!isNaN(dateObj.getTime())) {
        dateObj.setDate(dateObj.getDate() + 1);
        nextStartDate = dateObj.toISOString().split("T")[0];
      }
    }

    setSegments((prev) => [
      ...prev,
      {
        ...initialBookingDetails,
        pickupLocationString: last.pickupLocationString,
        dropoffLocationString: last.dropoffLocationString,
        pickupCoords: last.pickupCoords,
        dropoffCoords: last.dropoffCoords,
        startDate: nextStartDate,
        startTime: last.startTime,
        bookingTypeId: last.bookingTypeId,
        uiAreaOfUse: last.uiAreaOfUse.map((area, index) => ({
          ...area,
          id: Date.now() + index,
        })),
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

    const segmentPayloads: BookingSegmentPayload[] = segments.map((s) => {
      const safeStartTime = s.startTime || "";

      const areaOfUsePayload: AreaOfUseItem[] = s.uiAreaOfUse
        .filter((a) => a.name && a.coords)
        .map((a) => ({
          areaOfUseName: a.name,
          areaOfUseLatitude: a.coords!.latitude,
          areaOfUseLongitude: a.coords!.longitude,
        }));

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
        areaOfUse: areaOfUsePayload.length > 0 ? areaOfUsePayload : undefined,
      };
    });

    calculationMutation.mutate(
      {
        vehicleId: selectedVehicle.id,
        segments: segmentPayloads,
      },
      {
        onSuccess: (data) => {
          setCalculationResult(data);
          setStep("confirm");
        },
      },
    );
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculationResult) return;

    const payload: CreateBookingPayload = {
      calculationId: calculationResult.calculationId,
      primaryPhoneNumber: guestDetails.primaryPhoneNumber,
      guestFullName: guestDetails.guestFullName,
      guestEmail: guestDetails.guestEmail,
      extraDetails: guestDetails.extraDetails,
      purposeOfRide: guestDetails.purposeOfRide,
      channel: guestDetails.channel,
      paymentMethod: "OFFLINE",
      discountAmount: guestDetails.discountAmount
        ? Number(guestDetails.discountAmount)
        : undefined,
      isAdmin: true,
    };

    createBookingMutation.mutate(payload, {
      onSuccess: (data) => {
        setBookingResponse(data);
        setStep("success");
      },
    });
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
    setGuestDetails({
      guestFullName: "",
      guestEmail: "",
      primaryPhoneNumber: "",
      extraDetails: "",
      purposeOfRide: "",
      channel: "WHATSAPP" as BookingChannel,
      discountAmount: "",
    });
  };

  // --- Render Blocks ---

  const renderSearchForm = () => (
    <form onSubmit={executeSearch} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Find a Vehicle
      </h2>
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
                (o) => o.id === filters.vehicleTypeId,
              )}
              onChange={(opt) => handleFilterChange("vehicleTypeId", opt.id)}
              placeholder="Any Type"
            />
            <Select
              label="Make"
              options={vehicleMakeOptions}
              selected={vehicleMakeOptions.find(
                (o) => o.id === filters.vehicleMakeId,
              )}
              onChange={(opt) => handleFilterChange("vehicleMakeId", opt.id)}
              placeholder="Any Make"
            />
            <Select
              label="Model"
              options={vehicleModelOptions}
              selected={vehicleModelOptions.find(
                (o) => o.id === filters.vehicleModelId,
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
      <div ref={topRef} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Results
          {/* Optional: Show page number */}
          {searchResultsData && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Page {searchPage + 1})
            </span>
          )}
        </h2>
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

      {/* Initial Loading State (First Search) */}
      {isSearching && !searchResultsData && (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      )}

      {/* No Results State */}
      {!isSearching &&
        !isSearchError &&
        searchResultsData?.content.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No vehicles found matching your criteria.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setRunSearch(false);
                setStep("search");
              }}
              className="w-[350px] mt-4"
            >
              Try different filters
            </Button>
          </div>
        )}

      <div className="relative min-h-[400px]">
        {isSearchPlaceholder && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex justify-center items-start pt-32 transition-all duration-300">
            <div className="bg-white p-3 rounded-full shadow-xl border border-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-1 gap-6 transition-opacity duration-300 ${
            isSearchPlaceholder
              ? "opacity-40 pointer-events-none grayscale"
              : "opacity-100"
          }`}
        >
          {searchResultsData?.content.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full h-64 md:w-72 md:h-auto relative bg-gray-200 shrink-0">
                <img
                  src={
                    vehicle.photos.find((p) => p.isPrimary)?.cloudinaryUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      vehicle.name,
                    )}&background=random&size=96`
                  }
                  alt={vehicle.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {vehicle.vehicleTypeName}
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-start">
                    <div className="my-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                        {vehicle.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-mono text-xs border border-gray-200">
                          {vehicle.vehicleIdentifier}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{vehicle.numberOfSeats} Seats</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{vehicle.city}</span>
                      </div>
                    </div>
                    {(vehicle.hostName || vehicle.hostPhoneNumber) && (
                      <div className="flex-col items-end text-right my-2">
                        <div className="flex items-center text-sm font-medium text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                          {vehicle.hostName || "Host"}
                        </div>
                        {vehicle.hostPhoneNumber && (
                          <span className="text-xs text-indigo-600 mt-1">
                            {vehicle.hostPhoneNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4 flex-wrap gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                      Starting from
                    </p>
                    {vehicle.allPricingOptions.length > 0 ? (
                      <p className="text-2xl font-bold text-green-700">
                        {formatPrice(
                          Math.min(
                            ...vehicle.allPricingOptions.map((p) => p.price),
                          ),
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
                    className="w-full sm:w-auto px-8"
                  >
                    Select Vehicle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pb-8">
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

          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" /> Areas of Use
                (Optional)
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addAreaOfUse(index)}
                className="h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Area
              </Button>
            </div>

            <div className="space-y-2">
              {segment.uiAreaOfUse.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No specific areas of use added.
                </p>
              )}
              {segment.uiAreaOfUse.map((area) => (
                <div key={area.id} className="flex gap-2 items-start">
                  <div className="flex-grow">
                    <AddressInput
                      label="Area of Use"
                      id={`area-${area.id}`}
                      value={area.name}
                      onChange={(val) =>
                        updateAreaOfUse(index, area.id, "name", val)
                      }
                      onLocationSelect={(coords) =>
                        updateAreaOfUse(index, area.id, "coords", coords)
                      }
                      placeholder="Enter location (e.g. Shoprite Sangotedo)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAreaOfUse(index, area.id)}
                    className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
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

            {/* Geofence Surcharge */}
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

            {/* Discount */}
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

        <div className="grid md:grid-cols-2 gap-4">
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
          <TextInput
            label="Discount Amount (Optional)"
            id="discountAmount"
            type="number"
            value={guestDetails.discountAmount}
            onChange={(e) =>
              setGuestDetails({
                ...guestDetails,
                discountAmount: e.target.value,
              })
            }
            placeholder="e.g. 5000"
          />
        </div>

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
