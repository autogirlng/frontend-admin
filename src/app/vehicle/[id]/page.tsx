import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import cn from "classnames";
import Link from "next/link";
import Chip from "@/components/shared/chip"; // Assuming this component exists
import Icons from "@/components/shared/icons"; // Assuming this component exists and holds SVG icons
import {
  addSpaceBeforeUppercase,
  formatNumberWithCommas,
  keyAndValueInAChip, // Assuming this utility function exists
} from "@/utils/functions"; // Assuming these utility functions exist
import useVehicleSummary from "@/components/VehicleOnboarding/VehicleSummary/useVehicleSummary"; // Assuming this hook provides vehicle data
import { VehicleInformation } from "@/utils/types"; // Assuming this type definition exists

// --- Placeholder Components (as they are not provided in the original prompt but used in the code) ---
// You would replace these with your actual implementations
const SectionTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <h6
    className={cn("text-grey-700 text-xl 3xl:text-h6 !font-medium", className)}
  >
    {text}
  </h6>
);

const PricingTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-xs md:text-base 3xl:text-xl", className)}>{text}</p>
);

const PricingDescription = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-sm md:text-xl 3xl:text-h6 !font-medium", className)}>
    {text}
  </p>
);
// --- End Placeholder Components ---

type Props = { vehicle: VehicleInformation | null };

