
import React, { useState, FC } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';


interface Carousel {
    vehicleImages: string[],
}

export const Carousel: FC<Carousel> = ({ vehicleImages }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicleImages.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicleImages.length) % vehicleImages.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return <>
        {
            vehicleImages.length > 0 ? (
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
    </>
}