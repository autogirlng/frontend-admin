import { ReactNode } from "react";
import ImageGallery from "../components/core/ImageGallery";
import {
  FaGasPump,
  FaCheckCircle,
  FaUserShield,
  FaToolbox,
} from "react-icons/fa";
import { ImageAssets } from "../utils/ImageAssets";
import TipsCard from "../components/core/TipsCard";

// ✅ Static Vehicle Data
const vehicle = {
  mainImage: ImageAssets.authBg,
  gallery: [
    ImageAssets.authBg,
    ImageAssets.authBg,
    ImageAssets.authBg,
    ImageAssets.authBg,
    ImageAssets.authBg,
    ImageAssets.authBg,
  ],
  name: "Hyundai Tucson 2018",
  make: "Hyundai",
  model: "Tucson",
  year: "2018",
  color: "White",
  type: "SUV",
  capacity: "4",
  perks: [
    { icon: <FaGasPump />, text: "Fuel Provided" },
    { icon: <FaCheckCircle />, text: "Free Cancellation" },
    { icon: <FaUserShield />, text: "Insurance Included" },
    { icon: <FaToolbox />, text: "Vehicle Serviced" },
  ],
  features: ["Android Auto", "Apple CarPlay"],
  outskirts: ["Baggage", "Epe", "Ajah", "Ikeja", "Abeokuta"],
  dailyRates: [
    { label: "Daily (10 hrs)", price: "₦30,000" },
    { label: "Extra Hours", price: "₦2,000/hr" },
  ],
  discounts: [
    { label: "3+ days", discount: "10% off" },
    { label: "7+ days", discount: "20% off" },
  ],
  airportFee: "₦12,000",
};

export default function VehicleSummary() {
  return (
    <div className="container mx-auto">
      {/* ✅ Image Gallery */}
      <ImageGallery name={vehicle.name} gallery={vehicle.gallery} />

      <TipsCard tip="1 day minimum booking of vehicle" />
      {/* ✅ Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="container">
          <VehicleDetails
            details={[
              { label: "Make", value: vehicle.make },
              { label: "Model", value: vehicle.model },
              { label: "Year", value: vehicle.year },
              { label: "Color", value: vehicle.color },
              { label: "Type", value: vehicle.type },
              { label: "Seating Capacity", value: vehicle.capacity },
            ]}
          />
          <VehicleDescription
            description="2015 Toyota Camry with good fuel efficiency, spacious interior, and advanced safety features. Perfect for city driving 
          and long trips. Includes GPS, Bluetooth connectivity, and a sunroof."
          />

          {/* ✅ Perks & Features */}
          <PerksFeatures perks={vehicle.perks} features={vehicle.features} />

          {/* ✅ Outskirt Locations */}
          <OutskirtLocations locations={vehicle.outskirts} />
        </div>

        {/* ✅ Pricing Section */}
        <Pricing
          dailyRates={vehicle.dailyRates}
          discounts={vehicle.discounts}
          airportFee={vehicle.airportFee}
        />
      </div>
    </div>
  );
}

// -------------------------
// 🚗 Vehicle Details Component
// -------------------------
interface VehicleDetailsProps {
  details: { label: string; value: string }[];
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ details }) => {
  return (
    <>
      <h6 className="font-bold">Vehicle Details</h6>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className="text-nowrap text-black flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md"
          >
            {detail.label}: {detail.value}
          </div>
        ))}
      </div>
    </>
  );
};

// -------------------------
// 🚗 Vehicle Details Component
// -------------------------
interface VehicleDescriptionProps {
  description: string;
}

const VehicleDescription: React.FC<VehicleDescriptionProps> = ({
  description,
}) => {
  return (
    <>
      <h6 className="font-bold mb-1">Description</h6>
      <p>{description}</p>
    </>
  );
};

// -------------------------
// ✅ Perks & Features Component
// -------------------------
interface PerksFeaturesProps {
  perks: { icon: ReactNode; text: string }[];
  features: string[];
}

const PerksFeatures: React.FC<PerksFeaturesProps> = ({ perks, features }) => {
  return (
    <>
      {/* ✅ Perks */}
      <h2 className="text-lg font-semibold mt-6">Perks</h2>
      <div className="flex gap-1 mt-2 flex-wrap">
        {perks.map((perk, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-gray-100 px-3 py-0.5 rounded-md border border-gray-50"
          >
            {perk.icon} {perk.text}
          </div>
        ))}
      </div>

      {/* ✅ Features */}
      <h2 className="text-lg font-semibold mt-6">Features</h2>
      <div className="flex gap-3 mt-2 flex-wrap">
        {features.map((feature, idx) => (
          <span key={idx} className="bg-gray-100 px-3 py-1 w-full rounded-md">
            {feature}
          </span>
        ))}
      </div>
    </>
  );
};

// -------------------------
// ✅ Outskirt Locations Component
// -------------------------
interface OutskirtLocationsProps {
  locations: string[];
}

const OutskirtLocations: React.FC<OutskirtLocationsProps> = ({ locations }) => {
  return (
    <>
      <h2 className="text-lg font-semibold mt-6">Outskirt Locations</h2>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {locations.map((location, idx) => (
          <label
            key={idx}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md"
          >
            <input type="checkbox" className="accent-blue-600" /> {location}
          </label>
        ))}
      </div>
    </>
  );
};

// -------------------------
// 💰 Pricing Component
// -------------------------
interface PricingProps {
  dailyRates: { label: string; price: string }[];
  discounts: { label: string; discount: string }[];
  airportFee: string;
}

const Pricing: React.FC<PricingProps> = ({
  dailyRates,
  discounts,
  airportFee,
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-8">
      <h2 className="text-lg font-semibold">Pricing</h2>

      {/* ✅ Daily Rates */}
      {dailyRates.map((rate, idx) => (
        <div key={idx} className="flex justify-between mt-2">
          <span>{rate.label}:</span> <span>{rate.price}</span>
        </div>
      ))}

      {/* ✅ Discounts */}
      <h2 className="text-lg font-semibold mt-6">Discounts</h2>
      {discounts.map((discount, idx) => (
        <div key={idx} className="flex justify-between mt-2">
          <span>{discount.label}:</span> <span>{discount.discount}</span>
        </div>
      ))}

      {/* ✅ Airport Pickup Fee */}
      <div className="flex justify-between mt-4">
        <span>Airport Pickup:</span> <span>{airportFee}</span>
      </div>
    </div>
  );
};
