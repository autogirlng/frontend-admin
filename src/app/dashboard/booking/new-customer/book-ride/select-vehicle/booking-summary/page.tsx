'use client'
import React, { useState, useRef, useEffect, FC, ReactNode, RefObject } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BackButton from '@/components/core/button/BackButton';
import { ProgressBar } from '@/components/bookings/book-ride/ProgressBar';
import { ChevronDown, Flag, MapPin, SquareArrowUpRight, ChevronLeftIcon, ChevronRightIcon, Sparkle, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useHttp } from '@/utils/useHttp';
import { ListingInformation, User, BookingPricing } from '@/types';
import { Booking } from '@/utils/types';

interface AccordionDataItem {
    id: string;
    title: string;
    content: ReactNode;
}

interface AccordionItemProps {
    id: string;
    title: string;
    children: ReactNode;
    openItem?: string | null;
    setOpenItem?: React.Dispatch<React.SetStateAction<string | null>>;
    contentRef?: (element: HTMLElement | null) => void;
    containerClasses?: string;
}

const AccordionItem: FC<AccordionItemProps> = ({ id, title, children, openItem, setOpenItem, contentRef, containerClasses }) => {
    const isTopLevel = setOpenItem !== undefined;
    const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
    const isOpen = isTopLevel ? openItem === id : internalIsOpen;

    const toggleOpen = (): void => {
        if (isTopLevel && setOpenItem) {
            setOpenItem(isOpen ? null : id);
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
    };

    return (
        <div className={`${containerClasses} rounded-2xl mt-3`}>
            <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none bg-white hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleOpen}
            >
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <ChevronDown
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    size={16}
                />
            </button>
            <div
                ref={isTopLevel && contentRef ? contentRef : null}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
                style={{
                    maxHeight: isOpen ? '2000px' : '0px',
                }}
            >
                {children}
            </div>
        </div>
    );
};

