"use client";

import React, { useState, useMemo } from "react";
import { useDownloadInvoice } from "@/lib/hooks/booking-management/useBookings";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useGetVehicleMakes } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleMakes";
import { useGetVehicleModels } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleModels";
import {
  VehicleSearchResult,
  BookingSegmentPayload,
  CalculateBookingResponse,
  CreateBookingPayload,
  CreateBookingResponse,
  BookingChannel,
  CalculateBookingPayload,
} from "./types";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import AddressInput from "@/components/generic/ui/AddressInput";
import Button from "@/components/generic/ui/Button";
import TextAreaInput from "@/components/generic/ui/TextAreaInput";
import {
  Loader2,
  AlertCircle,
  Search,
  CheckCircle,
  Download,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import {
  useVehicleSearch,
  useBookingCalculation,
  useCreateBooking,
  VehicleSearchFilters,
} from "@/lib/hooks/booking-management/useBookingCreation";
import { formatPrice } from "@/lib/utils/price-format";

type Step = "search" | "results" | "details" | "confirm" | "success";

// Initial state for filters
const initialFilters: Omit<VehicleSearchFilters, "page"> = {
  radiusInKm: 10000,
  minSeats: 1,
  pickupLocationString: "",
  dropoffLocationString: "",
  startDate: "",
  endDate: "",
  // other optional filters default to undefined
};

// Initial state for booking details
const initialBookingDetails: Partial<BookingSegmentPayload> = {
  startDate: "",
  startTime: "",
  pickupLocationString: "",
  dropoffLocationString: "",
  bookingTypeId: "", // Ensure this is initialized
};

const channelOptions: Option[] = [
  { id: "WEBSITE", name: "Website" },
  { id: "WHATSAPP", name: "WhatsApp" },
  { id: "INSTAGRAM", name: "Instagram" },
  { id: "TELEGRAM", name: "Telegram" },
  { id: "ZOHO_WHATSAPP", name: "Zoho WhatsApp" },
  { id: "TWITTER", name: "Twitter" },
];

export default function CreateBookingPage() {
  const [step, setStep] = useState<Step>("search");
  const [filters, setFilters] =
    useState<Omit<VehicleSearchFilters, "page">>(initialFilters);
  const [pickupCoords, setPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [searchPage, setSearchPage] = useState(0);
  const [runSearch, setRunSearch] = useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleSearchResult | null>(null);
  const [bookingDetails, setBookingDetails] = useState<
    Partial<BookingSegmentPayload>
  >(initialBookingDetails);
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

  // --- API Hooks ---
  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();
  const { data: vehicleTypes, isLoading: isLoadingVehicleTypes } =
    useGetVehicleTypes();
  const { data: vehicleMakes, isLoading: isLoadingVehicleMakes } =
    useGetVehicleMakes();
  const { data: vehicleModels, isLoading: isLoadingVehicleModels } =
    useGetVehicleModels();

  const searchFilters: VehicleSearchFilters = {
    ...filters,
    latitude: pickupCoords?.latitude,
    longitude: pickupCoords?.longitude,
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

  // --- Memos for Select Options ---
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

  // --- Event Handlers ---
  const handleFilterChange = (
    field: keyof Omit<VehicleSearchFilters, "page">,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingDetailChange = (
    field: keyof typeof bookingDetails,
    value: any
  ) => {
    setBookingDetails((prev) => ({ ...prev, [field]: value }));
  };
  const handleGuestDetailChange = (
    field: keyof typeof guestDetails,
    value: any
  ) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
  };

  const executeSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pickupCoords) {
      toast.error("Please select a valid pickup location.");
      return;
    }
    if (!filters.startDate || !filters.endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    setSearchPage(0);
    setRunSearch(true);
    setStep("results");
  };

  const handleSelectVehicle = (vehicle: VehicleSearchResult) => {
    setSelectedVehicle(vehicle);
    setCalculationResult(null);
    setBookingDetails({
      startDate: filters.startDate,
      startTime: "", // Reset time
      pickupLocationString: filters.pickupLocationString,
      dropoffLocationString: filters.dropoffLocationString,
      bookingTypeId: "", // Reset booking type
    });
    setStep("details");
  };

  const handleCalculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedVehicle ||
      !pickupCoords ||
      !dropoffCoords ||
      !bookingDetails.bookingTypeId ||
      !bookingDetails.startDate ||
      !bookingDetails.startTime
    ) {
      toast.error("Please fill in all required booking details.");
      return;
    }

    const segmentPayload: BookingSegmentPayload = {
      bookingTypeId: bookingDetails.bookingTypeId,
      startDate: bookingDetails.startDate,
      startTime: bookingDetails.startTime + ":00",
      pickupLatitude: pickupCoords.latitude,
      pickupLongitude: pickupCoords.longitude,
      dropoffLatitude: dropoffCoords.latitude,
      dropoffLongitude: dropoffCoords.longitude,
      pickupLocationString: bookingDetails.pickupLocationString!,
      dropoffLocationString: bookingDetails.dropoffLocationString!,
    };

    const payload: CalculateBookingPayload = {
      vehicleId: selectedVehicle.id,
      segments: [segmentPayload],
    };

    calculationMutation.mutate(payload, {
      onSuccess: (data) => {
        setCalculationResult(data);
        setStep("confirm");
      },
    });
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculationResult) {
      toast.error("Price calculation is missing.");
      return;
    }
    const payload: CreateBookingPayload = {
      calculationId: calculationResult.calculationId,
      primaryPhoneNumber: guestDetails.primaryPhoneNumber,
      guestFullName: guestDetails.guestFullName,
      guestEmail: guestDetails.guestEmail,
      extraDetails: guestDetails.extraDetails || undefined,
      purposeOfRide: guestDetails.purposeOfRide || undefined,
      channel: guestDetails.channel,
      paymentMethod: "OFFLINE",
    };

    createBookingMutation.mutate(payload, {
      onSuccess: (data) => {
        setBookingResponse(data);
        setStep("success");
      },
    });
  };

  const handleDownloadInvoice = () => {
    if (!bookingResponse || downloadInvoiceMutation.isPending) return;
    downloadInvoiceMutation.mutate({ bookingId: bookingResponse.bookingId });
  };

  const resetAndGoToSearch = () => {
    setStep("search");
    setFilters(initialFilters);
    setPickupCoords(null);
    setDropoffCoords(null);
    setSearchPage(0);
    setRunSearch(false);
    setSelectedVehicle(null);
    setBookingDetails(initialBookingDetails);
    setCalculationResult(null);
    setGuestDetails({
      guestFullName: "",
      guestEmail: "",
      primaryPhoneNumber: "",
      extraDetails: "",
      purposeOfRide: "",
      channel: "WEBSITE",
    });
    setBookingResponse(null);
  };

  // --- Render Functions for Steps ---

  const renderSearchForm = () => (
    <form onSubmit={executeSearch} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Find a Vehicle</h2>
      <AddressInput
        label="Pickup Location *"
        id="pickup-location"
        value={filters.pickupLocationString || ""}
        onChange={(value) => handleFilterChange("pickupLocationString", value)}
        onLocationSelect={setPickupCoords}
        placeholder="Enter pickup address"
        required
      />
      <AddressInput
        label="Dropoff Location"
        id="dropoff-location"
        value={filters.dropoffLocationString || ""}
        onChange={(value) => handleFilterChange("dropoffLocationString", value)}
        onLocationSelect={setDropoffCoords}
        placeholder="Enter dropoff address (optional)"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Start Date *"
          id="start-date"
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          required
        />
        <TextInput
          label="End Date *"
          id="end-date"
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          min={filters.startDate}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Booking Type"
          options={bookingTypeOptions}
          selected={bookingTypeOptions.find(
            (o) => o.id === filters.bookingTypeId
          )}
          onChange={(opt) => handleFilterChange("bookingTypeId", opt.id)}
          disabled={isLoadingBookingTypes}
          placeholder="Select Booking Type"
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Vehicle Type"
          options={vehicleTypeOptions}
          selected={vehicleTypeOptions.find(
            (o) => o.id === filters.vehicleTypeId
          )}
          onChange={(opt) => handleFilterChange("vehicleTypeId", opt.id)}
          disabled={isLoadingVehicleTypes}
          placeholder="Any Type"
        />
        <Select
          label="Make"
          options={vehicleMakeOptions}
          selected={vehicleMakeOptions.find(
            (o) => o.id === filters.vehicleMakeId
          )}
          onChange={(opt) => handleFilterChange("vehicleMakeId", opt.id)}
          disabled={isLoadingVehicleMakes}
          placeholder="Any Make"
        />
        <Select
          label="Model"
          options={vehicleModelOptions}
          selected={vehicleModelOptions.find(
            (o) => o.id === filters.vehicleModelId
          )}
          onChange={(opt) => handleFilterChange("vehicleModelId", opt.id)}
          disabled={isLoadingVehicleModels}
          placeholder="Any Model"
        />
      </div>
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSearching && runSearch}
        >
          <Search className="h-5 w-5 mr-2" /> Search Vehicles
        </Button>
      </div>
    </form>
  );

  const renderSearchResults = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      {isSearching && !searchResultsData && (
        <div className="flex justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      {isSearchError && (
        <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-8 w-8" />
          <span className="font-semibold">Failed to load search results.</span>
        </div>
      )}
      {!isSearching &&
        !isSearchError &&
        searchResultsData?.content.length === 0 && (
          <p className="text-center text-gray-500 my-10">
            No vehicles found matching your criteria.
          </p>
        )}

      <div
        className={`${
          isSearchPlaceholder ? "opacity-50" : ""
        } space-y-4 max-h-[60vh] overflow-y-auto pr-2`}
      >
        {searchResultsData?.content.map((vehicle) => (
          <div
            key={vehicle.id}
            className="border rounded-lg p-4 flex gap-4 items-start shadow-sm hover:bg-gray-50 transition-colors"
          >
            <img
              src={
                vehicle.photos.find((p) => p.isPrimary)?.cloudinaryUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  vehicle.name
                )}&background=random&size=96`
              }
              alt={vehicle.name}
              className="w-24 h-24 object-cover rounded flex-shrink-0"
              onError={(e) =>
                (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  vehicle.name
                )}&background=random&size=96`)
              } // Fallback image
            />
            <div className="flex-1">
              <h3 className="font-semibold">{vehicle.name}</h3>
              <p className="text-sm text-gray-600">
                {vehicle.vehicleTypeName} • {vehicle.numberOfSeats} Seats
              </p>
              <p className="text-sm text-gray-500">{vehicle.city}</p>
              {vehicle.allPricingOptions.length > 0 && (
                <p className="text-lg font-bold mt-1">
                  From{" "}
                  {formatPrice(
                    Math.min(...vehicle.allPricingOptions.map((p) => p.price))
                  )}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Driver included: {vehicle.willProvideDriver ? "Yes" : "No"}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-auto px-3 self-center"
              onClick={() => handleSelectVehicle(vehicle)}
            >
              Select
            </Button>
          </div>
        ))}
      </div>

      <PaginationControls
        currentPage={searchPage}
        totalPages={searchResultsData?.totalPages || 0}
        onPageChange={setSearchPage}
        isLoading={isSearchPlaceholder}
      />
      <Button
        variant="secondary"
        onClick={() => {
          setRunSearch(false);
          setStep("search");
        }}
        className="mt-4"
      >
        Back to Search
      </Button>
    </div>
  );

  const renderBookingDetailsForm = () => (
    <form onSubmit={handleCalculatePrice} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Booking Details for {selectedVehicle?.name}
      </h2>
      <AddressInput
        label="Pickup Location *"
        id="pickup-location-detail"
        value={bookingDetails.pickupLocationString || ""}
        onChange={(value) =>
          handleBookingDetailChange("pickupLocationString", value)
        }
        onLocationSelect={setPickupCoords}
        placeholder="Confirm pickup address"
        required
      />
      <AddressInput
        label="Dropoff Location *"
        id="dropoff-location-detail"
        value={bookingDetails.dropoffLocationString || ""}
        onChange={(value) =>
          handleBookingDetailChange("dropoffLocationString", value)
        }
        onLocationSelect={setDropoffCoords}
        placeholder="Confirm dropoff address"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Start Date *"
          id="start-date-detail"
          type="date"
          value={bookingDetails.startDate || ""}
          onChange={(e) =>
            handleBookingDetailChange("startDate", e.target.value)
          }
          required
          min={new Date().toISOString().split("T")[0]} // Min today
        />
        <TextInput
          label="Start Time *"
          id="start-time-detail"
          type="time"
          value={bookingDetails.startTime || ""}
          onChange={(e) =>
            handleBookingDetailChange("startTime", e.target.value)
          }
          required
        />
        {selectedVehicle && selectedVehicle.allPricingOptions.length > 0 ? (
          <Select
            label="Booking Type *"
            options={selectedVehicle.allPricingOptions.map((p) => ({
              id: p.bookingTypeId,
              name: `${p.bookingTypeName} (${formatPrice(p.price)})`,
            }))}
            selected={selectedVehicle.allPricingOptions
              .map((p) => ({
                id: p.bookingTypeId,
                name: `${p.bookingTypeName} (${formatPrice(p.price)})`,
              }))
              .find((o) => o.id === bookingDetails.bookingTypeId)}
            onChange={(opt) =>
              handleBookingDetailChange("bookingTypeId", opt.id)
            }
            placeholder="Select Booking Type"
          />
        ) : (
          <p className="text-red-600 text-sm mt-2 md:mt-8">
            No pricing options available for this vehicle.
          </p>
        )}
      </div>
      <div className="flex justify-between items-center pt-4">
        <Button variant="secondary" onClick={() => setStep("results")}>
          Back to Results
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={calculationMutation.isPending}
          disabled={
            !selectedVehicle || selectedVehicle.allPricingOptions.length === 0
          }
        >
          Calculate Price
        </Button>
      </div>
    </form>
  );

  const renderConfirmationForm = () => (
    <form onSubmit={handleCreateBooking} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
      {calculationResult && (
        <div className="p-4 border rounded-lg bg-indigo-50 space-y-2 mb-6">
          <h3 className="font-semibold text-lg text-indigo-800">
            Price Breakdown
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Price:</span>{" "}
            <span>{formatPrice(calculationResult.basePrice)}</span>
          </div>
          {calculationResult.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>{" "}
              <span>- {formatPrice(calculationResult.discountAmount)}</span>
            </div>
          )}
          {calculationResult.geofenceSurcharge > 0 && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>Geofence Surcharge:</span>{" "}
              <span>+ {formatPrice(calculationResult.geofenceSurcharge)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee:</span>{" "}
            <span>+ {formatPrice(calculationResult.platformFeeAmount)}</span>
          </div>
          <hr className="my-1" />
          <div className="flex justify-between font-bold text-lg">
            <span>Final Price:</span>{" "}
            <span>{formatPrice(calculationResult.finalPrice)}</span>
          </div>
          {calculationResult.appliedGeofenceNames.length > 0 && (
            <p className="text-xs text-orange-700">
              Includes surcharge for:{" "}
              {calculationResult.appliedGeofenceNames.join(", ")}
            </p>
          )}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-900 pt-2">
        Guest Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Guest Full Name *"
          id="guestName"
          value={guestDetails.guestFullName}
          onChange={(e) =>
            handleGuestDetailChange("guestFullName", e.target.value)
          }
          required
        />
        <TextInput
          label="Guest Email *"
          id="guestEmail"
          type="email"
          value={guestDetails.guestEmail}
          onChange={(e) =>
            handleGuestDetailChange("guestEmail", e.target.value)
          }
          required
        />
      </div>
      <TextInput
        label="Primary Phone Number *"
        id="guestPhone"
        type="tel"
        value={guestDetails.primaryPhoneNumber}
        onChange={(e) =>
          handleGuestDetailChange("primaryPhoneNumber", e.target.value)
        }
        required
      />
      <Select
        label="Booking Channel"
        options={channelOptions}
        selected={channelOptions.find((o) => o.id === guestDetails.channel)}
        onChange={(opt) =>
          handleGuestDetailChange("channel", opt.id as BookingChannel)
        }
      />
      <TextAreaInput
        label="Extra Details (Optional)"
        id="extraDetails"
        value={guestDetails.extraDetails}
        onChange={(e) =>
          handleGuestDetailChange("extraDetails", e.target.value)
        }
        rows={2}
      />
      <TextInput
        label="Purpose of Ride (Optional)"
        id="purpose"
        value={guestDetails.purposeOfRide}
        onChange={(e) =>
          handleGuestDetailChange("purposeOfRide", e.target.value)
        }
      />

      <div className="flex justify-between items-center pt-4">
        <Button variant="secondary" onClick={() => setStep("details")}>
          Back to Details
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createBookingMutation.isPending}
        >
          Create Booking (Offline Payment)
        </Button>
      </div>
    </form>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center text-center p-6">
      <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900">Booking Created!</h2>
      <p className="text-gray-600 mt-2">
        Booking ID:{" "}
        <strong className="font-mono">{bookingResponse?.bookingId}</strong> has
        been created successfully.
      </p>
      <p className="text-sm text-gray-500 mt-1">Status: PENDING_PAYMENT</p>

      <Button
        variant="primary"
        className="w-auto px-5 mt-6"
        onClick={handleDownloadInvoice}
        isLoading={downloadInvoiceMutation.isPending}
      >
        <Download className="h-5 w-5 mr-2" />
        Download Invoice
      </Button>
      <Button
        variant="secondary"
        onClick={resetAndGoToSearch}
        className="mt-4 w-auto px-5"
      >
        Create Another Booking
      </Button>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Booking
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md border">
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
