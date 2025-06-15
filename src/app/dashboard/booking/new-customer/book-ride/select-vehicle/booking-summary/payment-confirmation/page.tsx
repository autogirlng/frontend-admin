'use client'
import React, { useState, useRef, useEffect, FC, ReactNode, RefObject } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BackButton from '@/components/core/button/BackButton';
import { ProgressBar } from '@/components/bookings/book-ride/ProgressBar';
import { ChevronDown, Flag, MapPin, SquareArrowUpRight, ChevronLeftIcon, ChevronRightIcon, Sparkle, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';




const images = [
    {
        id: 1,
        src: '/images/mailbox.png', // Path to your main image
        thumbnailSrc: '/images/mailbox.png', // Path to your thumbnail (can be the same or smaller version)
        alt: 'Silver Toyota Corolla exterior front view',
    },
    {
        id: 2,
        src: '/images/profile.jpeg',
        thumbnailSrc: '/images/profile.jpeg',
        alt: 'Car interior dashboard view',
    },
    {
        id: 3,
        src: '/images/mailbox.png',
        thumbnailSrc: '/images/mailbox.png',
        alt: 'Car rear view',
    },
    // Add more images as needed based on your carousel example

];

const BookingSummary = () => {

    // State to manage which top-level accordion item is currently open for scrolling
    const [openTopLevelItem, setOpenTopLevelItem] = useState<string | null>('vehicle-details');

    // Ref to store references to each top-level accordion content element for scrolling
    // Using Record<string, HTMLElement | null> to map IDs to HTML elements
    const topLevelContentRefs: RefObject<Record<string, HTMLElement | null>> = useRef({});

    // Data structure for the main accordion items with explicit type
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const currentImage = images[currentIndex];

    return <>
        <DashboardLayout title="Booking Summary" currentPage="">
            <BackButton />
            <ProgressBar headerText="Booking Summary" />
            <div className='flex flex-row justify-between'>
                <div className='w-1/2 bg-[#f0f2f5]'>
                    <div className="p-4 text-gray-700">
                        <h2 className='font-bold text-md mb-3'>Toyota Corolla 2015</h2>
                        <div className="w-full max-w-4xl mx-auto p-4  rounded-xl font-inter">
                            <div className="relative mb-4 flex justify-center items-center overflow-hidden rounded-2xl" style={{ height: '400px' }}>
                                <Image
                                    src={currentImage.src}
                                    alt="Toyota Corolla"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-2xl"
                                />

                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full  hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeftIcon className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full  hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRightIcon className="h-6 w-6" />
                                </button>

                                <div className="absolute bottom-4 left-4 bg-white text-black text-sm px-5 py-2 rounded-full  select-none">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            </div>

                            <div className="flex justify-center items-center space-x-3 overflow-x-auto py-2 scrollbar-hide">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`flex-shrink-0 cursor-pointer border-3 rounded-lg overflow-hidden transition-all duration-300
              ${index === currentIndex ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-blue-400'}
            `}
                                        onClick={() => goToSlide(index)}
                                    >
                                        <Image
                                            src={image.thumbnailSrc}
                                            alt={`Thumbnail for ${image.alt}`}
                                            width={100}
                                            height={50}
                                            objectFit="cover"
                                            className="rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>


                        </div>

                        <div className='w-full bg-white flex p-3 flex-col gap-y-2'>
                            <div className='flex flex-row flex-between justify-between'>
                                <h2>Duration</h2>
                                <button className='px-4 py-1 text-sm border cursor-pointer hover:bg-black hover:text-white border-black rounded-full'>Edit Dates</button>
                            </div>
                            <div className='flex'>
                                <p className='bg-black text-white rounded-full px-3 text-sm py-1'> 2 days</p>
                            </div>

                            <div className="text-sm">

                                <div className="flex items-center mb-1 mt-3 ">
                                    <p className=" text-gray-700 flex items-start">
                                        <Flag size={20} color={"#0673ff"} />
                                        <span className="ml-1">Start</span>
                                    </p>
                                    <p className="ml-auto text-gray-700">14th Aug 2024 | 10:30AM</p>
                                </div>
                                <div className="flex items-center">

                                    <p className=" text-gray-700 flex items-start">
                                        <MapPin size={20} color={"#0aaf24"} />
                                        <span className="ml-1">Stop</span>
                                    </p>
                                    <p className="ml-auto text-gray-700"> 15th Aug 2024 | 10:30AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-1/2 flex items-center gap-y-2 justify-center flex-col'>
                    <p className="text-[27px] font-bold text-[#344054]">This is The Last Step</p>
                    <p className="text-sm text-[#667185]">Pay to confirm booking</p>
                    <p className='font-bold'>Pay NGN 76,000</p>
                    <button className="py-5 px-8 text-xs bg-[#0673ff] rounded-full text-white hover:shadow-md">
                        Create Payment Ticket
                    </button>
                    <button className="border-0 text-xs  mt-2 text-[#0673ff] ">
                        Confirm Payment
                    </button>
                    <p className="text-[#667185] text-xs mt-40">You can cancel this ride on or before 48hrs to the trip.
                        <span className='text-[#0673ff]'>View Policy</span></p>
                </div>


            </div>

        </DashboardLayout>
    </>
}

export default BookingSummary