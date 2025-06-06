// src/app/hosts/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaChevronLeft,
  FaStar,
  FaCar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FullPageSpinner } from "@/components/shared/spinner";
import { useHostDetails } from "@/hooks/use_fetch_host"; // Import the new hook
import { format } from "date-fns";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { LuCircleDashed } from "react-icons/lu";

// Utility function to get status class names
const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
      return "bg-green-100 text-green-700";
    case "review":
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "rejected":
    case "canceled":
      return "bg-red-100 text-red-700";
    case "unlisted":
      return "bg-gray-100 text-gray-700";
    case "suspended":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
      return <FaCheckCircle className="text-green-500 text-lg" />;
    case "review":
    case "pending":
      return <FaClock className="text-yellow-500 text-lg" />;
    case "rejected":
    case "canceled":
      return <FaTimesCircle className="text-red-500 text-lg" />;
    case "suspended":
      return <FaExclamationTriangle className="text-orange-500 text-lg" />;
    case "unlisted":
      return <LuCircleDashed className="text-gray-500 text-lg" />;
    default:
      return <BiDotsHorizontalRounded className="text-gray-500 text-lg" />;
  }
};

export default function HostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const hostId = params.id as string; // Get the host ID from the URL

  const { data: hostDetails, isLoading, error } = useHostDetails(hostId); // Use the new hook

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p>Error loading host details: {error.message}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#005EFF] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!hostDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Host details not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#005EFF] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { host, activity, vehicles, reviews } = hostDetails; // Destructure data

  const totalReviews = reviews.length; // assuming reviews is an array of review objects
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0; // assuming each review has a 'rating' property

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full py-4 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.back()}
            className="text-[#005EFF] flex items-center hover:underline"
          >
            <FaChevronLeft className="mr-1" /> Back
          </button>
          <div className="flex space-x-2">
            {/* Action buttons (e.g., Edit, Delete, Suspend) can go here */}
            {/* Example: */}
            {/* <Button variant="secondary">Edit Host</Button>
            <Button variant="danger">Suspend Host</Button> */}
          </div>
        </div>

        {/* Host Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            {host.profileImage ? (
              <Image
                src={host.profileImage}
                alt={`${host.firstName} ${host.lastName}`}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                {host.firstName[0]}
              </div>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {host.firstName} {host.lastName}
              {host.businessName && (
                <span className="text-gray-500 text-sm ml-2">
                  ({host.businessName})
                </span>
              )}
            </h1>
            <p className="text-gray-600 text-sm">{host.email}</p>
            <div className="flex items-center justify-center md:justify-start mt-1">
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClasses(
                  host.status
                )}`}
              >
                {host.status}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Last Login:{" "}
              {host.lastLogin
                ? format(new Date(host.lastLogin), "PPP p")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activity Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-center">
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-gray-900">
                {activity.totalTrips}
              </span>
              <span className="text-sm text-gray-500">Total Trips</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-green-600">
                {activity.completedBookings}
              </span>
              <span className="text-sm text-gray-500">Completed Bookings</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-blue-600">
                {activity.ongoingBookings}
              </span>
              <span className="text-sm text-gray-500">Ongoing Bookings</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-yellow-600">
                {activity.pendingBookings}
              </span>
              <span className="text-sm text-gray-500">Pending Bookings</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-red-600">
                {activity.canceledBookings}
              </span>
              <span className="text-sm text-gray-500">Cancelled Bookings</span>
            </div>
            <div className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-2xl font-bold text-purple-600">
                {activity.unpaidBookings}
              </span>
              <span className="text-sm text-gray-500">Unpaid Bookings</span>
            </div>
          </div>
        </div>

        {/* Host Reviews/Ratings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Host Reviews
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <FaStar className="text-yellow-400 text-2xl" />
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">({totalReviews} Reviews)</span>
          </div>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">
                      {review.reviewerName || "Anonymous"}
                    </span>
                    <div className="flex">
                      {Array(review.rating)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {review.date ? format(new Date(review.date), "PPP") : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Vehicles ({vehicles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center sm:items-start p-4 border rounded-lg shadow-sm space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <div className="relative w-32 h-20 sm:w-24 sm:h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {vehicle.image ? (
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaCar className="text-3xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicle.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vehicle.details.make} &bull;{" "}
                      {vehicle.details.vehicleType} &bull;{" "}
                      {vehicle.details.location}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start mt-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClasses(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-[#005EFF] hover:underline text-sm flex items-center">
                      View Details
                      <BiDotsHorizontalRounded className="ml-1" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-500 text-center">
                No vehicles listed by this host yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
