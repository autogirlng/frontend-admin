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
    <div
      className="bg-white rounded-lg shadow  
    flex space-x-4 w-full"
    >
      {/* Image Section */}
      <div className="relative w-64 h-full  flex-shrink-0">
        {/* Location Tag */}
        <span className="absolute flex item-center justify-center space-x-1  z-50 top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-2xl">
          <FaLocationDot />
          <p>{location}</p>
        </span>

        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-white text-xs font-semibold px-2 py-1 rounded shadow">
          1/{totalImages}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button className="p-1 bg-gray-200 rounded-full">
            <FaChevronLeft size={12} />
          </button>
          <button className="p-1 bg-gray-200 rounded-full">
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <IconButton icon={<FaHeart />} />
        </div>
        <p className="text-sm text-gray-600">{price}</p>
        <p className="text-xs text-gray-500">{type}</p>
        <div className="flex justify-end">
          <button className="text-xs text-black ">Open Front Door &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