const BookingSummary = () => {
    const params = useSearchParams();
    const http = useHttp();
    const router = useRouter();
    const [vehicle, setVehicle] = useState<ListingInformation>();
    const [vehicleImages, setVehicleImages] = useState<string[]>([]);
    const [openTopLevelItem, setOpenTopLevelItem] = useState<string | null>('vehicle-details');
    const topLevelContentRefs: RefObject<Record<string, HTMLElement | null>> = useRef({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [customerDetails, setCustomerDetails] = useState<User>()
    const [bookingPrice, setBookingPrice] = useState<BookingPricing>()
    const [areasOfUse, setAreasOfUse] = useState<string[]>([])
    const [outskirtLocations, setOutskirtLocations] = useState<string[]>();
    const [extraDetails, setExtraDetails] = useState<string>();
    const [tripPurpose, setTripPurpose] = useState<string>()
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        // Get hours & minutes in local time
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        // Ordinal suffix (1st, 2nd, 3rd, etc.)
        const getOrdinal = (n: number) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${getOrdinal(day)} ${month} ${year} | ${hours}:${minutes}${ampm}`;
    }

    const fetchDetails = async () => {
        try {
            const data = await http.get<ListingInformation>(`/vehicle-onboarding/${params.get('selectedVehicleID')}`);
            const customer = await http.get<User>(`/user/admin/${params.get('customerID')}`)
            const startDate = new Date(`${params.get("pickupDate")}T${params.get("pickupTime")}`).toISOString()
            const endDate = new Date(`${params.get("dropOffDate")}T${params.get("dropOffTime")}`).toISOString()


            const areaOfUse = params.get("areaOfUse")
            const outskirtsLocations = params.get("stops")?.split(",")
            const details = params.get("extraDetails");
            const purpose = params.get("purposeOfRide")

            const bookingPrices = await http.post<BookingPricing>('/bookings/calculate-price', { startDate, endDate, vehicleId: data?.id })
            const images = [
                data?.VehicleImage.frontView || '',
                data?.VehicleImage.backView || '',
                data?.VehicleImage.interior || '',
                data?.VehicleImage.other || '',
                data?.VehicleImage.sideView1 || '',
                data?.VehicleImage.sideView2 || ''
            ].filter(img => img);

            setStart(formatDate(startDate))
            setEnd(formatDate(endDate))
            setVehicle(data);
            setCustomerDetails(customer);
            setBookingPrice(bookingPrices)
            setVehicleImages(images);
            setAreasOfUse([`${areaOfUse}`])
            setOutskirtLocations(outskirtsLocations)
            setExtraDetails(details || '');
            setTripPurpose(purpose || '')

        } catch (error) {
            console.error('Error fetching vehicle details:', error);
        }
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicleImages.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicleImages.length) % vehicleImages.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    useEffect(() => {
        if (openTopLevelItem && topLevelContentRefs.current[openTopLevelItem]) {
            setTimeout(() => {
                topLevelContentRefs.current[openTopLevelItem]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }, 300);
        }
    }, [openTopLevelItem]);

    const accordionData: AccordionDataItem[] = [
        {
            id: 'vehicle-details',
            title: 'Vehicle Details',
            content: (
                <div className="p-4 text-gray-700">
                    <h2 className='font-bold text-md mb-3'>{vehicle?.listingName}</h2>
                    <div className="w-full max-w-4xl mx-auto p-4 rounded-xl font-inter">
                        {vehicleImages.length > 0 ? (
                            <>
                                <div className="relative mb-4 flex justify-center items-center overflow-hidden rounded-2xl" style={{ height: '400px' }}>
                                    <Image
                                        src={vehicleImages[currentIndex]}
                                        alt={`Vehicle image ${currentIndex + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-2xl"
                                        unoptimized={true}
                                    />

                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 z-10"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 z-10"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>

                                    <div className="absolute bottom-4 left-4 bg-white text-black text-sm px-5 py-2 rounded-full select-none">
                                        {currentIndex + 1} / {vehicleImages.length}
                                    </div>
                                </div>

                                <div className="flex justify-center items-center space-x-1  py-2 scrollbar-hide">
                                    {vehicleImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 cursor-pointer border-3 rounded-lg overflow-hidden transition-all duration-300
                                                ${index === currentIndex ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-blue-400'}
                                            `}
                                            onClick={() => goToSlide(index)}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={100}
                                                height={50}
                                                objectFit="cover"
                                                className="rounded-md"
                                                unoptimized={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="relative mb-4 flex justify-center items-center overflow-hidden rounded-2xl bg-gray-200" style={{ height: '400px' }}>
                                <div className="text-gray-500">Loading images...</div>
                            </div>
                        )}

                        <div className='flex flex-start flex-col'>
                            <h2 className='text-sm font-bold'>Vehicle Details</h2>
                            <div className='flex flex-wrap gap-x-1 gap-y-2 mt-3'>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Make: {vehicle?.make}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Model: {vehicle?.model}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Year: {vehicle?.yearOfRelease}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Colour: {vehicle?.vehicleColor}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>City: {vehicle?.location}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Vehicle type: {vehicle?.vehicleType}</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Seating Capacity: {vehicle?.numberOfSeats}</span>
                            </div>
                        </div>
                        <div className='mt-2'>
                            <h2 className='text-sm font-bold'>Description</h2>
                            <p className='mt-1 text-sm'>{vehicle?.vehicleDescription}</p>
                        </div>
                        <div className='flex flex-start flex-col mt-2'>
                            <h2 className='text-sm font-bold'>Perks</h2>
                            <div className='flex flex-wrap gap-x-1 gap-y-2 mt-3'>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Driver Provided</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>20: ltrs Fuel Included</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Free Cancellation <Link href="#">Learn More</Link></span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Self Drive</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Vehicle Insured</span>
                                <span className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>Tracker Enabled</span>
                            </div>
                        </div>

                        <div className='flex flex-start flex-col mt-2'>
                            <h2 className='text-sm font-bold'>Features</h2>
                            <div className='flex flex-wrap gap-x-1 gap-y-2 mt-3'>
                                {vehicle?.features?.map((feature, index) => (
                                    <span key={index} className='bg-[#f0f2f5] rounded-md text-sm p-2 me-2'>{feature}</span>
                                ))}
                            </div>
                        </div>

                        <AccordionItem
                            id="outskirtsLocations"
                            title={`Outskirt Locations - ₦${vehicle?.outskirtsPrice}/hr`}
                        >
                            <div className="flex text-sm flex-wrap gap-5 p-4">
                                {vehicle?.outskirtsLocation?.map((outskirtLocation, index) => (
                                    <div key={index} className='text-gray-700 flex items-start'>
                                        <MapPin size={22} />
                                        <span className="ml-1">{outskirtLocation}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>

                        <AccordionItem id='hostDetails' title='Host Details'>
                            <div className='rounded-full px-1 flex flex-row border border-[#c3c8d0]'>
                                <div className='my-1 flex flex-row w-1/3 items-center border-r border-[#c3c8d0]'>
                                    <span className='p-5 bg-black text-white rounded-full '>MJ</span>
                                    <span className='ms-2 text-sm'>
                                        <h3>Host Name</h3>
                                        <p className='font-bold'>Mamudu Jeffery</p>
                                    </span>
                                </div>
                                <div className='my-1 ms-2 flex flex-col w-1/3 items-center border-r border-[#c3c8d0]'>
                                    <p className='text-sm mt-2'>Rating</p>
                                    <span className='font-bold flex flex-wrap text-md gap-1'>
                                        <Sparkle fill='#dd900d' color="#dd900d" /> 4.5
                                    </span>
                                </div>
                                <div className='my-1 flex flex-row w-1/3 items-center'>
                                    <span className='ms-2 '>
                                        <h3 className='text-sm'>No of Completed Rides</h3>
                                        <p className='font-bold'>20k</p>
                                    </span>
                                </div>
                            </div>
                            {/* Reviews and Ratings */}
                            <div className="bg-white rounded-lg mt-3 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                            <Image
                                                src={'/images/profile.jpeg'}
                                                alt={'userName'}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Aisha 0</p>
                                            <p className="text-xs text-gray-500">June 5, 2024 | 2:30pm</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 ">
                                        <Star fill='#f5b546' size={20} color='#f5b546' />
                                        <Star fill='#f5b546' size={20} color='#f5b546' />
                                        <Star fill='#f5b546' size={20} color='#f5b546' />
                                        <Star fill='#f5b546' size={20} color='#f5b546' />
                                        <Star size={20} />
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus sequi veritatis nam asperiores illum odio voluptates, unde dolores veniam iste amet. Illum accusantium in distinctio necessitatibus quos fuga illo eum!
                                </p>
                            </div>
                        </AccordionItem>
                    </div>
                </div>
            ),
        },
        {
            id: 'trip-details',
            title: 'Trip Details',
            content: (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-start items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Trip Details</h3>
                        <button className="flex items-center px-4 py-1 ms-3 bg-[#f0f2f5] rounded-full text-sm text-gray-600 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.452 3.551M9 12l6.452-3.551M12 21a9 9 0 110-18 9 9 0 010 18zm-4.684-2.658A3 3 0 1012 15h.001l6.452 3.551M12 9a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                            Share
                        </button>
                    </div>

                    <AccordionItem
                        id="prices"
                        title="Prices"
                    >
                        <div className="flex text-sm justify-start bg-white p-4">
                            <div className="border-r border-[#e4e7ec] me-3 px-3">
                                <p className="text-sm text-gray-500">Daily</p>
                                <p className="font-bold text-gray-900">NGN {vehicle?.pricing?.dailyRate?.value}/day</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Extra hours</p>
                                <p className="font-bold text-gray-900">NGN {vehicle?.pricing?.extraHoursFee}/hr</p>
                            </div>
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        id="duration"
                        title="Duration"
                    >
                        <div className="p-4 bg-white text-sm">
                            <div className="flex items-center mb-2">
                                <span className="bg-[#101928] text-white text-xs font-semibold px-5 py-1 rounded-full mr-2">2 days</span>
                            </div>
                            <div className="flex items-center mb-1 mt-3 ">
                                <p className=" text-gray-700 flex items-start">
                                    <Flag size={20} color={"#0673ff"} />
                                    <span className="ml-1">Start</span>
                                </p>
                                <p className="ml-auto text-gray-700">{start}</p>
                            </div>
                            <div className="flex items-center">
                                <p className=" text-gray-700 flex items-start">
                                    <MapPin size={20} color={"#0aaf24"} />
                                    <span className="ml-1">Stop</span>
                                </p>
                                <p className="ml-auto text-gray-700">{end}</p>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        id="itinerary"
                        title="Itinerary"
                    >
                        <div className="p-4 bg-white text-sm">
                            <div className="flex items-start mb-4">
                                <div>
                                    <p className=" text-gray-700 flex items-start">
                                        <MapPin size={22} />
                                        <span className="ml-1">Pick-up</span>
                                    </p>
                                    <p className="text-sm mt-1 text-gray-500">{params.get("pickupLocation")}</p>
                                </div>
                                <button className="ml-auto text-[#0673ff] flex items-start text-sm ">
                                    <SquareArrowUpRight size={20} color="#0673ff" className="me-1" />
                                    View Location
                                </button>
                            </div>

                            <div className="flex items-start mb-4">
                                <div>
                                    <p className=" text-gray-700 flex items-start">
                                        <MapPin size={22} />
                                        <span className="ml-1">Drop-off</span>
                                    </p>
                                    <p className="text-sm mt-1 text-gray-500">{params.get("dropOffLocation")}</p>
                                </div>
                                <button className="ml-auto text-[#0673ff] flex items-start text-sm ">
                                    <SquareArrowUpRight size={20} color="#0673ff" className="me-1" />
                                    View Location
                                </button>
                            </div>

                            <div className="bg-white rounded-lg">
                                <p className="text-gray-700 font-medium mb-2">Areas of use</p>
                                {
                                    areasOfUse.map((area, index) => {
                                        return <p key={index} className="text-gray-500">{area}</p>

                                    })
                                }
                            </div>

                            <div className="bg-white rounded-lg">
                                <p className="text-gray-700 font-medium mb-2 mt-3">Outskirt Locations</p>
                                {outskirtLocations?.map((outskirtLocation) => {
                                    return <p className='text-gray-500'>{outskirtLocation}</p>
                                })}

                            </div>
                        </div>
                    </AccordionItem>
                    {
                        (extraDetails && extraDetails.length > 0) || (tripPurpose && tripPurpose.length > 0) ?
                            <AccordionItem
                                id="extras"
                                title="Extra Details"
                            >
                                <div className="p-1 px-4 bg-white text-sm">
                                    {
                                        extraDetails && <div className='bg-white rounded-lg'>
                                            <h2 className="text-gray-700 font-medium mb-2">Extra Details</h2>
                                            <p>{extraDetails}</p>
                                        </div>
                                    }
                                    {
                                        tripPurpose && <div className="bg-white rounded-lg mt-3 mb-2">
                                            <h2 className="text-gray-700 font-medium mb-2">Trip Purpose</h2>
                                            <p>{tripPurpose}</p>
                                        </div>
                                    }

                                </div>
                            </AccordionItem> : <></>
                    }

                </div>
            ),
        },
    ];

    return (
        <DashboardLayout title="Booking Summary" currentPage="">
            <BackButton />
            <ProgressBar headerText="Booking Summary" page={"bookingSummary1"} />
            <div className='flex flex-row'>
                <div className="bg-gray-100 flex flex-col items-start justify-start font-sans">
                    <div className="w-full max-w-2xl">
                        {accordionData.map((item) => (
                            <AccordionItem
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                openItem={openTopLevelItem}
                                setOpenItem={setOpenTopLevelItem}
                                contentRef={(el) => (topLevelContentRefs.current[item.id] = el)}
                                containerClasses="bg-[#f9fafb] border border-[#e4e7ec] overflow-hidden mb-4"
                            >
                                {item.content}
                            </AccordionItem>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col items-center mx-5'>
                    <div className="bg-white ms-2 p-6 rounded-lg w-full mt-3 border border-[#e4e7ec] h-fit">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Info</h3>
                        <div className="space-y-4 border-t border-[#e4e7ec]">
                            <div className="flex flex-row mt-3 justify-between">
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-base text-gray-800 font-sm">{customerDetails?.firstName} {customerDetails?.lastName}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-base text-gray-800 font-sm">{customerDetails?.email}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm text-gray-500 me-5">Phone Number</p>
                                <p className="text-base text-gray-800 font-sm">{customerDetails?.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white ms-2 p-6 rounded-lg w-full mt-3 shadow-md border border-[#e4e7ec] h-fit">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
                        <div className="space-y-4 ">
                            <div className="flex flex-row justify-between">
                                <p className="text-sm text-gray-500">Total Cost</p>
                                <p className="text-base text-gray-800 font-medium">NGN {bookingPrice?.totalPrice}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm text-gray-500">Extra hours</p>
                                <p className="text-base text-[#98a2b3] font-sm">NGN {bookingPrice?.breakdown.extraHoursFee}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-sm text-gray-500">Discount </p>
                                <p className="text-base text-gray-800 font-medium">NGN {bookingPrice?.breakdown.discountAmount}</p>
                            </div>
                            <div className="flex flex-row border-t border-b border-[#e4e7ec] py-3 justify-between">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-base text-black font-medium">NGN {bookingPrice?.totalPrice}</p>
                            </div>
                            <p className='text-xs text-[#0673ff]'>Learn more about our free cancellation</p>
                            <button className='w-full border text-sm border-[#101928] rounded-full px-3 py-2 hover:bg-black hover:text-white'>Save Booking</button>
                            <button onClick={() => router.push('/dashboard/booking/new-customer/book-ride/select-vehicle/booking-summary/payment-confirmation')} className='w-full text-white text-sm rounded-full px-3 py-2 bg-[#0673ff] hover:shadow-md'>Proceed Payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookingSummary;