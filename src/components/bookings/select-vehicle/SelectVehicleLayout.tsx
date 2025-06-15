import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { ProgressBar } from "@/components/bookings/book-ride/ProgressBar"
import BackButton from "@/components/core/button/BackButton"
import Image from "next/image"
import {
    ChevronDown, Funnel, Search, MapPin,
    Info, ChevronLeft, ChevronRight,
    User, Settings, Fuel, Car
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useHttp } from "@/utils/useHttp"
import { useEffect, useState } from "react"
import { DriverStatus, ListingInformation } from "@/types"
import { useSearchParams } from 'next/navigation'

interface Vehicle {
    data: ListingInformation[];
    limit: number;
    page: number;
    totalCount: number;
    totalPages: number;
}

const SelectVehicleLayout = () => {
    const http = useHttp();
    const [vehicles, setVehicles] = useState<Vehicle>();
    const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});
    const [isHovered, setIsHovered] = useState<string>('');
    const [selectedVehicle, setSelectedVehicle] = useState<string>('')
    const router = useRouter();
    const searchParams = useSearchParams();


    const fetchVehicles = async () => {
        try {
            const data = await http.get<Vehicle>(`/listings?page=1&limit=10`);
            setVehicles(data);
        } catch (err) {
            console.log(err);
        }
    };

    const nextPage = () => {
        const oldParams = Object.fromEntries(searchParams.entries())
        const params = new URLSearchParams({ ...oldParams, selectedVehicleID: selectedVehicle }).toString()
        const nextPageURL = `/dashboard/booking/new-customer/book-ride/select-vehicle/booking-summary?${params}`
        router.push(nextPageURL)
    }
    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleImageChange = (vehicleId: string, direction: "next" | "prev", imagesLength: number) => {
        setImageIndexes((prev) => {
            const currentIndex = prev[vehicleId] || 0;
            let newIndex;
            if (direction === "next") {
                newIndex = (currentIndex + 1) % imagesLength;
            } else {
                newIndex = (currentIndex - 1 + imagesLength) % imagesLength;
            }
            return {
                ...prev,
                [vehicleId]: newIndex,
            };
        });
    };

    const selectVehicle = (id: string) => {
        setSelectedVehicle(id);
    }
    return (
        <DashboardLayout title="Select Vehicle" currentPage="">
            <BackButton />
            <ProgressBar headerText="Select Vehicle" />

            <section className="h-[100vh] overflow-auto">
                <h1 className="font-bold">{vehicles?.totalCount} Vehicles Available</h1>

                {vehicles?.data.map((vehicle) => {
                    const vehicleImages = [
                        vehicle.VehicleImage.frontView,
                        vehicle.VehicleImage.sideView1,
                        vehicle.VehicleImage.sideView2,
                        vehicle.VehicleImage.backView,
                        vehicle.VehicleImage.interior,
                        vehicle.VehicleImage.other
                    ];

                    const currentImage = vehicleImages[imageIndexes[vehicle.id ?? ""] || 0];

                    return (
                        <div
                            onMouseEnter={() => setIsHovered(vehicle.id || '')}
                            onMouseLeave={() => setIsHovered('')}
                            key={vehicle.id}
                            className="flex w-full rounded-xl cursor-pointer overflow-hidden my-8"
                            onClick={() => selectVehicle(vehicle.id || '')}
                        >
                            {/* Left Section: Image Carousel */}
                            <div className="relative" style={{ width: '293px', height: '200px' }}>
                                <Image
                                    src={currentImage}
                                    alt={`${vehicle.listingName} view`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-l-lg transition-all duration-300"
                                />

                                <div className="absolute top-4 left-4 bg-white text-black font-bold text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                                    <MapPin strokeWidth={3} className="h-3 w-3 font-bold" />
                                    <span>{vehicle.location}</span>
                                </div>

                                <div className="absolute bottom-4 left-4 bg-white text-black text-xs px-3 py-1 rounded-full">
                                    {((imageIndexes[vehicle.id ?? ""] ?? 0) + 1)}/{vehicleImages.length}
                                </div>

                                <div className="absolute bottom-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleImageChange(vehicle.id ?? "", "prev", vehicleImages.length)}
                                        className="bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleImageChange(vehicle.id ?? "", "next", vehicleImages.length)}
                                        className="bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-all duration-200"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Right Section: Details */}
                            <div className={`flex flex-row justify-between border border-l-0 rounded-lg  rounded-tl-none rounded-bl-none ${isHovered === vehicle.id || selectedVehicle === vehicle.id ? 'border-[#1e93ff] bg-[#edf8ff]' : 'border-[#e4e7ec]'}`}>
                                <div className="py-6 px-3 flex flex-row justify-between">
                                    <div className="border-r border-[#e4e7ec]">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                            {vehicle.listingName}
                                        </h2>

                                        {/* Pricing */}
                                        <div className="flex items-center space-x-6 mb-6">
                                            <div className="flex flex-col border-r border-[#e4e7ec] text-sm">
                                                <span className="flex flex-row text-[#344054]">Daily <Info size={18} color="#667185" className="ms-[2px]" /></span>
                                                <span className="font-bold mt-2 mr-2 text-[#344054]">
                                                    NGN {vehicle.pricing.dailyRate.value}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-sm justify-start">
                                                <span className="flex flex-row text-[#344054]">Extra Hours <Info size={18} color="#667185" className="ms-[2px]" /></span>
                                                <span className="font-bold mt-2 mr-3 text-[#344054]">
                                                    NGN {vehicle.pricing.extraHoursFee}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Car Info */}
                                        <div className="flex flex-row text-gray-600 text-xs mx-2">
                                            <span>{vehicle.vehicleType}</span>
                                            <span className="mx-1 text-[#d9d9d9]">&bull;</span>
                                            <span className="text-[#1e93ff]">
                                                {vehicle.user.firstName} {vehicle.user.lastName}
                                            </span>
                                            <span className="mx-2 text-[#d9d9d9]">&bull;</span>
                                            <span className="text-[#0aaf24] font-medium">Available</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row items-center justify-center">
                                    <div className="text-xs text-start">
                                        <div>
                                            <span className={`inline-flex items-center ${isHovered === vehicle.id ? 'bg-[#d6edff]' : 'bg-[#f7f9fc]'} gap-2 border border-[#e4e7ec] rounded-md p-2 me-3`}>
                                                <User className="h-4 w-4" />
                                                <span>Driver available: {vehicle.tripSettings.provideDriver ? "Yes" : "No"}</span>
                                            </span>
                                            <span className={`inline-flex items-center ${isHovered === vehicle.id ? 'bg-[#d6edff]' : 'bg-[#f7f9fc]'} gap-2 border border-[#e4e7ec] rounded-md p-2 me-3`}>
                                                <Fuel className="h-4 w-4" />
                                                <span>Fuel Available: {vehicle.tripSettings.fuelProvided ? "Yes" : "No"}</span>
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <span className={`inline-flex items-center ${isHovered === vehicle.id ? 'bg-[#d6edff]' : 'bg-[#f7f9fc]'} gap-2 border border-[#e4e7ec] rounded-md p-2 me-3`}>
                                                <Car className="h-4 w-4" />
                                                <span>Seats: {vehicle.numberOfSeats}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            <div className="mt-auto w-full flex justify-end pt-8">
                <button
                    onClick={nextPage}
                    className={`px-6 py-2 flex items-center ${selectedVehicle.length !== 0 ? 'bg-[#0673ff]' : 'bg-[#797f8b]'} justify-center text-sm me-5 mb-5 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200`}
                    disabled={selectedVehicle.length === 0}
                >
                    Next <ChevronRight />
                </button>
            </div>
        </DashboardLayout>
    );
};

export { SelectVehicleLayout };