export default function VehiclePage({ vehicle }: Props) {
  // Component name changed to VehiclePage
  // Destructure from useVehicleSummary or define dummy data if not available
  const { perks, vehicleDetails, vehicleImages } = useVehicleSummary({
    vehicle,
  });

  // Dummy data for demonstration if vehicle or its properties are null
  const dummyVehicle: VehicleInformation = {
    listingName: "Hyundai Tucson 2018",
    vehicleDescription:
      "2018 Toyota Camry with good fuel efficiently, spacious interior, and advanced safety features. This vehicle is perfect for long trips and daily commutes. Bluetooth connectivity, AUX and a sunroof.",
    features: [
      "AC",
      "AutomaticTransmission",
      "PowerSteering",
      "AntiLockBrakingSystem",
      "Airbags",
      "Bluetooth",
      "Sunroof",
    ],
    outskirtsLocation: [
      "Ikeja",
      "Lekki",
      "Victoria Island",
      "Surulere",
      "Yaba",
      "Festac",
    ],
    tripSettings: {
      advanceNotice: "24 hours",
      maxTripDuration: "30 days",
        provideDriver: true,
  fuelProvided: false,

      // ... other trip settings
    },
    pricing: {
      dailyRate: { value: 26000, unit: "NGN" },
      extraHoursFee: 8000,
      airportPickupFee: 30000,
    //   driverFee: 30000,
      discounts: [
        { durationInDays: 7, percentage: 10 },
        { durationInDays: 15, percentage: 20 },
        { durationInDays: 30, percentage: 30 },
      ],
    },
    // ... other vehicle properties
  };

  const currentVehicle = vehicle || dummyVehicle;

  // Data for the "Vehicle Details" chips from the image
  const imageVehicleDetails = [
    { "License Plate Number": "AAA-4G0" },
    { Location: "123 Main St, Lagos, Nigeria" },
    { "Vehicle Model": "Tucson" },
    { Make: "Hyundai" },
    { Year: "2018" },
    { City: "Lagos" },
    { Country: "Nigeria" },
    { "Seating Capacity": "5" },
    { Fuel: "Petrol" },
    { Color: "Black" },
  ];

  // Dummy data for "Earnings" section
  const earningsData = {
    totalRevenue: "7,000,000",
    totalBookings: "899",
    totalTrips: "1,200,600",
    totalHours: "547",
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Left Sidebar - Assuming this is part of a parent layout */}
      {/*
      <div className="w-[200px] bg-gray-100 p-4">
        <h3 className="text-lg font-semibold mb-4">gmuvment</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_dashboard /> Dashboard</Link></li>
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_bookings /> Bookings</Link></li>
          <li><Link href="#" className="flex items-center gap-2 font-bold text-primary-500"><Icons.ic_vehicles /> Vehicles</Link></li>
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_trips /> Trips</Link></li>
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_reviews /> Reviews</Link></li>
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_settings /> Settings</Link></li>
          <li><Link href="#" className="flex items-center gap-2"><Icons.ic_support /> Support</Link></li>
        </ul>
      </div>
      */}

      {/* Main Content Area */}
      <div className="flex-1 p-8 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
        {/* Header Section (Top Bar with "Hello, Jeffrey" and Icons) - Assuming this is part of a parent layout */}
        {/*
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Hello, Jeffrey</h1>
          <div className="flex items-center gap-4">
            {Icons.ic_search}
            {Icons.ic_notification}
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        */}

        {/* Vehicle Header and Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-h5 md:text-h3 font-semibold">
            {currentVehicle?.listingName || "Hyundai Tucson 2018"}
          </h2>
          <Chip text="Approved" variant="filled" color="primary" radius="sm" />
        </div>

        {/* Vehicle Images Slider */}
        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="vehicle-summary-swiper rounded-[42px] overflow-hidden"
        >
          {vehicleImages.length > 0 ? (
            vehicleImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  alt={currentVehicle?.listingName || "Vehicle image"}
                  width={1120}
                  height={460}
                  className="w-full h-[218px] md:h-[460px] rounded-[42px] object-cover"
                />
              </SwiperSlide>
            ))
          ) : (
            // Render placeholder if no images
            <SwiperSlide>
              <div className="w-full h-[218px] md:h-[460px] bg-gray-200 flex items-center justify-center rounded-[42px]">
                <span className="text-gray-500">No Image Available</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {/* Small Image Previews */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {vehicleImages.length > 0 ? (
            vehicleImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt=""
                width={152}
                height={90}
                className="w-[152px] h-[44px] sm:h-[90px] rounded-lg sm:rounded-[18px] object-cover shrink-0 border border-transparent hover:border-primary-500 transition-colors"
              />
            ))
          ) : (
            // Render placeholder if no images
            <>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="w-[152px] h-[44px] sm:h-[90px] rounded-lg sm:rounded-[18px] bg-gray-200 shrink-0"
                ></div>
              ))}
            </>
          )}
        </div>

        {/* Availability Status */}
        <div className="space-y-4">
          <SectionTitle text="Availability Status" />
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="font-medium">Instant Booking</span>
              <Chip
                text="Enabled"
                variant="filled"
                // color="success"
                radius="sm"
              />
            </div>
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              Update
            </button>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="space-y-4">
          <SectionTitle text="Earnings" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-start p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xl font-semibold text-gray-900">
                NGN {formatNumberWithCommas(earningsData.totalRevenue)}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
            <div className="flex flex-col items-start p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xl font-semibold text-gray-900">
                {earningsData.totalBookings}
              </p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </div>
            <div className="flex flex-col items-start p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xl font-semibold text-gray-900">
                {formatNumberWithCommas(earningsData.totalTrips)}
              </p>
              <p className="text-sm text-gray-500">Total Trips</p>
            </div>
            <div className="flex flex-col items-start p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xl font-semibold text-gray-900">
                {earningsData.totalHours}
              </p>
              <p className="text-sm text-gray-500">Total Hours</p>
            </div>
          </div>
        </div>

        {/* Tabs for Vehicle Information, Reviews, Driver details */}
        <div className="flex border-b border-gray-200 space-x-6 text-gray-600 font-medium text-lg">
          <button className="pb-3 border-b-2 border-primary-500 text-primary-500">
            Vehicle information
          </button>
          <button className="pb-3 hover:text-primary-500 transition-colors">
            Reviews
          </button>
          <button className="pb-3 hover:text-primary-500 transition-colors">
            Driver details
          </button>
        </div>

        {/* Content for "Vehicle Information" tab */}
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="w-full md:w-[62%] space-y-10">
            {/* Vehicle Details */}
            <div className="space-y-5">
              <SectionTitle text="Vehicle Details" />
              <div className="flex flex-wrap gap-3">
                {imageVehicleDetails.map((detail, index) => {
                  const [key, value] = Object.entries(detail)[0];
                  return (
                    <Chip
                      key={index}
                      text={keyAndValueInAChip(key, value)}
                      variant="filled"
                      radius="sm"
                      color="dark"
                    />
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-5">
              <SectionTitle text="Location (only you can see)" />
              <p className="text-base text-gray-700">
                123 Main St, Lagos, Nigeria
              </p>
            </div>

            {/* Description */}
            <div className="space-y-5">
              <SectionTitle text="Description" className="text-black" />
              <p className="text-xs md:text-base 3xl:text-xl max-w-[535px] text-gray-700">
                {currentVehicle?.vehicleDescription}
              </p>
            </div>

            {/* Tracker Enabled */}
            <div className="space-y-5">
              <SectionTitle text="Tracker Enabled" />
              <div className="flex items-center gap-4">
                <Chip text="Yes" variant="filled" color="primary" radius="sm" />
                <Chip text="No" variant="outlined" color="dark" radius="sm" />
              </div>
            </div>

            {/* Is This Vehicle Insured? */}
            <div className="space-y-5">
              <SectionTitle text="Is This Vehicle Insured?" />
              <div className="flex items-center gap-4">
                <Chip text="Yes" variant="filled" color="light" radius="sm" />
                <Chip text="No" variant="outlined" color="dark" radius="sm" />
              </div>
            </div>

            {/* Self Drive Ability */}
            <div className="space-y-5">
              <SectionTitle text="Self Drive Ability" />
              <div className="flex items-center gap-4">
                <Chip text="Yes" variant="filled" color="primary" radius="sm" />
                <Chip text="No" variant="outlined" color="dark" radius="sm" />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="w-full md:w-[38%] md:border md:border-grey-200 md:rounded-[42px] p-8 space-y-6">
            <h4 className="text-h5 3xl:text-h4 !font-medium">Pricing</h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <PricingTitle text="Daily" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                    currentVehicle?.pricing?.dailyRate?.value || 0
                  )}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <PricingTitle text="Extra Hours" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                    currentVehicle?.pricing?.extraHoursFee || 0
                  )}`}
                />
              </div>
              <div className="flex items-center justify-between">
                <PricingTitle text="Driver" />
                <PricingDescription
                  text={`NGN ${formatNumberWithCommas(
                || 0
                  )}`}
                />
              </div>
              {currentVehicle?.pricing?.airportPickupFee && (
                <div className="flex items-center justify-between">
                  <PricingTitle text="Airport Pickups & dropoffs" />
                  <PricingDescription
                    text={`NGN ${formatNumberWithCommas(
                      currentVehicle?.pricing?.airportPickupFee || 0
                    )}`}
                  />
                </div>
              )}
            </div>

            {currentVehicle?.pricing?.discounts &&
              currentVehicle?.pricing?.discounts?.length > 0 && (
                <div className="space-y-2">
                  <PricingTitle text="Discounts" />
                  {currentVehicle.pricing.discounts.map((discount, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 bg-grey-75 border border-grey-300 p-2 rounded-lg text-sm md:text-xl md:text-h6"
                    >
                      <p>{discount?.durationInDays}+ days</p>
                      <p className="text-success-500">
                        {discount.percentage || 0}% off
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - "Upcoming Bookings" - Assuming this is part of a parent layout */}
      {/*
      <div className="w-[300px] bg-gray-50 p-4 border-l border-gray-200">
        <h4 className="text-lg font-semibold mb-4">Upcoming Bookings</h4>
        <p className="text-gray-500 text-sm">No Data Yet</p>
      </div>
      */}
    </div>
  );
}
