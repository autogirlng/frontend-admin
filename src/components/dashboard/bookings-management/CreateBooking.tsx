"use client";

import React, { useState, useMemo, useEffect } from "react"; // ✅ Added useEffect
import { useDownloadInvoice } from "@/lib/hooks/booking-management/useBookingCreation";
import { useGetBookingTypes } from "@/lib/hooks/set-up/booking-types/useBookingTypes";
import { useGetVehicleTypes } from "@/lib/hooks/set-up/vehicle-types/useVehicleTypes";
import { useGetVehicleMakes } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleMakes";
import { useGetVehicleModels } from "@/lib/hooks/set-up/vehicle-make-models/useVehicleModels";
// ✅ Import new hook
import { useGetCompanyBankAccounts } from "@/lib/hooks/booking-management/useCompanyBankAccounts";
import {
  VehicleSearchResult,
  BookingSegmentPayload,
  CalculateBookingResponse,
  CreateBookingPayload,
  CreateBookingResponse,
  BookingChannel,
  CalculateBookingPayload,
  CompanyBankAccount, // ✅ Import new type
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
  Plus,
  X,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import {
  useVehicleSearch,
  useBookingCalculation,
  useCreateBooking,
  VehicleSearchFilters,
} from "@/lib/hooks/booking-management/useBookingCreation";
import { formatPrice } from "@/lib/utils/price-format";
import { useRouter } from "next/navigation";
import CustomBack from "@/components/generic/CustomBack";

type Step = "search" | "results" | "details" | "confirm" | "success";

// ... (initialFilters and initialBookingDetails are unchanged) ...
// Initial state for filters
const initialFilters: Omit<VehicleSearchFilters, "page"> = {
  radiusInKm: 10000,
  minSeats: 1,
  pickupLocationString: "",
  dropoffLocationString: "",
  startDate: "",
  endDate: "",
};

// Initial state for ONE segment
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
  const router = useRouter();
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

  // ✅ --- State for bank account selection ---
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  // --- API Hooks ---
  const { data: bookingTypes, isLoading: isLoadingBookingTypes } =
    useGetBookingTypes();
  const { data: vehicleTypes, isLoading: isLoadingVehicleTypes } =
    useGetVehicleTypes();
  const { data: vehicleMakes, isLoading: isLoadingVehicleMakes } =
    useGetVehicleMakes();
  const { data: vehicleModels, isLoading: isLoadingVehicleModels } =
    useGetVehicleModels();
  // ✅ Fetch bank accounts
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

  // --- Memos for Select Options ---
  // ... (bookingTypeOptions, vehicleTypeOptions, etc. are unchanged) ...
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

  // ✅ NEW: Memo for bank account options
  const bankAccountOptions: Option[] = useMemo(() => {
    if (!bankAccounts) return [];
    return bankAccounts.map((acct: CompanyBankAccount) => ({
      id: acct.id,
      name: `${acct.bankName} - ${acct.accountNumber} (${acct.accountName})`,
    }));
  }, [bankAccounts]);

  // ✅ NEW: Effect to set the default bank account
  useEffect(() => {
    if (bankAccounts && !selectedAccountId) {
      const defaultAccount = bankAccounts.find((acct) => acct.default);
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id);
      }
    }
  }, [bankAccounts, selectedAccountId]);

  // --- Event Handlers ---
  // ... (all handlers: handleFilterChange, handleSegmentChange, etc. are unchanged) ...
  const handleFilterChange = (
    field: keyof Omit<VehicleSearchFilters, "page">,
    value: any
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSegmentChange = (
    index: number,
    field: keyof (typeof segments)[0],
    value: any
  ) => {
    setSegments((prev) =>
      prev.map((segment, i) =>
        i === index ? { ...segment, [field]: value } : segment
      )
    );
  };

  const handleSegmentLocationSelect = (
    index: number,
    type: "pickup" | "dropoff",
    coords: { latitude: number; longitude: number } | null
  ) => {
    setSegments((prev) =>
      prev.map((segment, i) => {
        if (i !== index) return segment;
        if (type === "pickup") {
          return { ...segment, pickupCoords: coords };
        } else {
          return { ...segment, dropoffCoords: coords };
        }
      })
    );
  };

  const addSegment = () => {
    const lastSegment = segments[segments.length - 1];
    setSegments((prev) => [
      ...prev,
      {
        ...initialBookingDetails,
        pickupLocationString: lastSegment.dropoffLocationString,
        pickupCoords: lastSegment.dropoffCoords,
        startDate: lastSegment.startDate,
      },
    ]);
  };

  const removeSegment = (index: number) => {
    setSegments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuestDetailChange = (
    field: keyof typeof guestDetails,
    value: any
  ) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
  };

  const executeSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchPickupCoords) {
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
    setSegments([
      {
        ...initialBookingDetails,
        startDate: filters.startDate,
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

    const segmentPayloads: BookingSegmentPayload[] = [];

    for (const [index, segment] of segments.entries()) {
      if (
        !segment.bookingTypeId ||
        !segment.startDate ||
        !segment.startTime ||
        !segment.pickupCoords ||
        !segment.dropoffCoords ||
        !segment.pickupLocationString ||
        !segment.dropoffLocationString
      ) {
        toast.error(
          `Please fill in all required fields for Booking #${index + 1}.`
        );
        return;
      }
      segmentPayloads.push({
        bookingTypeId: segment.bookingTypeId,
        startDate: segment.startDate,
        startTime: segment.startTime + ":00",
        pickupLatitude: segment.pickupCoords.latitude,
        pickupLongitude: segment.pickupCoords.longitude,
        dropoffLatitude: segment.dropoffCoords.latitude,
        dropoffLongitude: segment.dropoffCoords.longitude,
        pickupLocationString: segment.pickupLocationString,
        dropoffLocationString: segment.dropoffLocationString,
      });
    }

    const payload: CalculateBookingPayload = {
      vehicleId: selectedVehicle.id,
      segments: segmentPayloads,
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

  // ✅ UPDATED: handleDownloadInvoice
  const handleDownloadInvoice = () => {
    if (!bookingResponse || downloadInvoiceMutation.isPending) return;
    downloadInvoiceMutation.mutate({
      bookingId: bookingResponse.bookingId,
      companyBankAccountId: selectedAccountId || undefined, // Pass the selected ID
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
    // ... (this function is unchanged) ...
    <form onSubmit={executeSearch} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Find a Vehicle</h2>
      <AddressInput
        label="Pickup Location *"
        id="pickup-location"
        value={filters.pickupLocationString || ""}
        onChange={(value) => handleFilterChange("pickupLocationString", value)}
        onLocationSelect={setSearchPickupCoords}
        placeholder="Enter pickup address"
        required
      />
      <AddressInput
        label="Dropoff Location"
        id="dropoff-location"
        value={filters.dropoffLocationString || ""}
        onChange={(value) => handleFilterChange("dropoffLocationString", value)}
        onLocationSelect={setSearchDropoffCoords}
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
          className="w-auto px-4"
        >
          <Search className="h-5 w-5 mr-2" /> Search Vehicles
        </Button>
      </div>
    </form>
  );

  const renderSearchResults = () => (
    // ... (this function is unchanged) ...
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <Button
          variant="secondary"
          onClick={() => {
            setRunSearch(false);
            setStep("search");
          }}
          className="w-auto px-4"
        >
          Back to Search
        </Button>
      </div>
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
        className={`${isSearchPlaceholder ? "opacity-50" : ""} space-y-4 pr-2`}
      >
        {searchResultsData?.content.map((vehicle) => (
          <div
            key={vehicle.id}
            className="border p-4 flex gap-4 items-start shadow-sm hover:bg-gray-50 transition-colors"
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
              }
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="bg-blue-500 p-1 rounded-full text-white">
                  {vehicle.vehicleIdentifier}
                </p>
              </div>
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
    </div>
  );

  const renderBookingDetailsForm = () => (
    // ... (this function is unchanged) ...
    <form onSubmit={handleCalculatePrice} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">
        Booking Details for {selectedVehicle?.name}
      </h2>
      {segments.map((segment, index) => (
        <div key={index} className="py-4 space-y-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-[#0096FF]">
              Booking #{index + 1}
            </h3>
            {segments.length > 1 && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="w-auto p-2"
                onClick={() => removeSegment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <AddressInput
            label="Pickup Location *"
            id={`pickup-location-${index}`}
            value={segment.pickupLocationString || ""}
            onChange={(value) =>
              handleSegmentChange(index, "pickupLocationString", value)
            }
            onLocationSelect={(coords) =>
              handleSegmentLocationSelect(index, "pickup", coords)
            }
            placeholder="Confirm pickup address"
            required
          />
          <AddressInput
            label="Dropoff Location *"
            id={`dropoff-location-${index}`}
            value={segment.dropoffLocationString || ""}
            onChange={(value) =>
              handleSegmentChange(index, "dropoffLocationString", value)
            }
            onLocationSelect={(coords) =>
              handleSegmentLocationSelect(index, "dropoff", coords)
            }
            placeholder="Confirm dropoff address"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="Start Date *"
              id={`start-date-${index}`}
              type="date"
              value={segment.startDate || ""}
              onChange={(e) =>
                handleSegmentChange(index, "startDate", e.target.value)
              }
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <TextInput
              label="Start Time *"
              id={`start-time-${index}`}
              type="time"
              value={segment.startTime || ""}
              onChange={(e) =>
                handleSegmentChange(index, "startTime", e.target.value)
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
                  .find((o) => o.id === segment.bookingTypeId)}
                onChange={(opt) =>
                  handleSegmentChange(index, "bookingTypeId", opt.id)
                }
                placeholder="Select Booking Type"
              />
            ) : (
              <p className="text-red-600 text-sm mt-2 md:mt-8">
                No pricing options available for this vehicle.
              </p>
            )}
          </div>
        </div>
      ))}
      <div className="pt-2">
        <Button
          type="button"
          variant="secondary"
          className="w-auto"
          onClick={addSegment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Booking
        </Button>
      </div>
      <div className="flex justify-between items-center pt-4 border-t mt-4">
        <Button
          className="w-auto px-4"
          variant="secondary"
          onClick={() => setStep("results")}
        >
          Back to Results
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={calculationMutation.isPending}
          disabled={
            !selectedVehicle || selectedVehicle.allPricingOptions.length === 0
          }
          className="w-auto px-4"
        >
          Calculate Price
        </Button>
      </div>
    </form>
  );

  const renderConfirmationForm = () => (
    // ... (this function is unchanged) ...
    <form onSubmit={handleCreateBooking} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Confirm Booking</h2>
      {calculationResult && (
        <div className="p-4 border bg-indigo-50 space-y-2 mb-6">
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
              <span>Outskirt/Extreme Location Surcharge:</span>{" "}
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
      <div className="flex justify-between items-center pt-4 flex-wrap gap-2 border-t mt-4">
        <Button
          variant="secondary"
          onClick={() => setStep("details")}
          className="w-auto px-4"
        >
          Back to Details
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={createBookingMutation.isPending}
          className="w-auto px-4"
        >
          Create Booking (Offline Payment)
        </Button>
      </div>
    </form>
  );

  // ✅ UPDATED: renderSuccess function
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

      {/* --- New Bank Account Selection --- */}
      <div className="w-full max-w-sm text-left my-6 space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Bank Account for Invoice
        </label>
        <Select
          label="Bank Account"
          hideLabel
          options={bankAccountOptions}
          selected={
            bankAccountOptions.find((o) => o.id === selectedAccountId) || null
          }
          onChange={(opt) => setSelectedAccountId(opt.id)}
          placeholder="Select a bank account"
          disabled={isLoadingBankAccounts}
        />
      </div>
      {/* --- End of New Section --- */}

      <Button
        variant="primary"
        className="w-auto px-5"
        onClick={handleDownloadInvoice}
        isLoading={downloadInvoiceMutation.isPending}
        disabled={!selectedAccountId} // Disable button if no account is selected
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
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Create New Booking
        </h1>
        <div className="bg-white py-3">
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
