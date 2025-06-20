import React, { useState, useEffect, } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BackButton from '@/components/core/button/BackButton';
import { ProgressBar } from '@/components/bookings/book-ride/ProgressBar';
import { Flag, MapPin, Copy } from 'lucide-react';

import { Carousel } from '@/components/bookings/Carousel';
import { useSearchParams } from 'next/navigation';
import { useHttp } from '@/utils/useHttp';
import { ListingInformation, User } from '@/utils/types';
import { BookingPricing } from '@/types';
import { toast } from "react-toastify";
import { formatDate, hoursBetweenISOStrings } from '@/utils/formatDate';


interface PaymentPayload {
    transactionReference: string;
    paymentReference: string;
    merchantName: string;
    apiKey: string;
    redirectUrl: string;
    enabledPaymentMethod: Array<"CARD" | "ACCOUNT_TRANSFER" | string>;
    checkoutUrl: string;
    metaData: {
        transactionId: string;
    };
    booking: {
        id: string;
        startDate: string;
        endDate: string;
        duration: number;
        bookingType: string;
        amount: number;
        paymentStatus: string;
        paymentMethod: string;
        rentalAgreement: string | null;
        bookingStatus: string;
        isForSelf: boolean;
        guestName: string | null;
        guestEmail: string | null;
        guestPhoneNumber: string;
        pickupLocation: string;
        dropoffLocation: string;
        emergencyContact: string | null;
        userEmail: string | null;
        userPhoneNumber: string | null;
        userCountry: string;
        countryCode: string;
        specialInstructions: string | null;
        paymentLink: string | null;
        outskirtsLocation: string[];
        areaOfUse: string;
        extraDetails: string;
        purposeOfRide: string | null;
        tripPurpose: string | null;
        secondaryPhoneNumber: string;
        currencyCode: string;
        vehicleId: string;
        userId: string;
        hostId: string;
        version: number;
        createdAt: string; // ISO Date
        updatedAt: string; // ISO Date
        travelCompanions: string[];
    };
};

enum BookingType {
    SINGLE_DAY = "SINGLE_DAY",
    MULTI_DAY = "MULTI_DAY"
}

interface BookingPayload {
    amount: number;
    areaOfUse: string;
    bookingType: BookingType,
    country: string;
    countryCode: string;
    currencyCode: string;
    dropoffLocation: string;
    duration: number;
    endDate: string;
    extraDetails: string;
    guestEmail: string;
    guestName: string;
    guestPhoneNumber: string;
    isForSelf: boolean;
    outskirtsLocation: string[];
    pickupLocation: string;
    purposeOfRide: string;
    secondaryPhoneNumber: string;
    startDate: string;
    redirectUrl: string;
}
interface IVehicleAvailable {
    vehicalId: string,
    isAvailable: boolean,
    startDate: string,
    endDate: string
}

