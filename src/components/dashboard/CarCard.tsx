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
    <div className="bg-white rounded-[30px]  border-slate-50 border-[2.5px] flex flex-col md:flex-row w-full  mx-auto overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full md:w-4/12 aspect-[16/9] md:aspect-auto rounded-l-2xl overflow-hidden">
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
          className="rounded-l-[30px]"
        />

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-white text-xs font-semibold text-black px-4 py-1 rounded-2xl shadow">
          1/{totalImages}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-2 right-2 flex space-x-2 text-black">
          <button className="p-1  bg-black/60 text-gray-300 rounded-full shadow">
            <FaChevronLeft size={10} />
          </button>
          <button className="p-1 bg-black/60 z-50 text-gray-300 rounded-full shadow">
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col p-4 sm:p-6 space-y-2 sm:space-y-3 w-full md:w-8/12">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <IconButton icon={<FaHeart />} />
        </div>
        <p className="text-sm sm:text-[20px] text-gray-600 font-semibold">
          {price}
        </p>
        <p className="text-xs sm:text-[20px] text-gray-500">{type}</p>
        <div className="flex justify-between text-xs">
          <p className="text-[#0C8921]"> 93,290 Completed Rides</p>
          <button className="  flex items-center text-black font-medium hover:underline">
            Open Front Door <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
