"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  gallery: string[];
  name: string;
}

const ImageGallery: React.FC<Props> = ({ name, gallery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mb-3">
      {/* Main Image with Navigation */}
      <div className="relative w-full h-90">
        <Image
          src={gallery[currentIndex]}
          alt="Vehicle"
          layout="fill"
          objectFit="cover"
          className="rounded-3xl"
        />

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2  right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <FaChevronRight />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-white text-black px-5 py-1 text-sm rounded-4xl">
          {currentIndex + 1}/{gallery.length}
        </div>
      </div>
      {/* Title */}
      <h1 className="text-2xl font-semibold mt-4">{name}</h1>
      {/* Thumbnail Gallery */}

      <div className="flex gap-4 mt-2">
        {gallery.map((img, idx) => (
          <div
            key={idx}
            className={`relative w-30 h-14 cursor-pointer rounded-lg ${
              currentIndex === idx ? "border-2 border-blue-300" : ""
            }`}
            onClick={() => setCurrentIndex(idx)}
          >
            <Image
              src={img}
              alt={`Gallery ${idx}`}
              layout="fill"
              objectFit="cover "
              className="rounded-lg w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