const BookingSummaryPaymentLayout = () => {

    const params = useSearchParams();
    const http = useHttp();
    const [images, setImages] = useState<string[]>()
    const [vehicle, setVehicle] = useState<ListingInformation>()
    const [bookingPrice, setBookingPrice] = useState<BookingPricing>()
    const [paymentLink, setPaymentLink] = useState<string>('');
    const [bookingData, setBookingData] = useState<BookingPayload>()
    const [copy, setCopy] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('')


    const fetchDetails = async () => {
        const data = await http.get<ListingInformation>(`/vehicle-onboarding/${params.get('selectedVehicleID')}`);
        const startDate = new Date(`${params.get("pickupDate")}T${params.get("pickupTime")}`).toISOString()
        const endDate = new Date(`${params.get("dropOffDate")}T${params.get("dropOffTime")}`).toISOString()
        const bookingPrices = await http.post<BookingPricing>('/bookings/calculate-price', { startDate, endDate, vehicleId: data?.id })
        const customer = await http.get<User>(`/user/admin/${params.get("customerID")}`)
        const images = [
            data?.VehicleImage.frontView || '',
            data?.VehicleImage.backView || '',
            data?.VehicleImage.interior || '',
            data?.VehicleImage.other || '',

        ].filter(img => img);


        setImages(images)
        setVehicle(data)
        setBookingPrice(bookingPrices)

        const bookingData = {
            amount: bookingPrices?.totalPrice || 0,
            areaOfUse: params.get("areaOfUse") || '',
            bookingType: hoursBetweenISOStrings(startDate, endDate) > 1 ? BookingType.MULTI_DAY : BookingType.SINGLE_DAY,
            country: "NG",
            countryCode: "+234",
            currencyCode: "NGN",
            dropoffLocation: params.get("dropOffLocation") || '',
            duration: 1,
            endDate: endDate,
            extraDetails: params.get("extraDetails") || '',
            guestEmail: customer?.email || '',
            guestName: `${customer?.firstName} ${customer?.lastName}`,
            guestPhoneNumber: customer?.phoneNumber || '',
            isForSelf: false,
            outskirtsLocation: params.get("stops")?.split(",") || [],
            pickupLocation: params.get("pickupLocation") || '',
            purposeOfRide: params.get("purposeOfRide") || '',
            secondaryPhoneNumber: "",
            startDate: startDate,
            redirectUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/dashboard/booking/new-customer/book-ride/select-vehicle/booking-summary/payment-confirmation/success`
        }

        setStartDate(startDate)
        setEndDate(endDate)

        setBookingData(bookingData);


    }

    const createPaymentTicket = async () => {
        const vehicalAvailable = await http.get<IVehicleAvailable>(`/bookings/check-availability?vehicleId=${params.get("selectedVehicleID")}&startDate=${startDate}&endDate=${endDate}`)
        console.log(vehicalAvailable)
        if (vehicalAvailable?.isAvailable) {
            const ticket = await http.post<PaymentPayload>(`/bookings/create/${params.get("selectedVehicleID")}`, bookingData)

            if (ticket) {
                setPaymentLink(ticket.checkoutUrl)
            }
        } else {
            toast.error("Vehicle not available")
        }
    }

    const copyPaymentLink = () => {
        navigator.clipboard.writeText(paymentLink).then(() => {
            setCopy(true);
            setTimeout(() => {
                setCopy(false)
            }, 2000)
        })
    }

    useEffect(() => {
        fetchDetails()

    }, [])

    return <>
        <DashboardLayout title="Booking Summary" currentPage="">
            <BackButton />
            <ProgressBar headerText="Booking Summary" page="bookingSummary1" />
            <div className='flex flex-row justify-between'>
                <div className='w-1/2 bg-[#f0f2f5]'>
                    <div className="p-4 text-gray-700">
                        <h2 className='font-bold text-md mb-3'>{vehicle?.listingName}</h2>
                        {images && <Carousel vehicleImages={images} />}
                        <div className='w-full bg-white flex p-3 flex-col gap-y-2'>
                            <div className='flex flex-row flex-between justify-between'>
                                <h2>Duration</h2>
                                {/* <button className='px-4 py-1 text-sm border cursor-pointer hover:bg-black hover:text-white border-black rounded-full'>Edit Dates</button> */}
                            </div>
                            <div className='flex'>
                                <p className='bg-black text-white rounded-full px-3 text-sm py-1'>
                                    {hoursBetweenISOStrings(startDate, endDate)}  days
                                </p>
                            </div>

                            <div className="text-sm">

                                <div className="flex items-center mb-1 mt-3 ">
                                    <p className=" text-gray-700 flex items-start">
                                        <Flag size={20} color={"#0673ff"} />
                                        <span className="ml-1">Start</span>
                                    </p>
                                    <p className="ml-auto text-gray-700">{formatDate(startDate)}</p>
                                </div>
                                <div className="flex items-center">

                                    <p className=" text-gray-700 flex items-start">
                                        <MapPin size={20} color={"#0aaf24"} />
                                        <span className="ml-1">Stop</span>
                                    </p>
                                    <p className="ml-auto text-gray-700">{formatDate(endDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-1/2 flex items-center gap-y-2 justify-center flex-col'>
                    <p className="text-[27px] font-bold text-[#344054]">This is The Last Step</p>
                    <p className="text-sm text-[#667185]">Pay to confirm booking</p>
                    <p className='font-bold'>Pay NGN {Number(bookingPrice?.totalPrice.toFixed(2)) || 0}</p>


                    {
                        paymentLink.length > 0 ? <div
                            className="px-4 py-4 text-xs bg-[#edf8ff] rounded-full text-[#0673ff] w-[230px] flex items-center justify-between gap-x-2"
                        >
                            <span className="truncate overflow-hidden whitespace-nowrap flex-1">
                                {paymentLink}
                            </span>

                            <button
                                onClick={copyPaymentLink}
                                className="bg-[#1e93ff] text-white px-2 py-1 font-bold rounded-full flex items-center gap-x-1">
                                <Copy className="w-4 h-4" />
                                {copy ? "Copied!" : "Copy"}
                            </button>
                        </div> : <button onClick={createPaymentTicket} className="py-5 px-12 text-xs bg-[#0673ff] rounded-full text-white hover:shadow-md">
                            Create Payment Ticket
                        </button>
                    }

                    {/* <button className="border-0 text-xs  mt-2 text-[#0673ff] ">
                        Confirm Payment
                    </button> */}
                    {/* <p className="text-[#667185] text-xs mt-40">You can cancel this ride on or before 48hrs to the trip.
                        <span className='text-[#0673ff]'>View Policy</span></p> */}
                </div>


            </div>

        </DashboardLayout>
    </>
}

export { BookingSummaryPaymentLayout }