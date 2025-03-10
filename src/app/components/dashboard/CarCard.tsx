import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import IconButton from "../core/IconButton";

interface CarCardProps {
  location: string;
  imageUrl: string;
  title: string;
  price: string;
  type: string;
  totalImages: number;
}

const CarCard: React.FC<CarCardProps> = ({
  location,
  imageUrl,
  title,
  price,
  type,
  totalImages,
}) => {
  return (
    <div className="bg-white rounded-lg shadow flex flex-col md:flex-row w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 aspect-[16/9] md:aspect-auto rounded-t-lg md:rounded-l-lg overflow-hidden">
        {/* Location Tag */}
        <span className="absolute flex items-center space-x-1 z-50 top-2 left-2 bg-white text-gray-800 text-xs sm:text-sm font-semibold px-3 py-1 rounded-2xl shadow-md">
          <FaLocationDot />
          <p>{location}</p>
        </span>

        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg md:rounded-l-lg"
        />

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-white text-xs font-semibold px-2 py-1 rounded shadow">
          1/{totalImages}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button className="p-2 sm:p-3 bg-gray-200 rounded-full shadow">
            <FaChevronLeft size={16} />
          </button>
          <button className="p-2 sm:p-3 bg-gray-200 rounded-full shadow">
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-3 w-full md:w-1/2">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <IconButton icon={<FaHeart />} />
        </div>
        <p className="text-sm sm:text-md text-gray-600">{price}</p>
        <p className="text-xs sm:text-sm text-gray-500">{type}</p>
        <div className="flex justify-end">
          <button className="text-sm sm:text-md text-black font-medium hover:underline">
            Open Front Door &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
