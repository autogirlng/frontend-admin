import { NextResponse } from "next/server";
import { Vehicle } from "@/types/vehicle";
import { FaCheckCircle } from "react-icons/fa";
import { BsFuelPump } from "react-icons/bs";
import { IoIosCar } from "react-icons/io";
import { MdAirlineSeatReclineExtra } from "react-icons/md";

export async function GET() {
  const vehicle: Vehicle = {
    id: "1",
    name: "Hyundai Tuscon 2018",
    make: "Hyundai",
    model: "Tuscon",
    year: 2018,
    color: "White",
    mainImage: "/images/car-main.jpg",
    gallery: [
      "/images/car-1.jpg",
      "/images/car-2.jpg",
      "/images/car-3.jpg",
      "/images/car-4.jpg",
    ],
    perks: [
      {
        icon: <FaCheckCircle className="text-green-600" />,
        text: "Driver Provided",
      },
      {
        icon: <BsFuelPump className="text-green-600" />,
        text: "20L Fuel Included",
      },
      { icon: <IoIosCar className="text-green-600" />, text: "Get Driver" },
      {
        icon: <MdAirlineSeatReclineExtra className="text-green-600" />,
        text: "Vehicle Insured",
      },
    ],
    features: ["All wheel drive", "Android Auto", "Apple CarPlay"],
    dailyRates: [{ label: "Daily (1-3 Days)", price: "NGN 20,000/day" }],
    discounts: [{ label: "3+ days", discount: "10% off" }],
    airportFee: "NGN 12,000",
    outskirts: ["Lagos", "Abuja", "Port Harcourt", "Ibadan"],
  };

  return NextResponse.json(vehicle);
}
