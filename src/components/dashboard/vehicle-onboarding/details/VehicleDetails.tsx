"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  AlertCircle,
  Car,
  Check,
  CheckCircle,
  DollarSign,
  FileText,
  Gauge,
  Info,
  List,
  MapPin,
  Shield,
  Tag,
  Users,
  Wrench,
  X,
  Share2,
  CalendarDays,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft, // Needed for carousel controls
} from "lucide-react";

// Reusable Components
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import Button from "@/components/generic/ui/Button";
import {
  useGetVehicleBookings,
  useGetVehicleDetails,
} from "@/lib/hooks/vehicle-onboarding/details/useVehicleDetailsPage";

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "bg-gray-100 text-gray-700 border-gray-300";
  let icon = null;

  if (status === "APPROVED") {
    colorClasses = "bg-green-50 text-green-700 border-green-200";
    icon = <CheckCircle className="h-3.5 w-3.5" />;
  }
  if (status === "IN_REVIEW") {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
    icon = <Clock className="h-3.5 w-3.5" />;
  }
  if (status === "REJECTED") {
    colorClasses = "bg-red-50 text-red-700 border-red-200";
    icon = <X className="h-3.5 w-3.5" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${colorClasses}`}
    >
      {icon}
      {status.replace(/_/g, " ")}
    </span>
  );
};

const DetailItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-900 wrap-break-words">
      {value || <span className="text-gray-400 italic">Not specified</span>}
    </p>
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-[#0096FF]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.vehicleId as string;

  // --- API Hooks ---
  const {
    data: vehicle,
    isLoading: isLoadingVehicle,
    isError,
  } = useGetVehicleDetails(vehicleId);

  const { data: bookingsData, isLoading: isLoadingBookings } =
    useGetVehicleBookings(vehicleId, 0, 5);

  // --- CAROUSEL STATE ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isSharing = useRef(false);

  // Ensure activeIndex resets if vehicle loads or photos change
  useEffect(() => {
    setActiveIndex(0);
  }, [vehicle?.photos]);

  // Auto-Play Logic
  useEffect(() => {
    // Only auto-play if not hovered and multiple photos exist
    if (!isHovered && vehicle?.photos && vehicle.photos.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % vehicle.photos.length);
      }, 4000); // 4 Seconds per slide
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, vehicle?.photos]);

  const nextSlide = () => {
    if (!vehicle?.photos) return;
    setActiveIndex((prev) => (prev + 1) % vehicle.photos.length);
  };

  const prevSlide = () => {
    if (!vehicle?.photos) return;
    setActiveIndex(
      (prev) => (prev - 1 + vehicle.photos.length) % vehicle.photos.length
    );
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const pricingMap = useMemo(() => {
    const pMap = new Map<string, number>();
    vehicle?.pricing.forEach((p) => pMap.set(p.bookingTypeId, p.price));
    return pMap;
  }, [vehicle?.pricing]);

  const handleShare = async () => {
    if (!vehicle || isSharing.current) return;
    const currentPhotoUrl = vehicle.photos[activeIndex]?.cloudinaryUrl;

    const shareText = `Check out this ${vehicle.name} (${vehicle.yearOfRelease})\nID: ${vehicle.vehicleIdentifier}`;

    try {
      isSharing.current = true;
      if (currentPhotoUrl && navigator.canShare && navigator.share) {
        try {
          toast.loading("Preparing image...");
          const response = await fetch(currentPhotoUrl, { mode: "cors" });
          const blob = await response.blob();
          const file = new File([blob], "vehicle.jpg", { type: blob.type });

          const fileShareData = {
            files: [file],
            title: vehicle.name,
            text: shareText,
          };

          if (navigator.canShare(fileShareData)) {
            toast.dismiss();
            await navigator.share(fileShareData);
            return;
          }
        } catch (e) {
          console.warn("File share failed", e);
          toast.dismiss();
        }
      }

      if (navigator.share) {
        await navigator.share({
          title: vehicle.name,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Failed to share");
      }
    } finally {
      isSharing.current = false;
    }
  };

  if (isLoadingVehicle) return <CustomLoader />;

  if (isError || !vehicle) {
    return (
      <main className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomBack />
        <div className="flex flex-col items-center gap-3 p-8 text-red-600 bg-red-50 border border-red-200 rounded-xl mt-6">
          <AlertCircle className="h-12 w-12" />
          <span className="font-semibold text-lg">Failed to load details.</span>
        </div>
      </main>
    );
  }

  // Current photo for the big display
  const currentPhoto = vehicle.photos?.[activeIndex];

  return (
    <main className="min-h-screen">
      {/* Header Section */}
      <div className="bg-linear-to-r from-[#0096FF] to-[#0077CC] text-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CustomBack />
          <div className="mt-4 md:flex md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{vehicle.name}</h1>
              <p className="text-blue-100 mt-2 text-lg font-medium">
                {vehicle.vehicleIdentifier}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <StatusBadge status={vehicle.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={CalendarDays}
            label="Year"
            value={vehicle.yearOfRelease}
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Seats"
            value={vehicle.numberOfSeats}
            color="green"
          />
          <StatCard
            icon={Tag}
            label="License Plate"
            value={vehicle.licensePlateNumber}
            color="purple"
          />
          <StatCard
            icon={MapPin}
            label="Location"
            value={vehicle.city}
            color="orange"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photos & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* --- CAROUSEL COMPONENT --- */}
            <div
              className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* 1. BIG PICTURE (Auto-Scrolls / Controlled) */}
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                {currentPhoto ? (
                  <img
                    src={currentPhoto.cloudinaryUrl}
                    alt={`Vehicle View ${activeIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Car className="h-16 w-16 mb-2" />
                    <span className="text-sm">No photos available</span>
                  </div>
                )}

                {/* Controls (Arrows) - Only show if > 1 photo */}
                {vehicle.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevSlide();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextSlide();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Share Button (Top Left) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare();
                  }}
                  className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white backdrop-blur-md text-gray-700 hover:text-blue-600 rounded-full shadow-lg transition-all z-20"
                  title="Share current image"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                {/* Slide Counter (Bottom Right) */}
                {vehicle.photos.length > 0 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    {activeIndex + 1} / {vehicle.photos.length}
                  </div>
                )}
              </div>

              {/* 2. THUMBNAILS (Control the Big Picture) */}
              {vehicle.photos.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200 overflow-x-auto">
                  <div className="flex gap-2 min-w-min">
                    {vehicle.photos.map((photo, index) => (
                      <button
                        key={`${photo.cloudinaryPublicId}-${index}`}
                        onClick={() => goToSlide(index)}
                        className={`
                          relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                          ${
                            index === activeIndex
                              ? "border-[#0096FF] ring-2 ring-blue-100 opacity-100 scale-105"
                              : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                          }
                        `}
                      >
                        <img
                          src={photo.cloudinaryUrl}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* --- END CAROUSEL --- */}

            {/* Description */}
            <InfoCard icon={Info} title="About This Vehicle">
              <p className="text-sm text-gray-700 leading-relaxed">
                {vehicle.description || "No description provided."}
              </p>
            </InfoCard>

            {/* Vehicle Specifications */}
            <InfoCard icon={Gauge} title="Specifications">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <DetailItem
                  label="Year of Release"
                  value={vehicle.yearOfRelease}
                />
                <DetailItem
                  label="Number of Seats"
                  value={vehicle.numberOfSeats}
                />
                <DetailItem
                  label="License Plate"
                  value={vehicle.licensePlateNumber}
                />
                <DetailItem
                  label="State of Registration"
                  value={vehicle.stateOfRegistration}
                />
                <DetailItem label="Color ID" value={vehicle.vehicleColorId} />
                <DetailItem
                  label="Upgraded Vehicle"
                  value={
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                        vehicle.isVehicleUpgraded
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {vehicle.isVehicleUpgraded ? (
                        <>
                          <Check className="h-3 w-3" /> Yes
                        </>
                      ) : (
                        "No"
                      )}
                    </span>
                  }
                />
              </div>
            </InfoCard>

            {/* Features */}
            <InfoCard icon={CheckCircle} title="Features & Amenities">
              <div className="flex flex-wrap gap-2">
                {vehicle.features.length > 0 ? (
                  vehicle.features.map((feature) => (
                    <span
                      key={feature.id}
                      className="inline-flex items-center gap-2 text-sm bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-200"
                    >
                      <Check className="h-4 w-4" />
                      {feature.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No features listed.
                  </p>
                )}
              </div>
            </InfoCard>

            {/* Location & Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard icon={MapPin} title="Location">
                <div className="space-y-4">
                  <DetailItem label="City" value={vehicle.city} />
                  <DetailItem label="Address" value={vehicle.address} />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Coordinates
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${vehicle.latitude},${vehicle.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#0096FF] hover:text-[#0077CC] font-medium transition-colors"
                    >
                      {vehicle.latitude}, {vehicle.longitude}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </InfoCard>

              <InfoCard icon={FileText} title="Documents">
                <div className="space-y-2">
                  {vehicle.documents.length > 0 ? (
                    vehicle.documents.map((doc) => (
                      <a
                        key={doc.cloudinaryPublicId}
                        href={doc.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                      >
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                          {doc.documentType.replace(/_/g, " ")}
                        </span>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No documents uploaded.
                    </p>
                  )}
                </div>
              </InfoCard>
            </div>
          </div>

          {/* Right Column - Pricing & Rules */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing */}
            <InfoCard icon={DollarSign} title="Pricing">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">
                    Base Rates
                  </h4>
                  <div className="space-y-2">
                    {vehicle.supportedBookingTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-600">
                          {type.name}
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {pricingMap.has(type.id)
                            ? `₦${pricingMap.get(type.id)?.toLocaleString()}`
                            : "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">
                    Additional Fees
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Extra Hourly Rate
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {vehicle.extraHourlyRate
                          ? `₦${vehicle.extraHourlyRate.toLocaleString()}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Outskirt Fee
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {vehicle.outskirtFee
                          ? `₦${vehicle.outskirtFee.toLocaleString()}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Extreme Fee</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {vehicle.extremeFee
                          ? `₦${vehicle.extremeFee.toLocaleString()}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Booking Rules */}
            <InfoCard icon={CalendarDays} title="Booking Rules">
              <div className="space-y-4">
                <DetailItem
                  label="Max. Trip Duration"
                  value={`${vehicle.maxTripDurationValue} ${vehicle.maxTripDurationUnit}`}
                />
                <DetailItem
                  label="Advance Notice Required"
                  value={`${vehicle.advanceNoticeValue} ${vehicle.advanceNoticeUnit}`}
                />
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Provides Driver
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        vehicle.willProvideDriver
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {vehicle.willProvideDriver ? (
                        <>
                          <Check className="h-3 w-3" /> Yes
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" /> No
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Provides Fuel
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        vehicle.willProvideFuel
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {vehicle.willProvideFuel ? (
                        <>
                          <Check className="h-3 w-3" /> Yes
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" /> No
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Compliance */}
            <InfoCard icon={Shield} title="Compliance & Safety">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    Insurance Coverage
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      vehicle.hasInsurance
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vehicle.hasInsurance ? (
                      <>
                        <Shield className="h-3 w-3" /> Insured
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" /> Not Insured
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">GPS Tracker</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      vehicle.hasTracker
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {vehicle.hasTracker ? (
                      <>
                        <Check className="h-3 w-3" /> Installed
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" /> Not Installed
                      </>
                    )}
                  </span>
                </div>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Booking History */}
        <div className="mt-6">
          <InfoCard icon={List} title="Recent Bookings">
            {isLoadingBookings && <CustomLoader />}
            {!isLoadingBookings && bookingsData?.content.length === 0 && (
              <div className="text-center py-8">
                <List className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No bookings found for this vehicle.
                </p>
              </div>
            )}
            {bookingsData && bookingsData.content.length > 0 && (
              <div className="space-y-3">
                {bookingsData.content.map((booking) => (
                  <div
                    key={booking.segmentId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">
                        {booking.customerName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {booking.bookingType}
                        </span>
                        <span>•</span>
                        <span>{booking.duration}</span>
                        <span>•</span>
                        <span>
                          {format(new Date(booking.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ₦{booking.price.toLocaleString()}
                        </p>
                        <StatusBadge status={booking.bookingStatus} />
                      </div>
                      <Button
                        variant="secondary"
                        className="w-auto px-4 py-2 text-sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/bookings/${booking.bookingId}`
                          )
                        }
                      >
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {bookingsData.totalPages > 1 && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href={`/dashboard/vehicle-onboarding/${vehicle.id}/bookings`}
                      className="block"
                    >
                      <Button variant="primary" className="w-full">
                        View All Bookings ({bookingsData.totalItems})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </InfoCard>
        </div>

        {/* Admin Data - Collapsible Section */}
        <details className="mt-6 group">
          <summary className="cursor-pointer list-none">
            <InfoCard
              icon={Wrench}
              title="Advanced Information"
              className="group-open:rounded-b-none"
            >
              <p className="text-xs text-gray-500">
                Click to expand technical details and IDs
              </p>
            </InfoCard>
          </summary>
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4">
                System IDs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Vehicle UUID" value={vehicle.id} />
                <DetailItem label="Owner ID" value={vehicle.ownerId} />
                <DetailItem
                  label="Vehicle Type ID"
                  value={vehicle.vehicleTypeId}
                />
                <DetailItem label="Make ID" value={vehicle.vehicleMakeId} />
                <DetailItem label="Model ID" value={vehicle.vehicleModelId} />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-700 mb-4">
                Additional Data
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Discounts
                  </p>
                  {vehicle.discounts.length > 0 ? (
                    <ul className="space-y-1">
                      {vehicle.discounts.map((d) => (
                        <li
                          key={d.discountDurationId}
                          className="text-sm text-gray-700"
                        >
                          <span className="font-semibold">{d.percentage}%</span>
                          <span className="text-xs text-gray-500 ml-2">
                            (ID: {d.discountDurationId.slice(0, 8)}...)
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No discounts</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Out-of-Bounds Areas
                  </p>
                  {vehicle.outOfBoundsAreaIds.length > 0 ? (
                    <ul className="space-y-1">
                      {vehicle.outOfBoundsAreaIds.map((id) => (
                        <li key={id} className="text-sm text-gray-700">
                          {id.slice(0, 8)}...
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No restricted areas
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
