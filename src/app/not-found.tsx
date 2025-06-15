import Link from "next/link";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const NotFoundPage: NextPage = () => {
  return (
    <DashboardLayout title="404 - Not Found" currentPage="404">
      <div className="bg-white flex flex-col items-center justify-center pt-[200px]">
        <div className="text-center max-w-md">
          <h1 className="mb-4 font-bold text-gray-800 text-4xl sm:text-6xl md:text-7xl lg:text-[50px] flex justify-center gap-2">
            <span className="text-[#f00]">4</span>
            <span className="text-[#ff0]">0</span>
            <span className="text-[#00f]">4</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 hover:text-white transition-colors duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFoundPage;
