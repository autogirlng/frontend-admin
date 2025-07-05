"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/shared/spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User } from "@/types";
import { useHttp } from "@/utils/useHttp";
import { ArrowLeft, MoreVertical } from "lucide-react";
import BackLink from "@/components/BackLink";
import { useQuery } from "@tanstack/react-query";

interface CustomerStats {
  referralStats: {
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
    referralBalance: number;
  };
  totalEarnings: number;
  totalOnboardedVehicles: number;
  totalCompletedRides: number;
  walletBalance: number;
  averageRating: number;
  topRatedVehicle: any;
}

interface CustomerData extends User {
  stats: CustomerStats;
}

interface Booking {
  id: string;
  pickupAddress?: string;
  pickupLocation?: string;
  pickupTime?: string;
  numberOfTrips?: number;
  dropoffAddress?: string;
  dropoffLocation?: string;
  dropoffTime?: string;
  rideStatus?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  bookingStatus?: string;
}

interface Review {
  id: string;
  user?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  rating: number;
  createdAt?: string;
  message?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success-500 text-white';
      case 'inactive':
        return 'bg-error-500 text-white';
      case 'pending':
        return 'bg-warning-500 text-white';
      default:
        return 'bg-grey-500 text-white';
    }
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const http = useHttp();

  // Types
  interface CustomerStats {
    referralStats: {
      totalReferrals: number;
      pendingReferrals: number;
      completedReferrals: number;
      referralBalance: number;
    };
    totalEarnings: number;
    totalOnboardedVehicles: number;
    totalCompletedRides: number;
    walletBalance: number;
    averageRating: number;
    topRatedVehicle: any;
  }
  interface CustomerData extends User {
    stats: CustomerStats;
  }
  interface Booking {
    id: string;
    pickupAddress?: string;
    pickupLocation?: string;
    pickupTime?: string;
    numberOfTrips?: number;
    dropoffAddress?: string;
    dropoffLocation?: string;
    dropoffTime?: string;
    rideStatus?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    bookingStatus?: string;
  }
  interface Review {
    id: string;
    user?: {
      firstName?: string;
      lastName?: string;
      profileImage?: string;
    };
    rating: number;
    createdAt?: string;
    message?: string;
  }

  // Fetch customer details
  const {
    data: customer = {} as CustomerData,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery<CustomerData>({
    queryKey: ["customer-details", id],
    queryFn: async () => {
      if (!id) return {} as CustomerData;
      const res = await http.get<CustomerData>(`/user/admin/${id}`);
      return res || ({} as CustomerData);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Fetch bookings
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery<Booking[]>({
    queryKey: ["customer-bookings", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await http.get<{ data: Booking[] }>(`/bookings/user?page=1&limit=10`);
      return res && res.data ? res.data : [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Fetch reviews
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery<Review[]>({
    queryKey: ["customer-reviews", id],
    queryFn: async () => {
      if (!id) return [];
      const res = await http.get<{ data: Review[] }>(`/reviews/findoneuser/${id}?page=1&limit=10`);
      return res && res.data ? res.data : [];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const loading = customerLoading || bookingsLoading || reviewsLoading;
  const error = customerError || bookingsError || reviewsError;

  if (loading) {
    return (
      <DashboardLayout title="Customer Details" currentPage="Customer Details">
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Customer Details" currentPage="Customer Details">
        <div className="text-center text-red-600 py-10">{error.message}</div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout title="Customer Details" currentPage="Customer Details">
        <div className="text-center text-gray-500 py-10">Customer not found.</div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + '|' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <DashboardLayout title="Customer Details" currentPage="Customer Details">
      <div className="space-y-4 md:space-y-5 2xl:space-y-[52px] py-4 md:py-8 2xl:py-11 px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-grey-200 rounded-xl md:rounded-3xl px-4 md:px-6 py-4">
          <div className="flex items-center space-x-4">
            <BackLink backLink="/customer" />
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-grey-100 rounded-lg md:rounded-xl transition-colors duration-200">
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-grey-600" />
            </button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white border border-grey-200 rounded-xl md:rounded-3xl overflow-hidden">
          <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-3 md:px-4 py-3 md:py-4 m-3 md:m-4 rounded-lg md:rounded-xl text-sm font-medium text-[#1E93FF]">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-grey-900 text-xs md:text-sm">CUSTOMER DETAILS</span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full overflow-hidden shadow-lg mx-auto md:mx-0">
                {customer.profileImage ? (
                  <img src={customer.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg md:text-2xl">
                    {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-grey-900 mb-1">
                  {customer.firstName} {customer.lastName}
                </h3>
                <p className="text-grey-600 mb-2 flex items-center justify-center md:justify-start text-sm md:text-base">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {customer.email}
                </p>
                <p className="text-grey-600 mb-3 flex items-center justify-center md:justify-start text-sm md:text-base">
                  <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {customer.phoneNumber}
                </p>
                <div className="flex items-center justify-center md:justify-start">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-success-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium text-success-600 bg-success-50 px-2 md:px-3 py-1 rounded-full">Active Customer</span>
                </div>
              </div>
              <div className="text-center md:text-right w-full md:w-auto">
                <p className="text-xs md:text-sm text-grey-500 mb-1">Member Since</p>
                <p className="text-xs md:text-sm font-semibold text-grey-900">
                  {customer.createdAt ? formatDate(customer.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Activity */}
        <div className="bg-white border border-grey-200 rounded-xl md:rounded-3xl overflow-hidden">
          <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-3 md:px-4 py-3 md:py-4 m-3 md:m-4 rounded-lg md:rounded-xl text-sm font-medium text-[#1E93FF]">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-grey-900 text-xs md:text-sm">CUSTOMER ACTIVITY</span>
          </div>
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Completed Bookings</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">{customer.stats?.totalCompletedRides || 9000}</p>
              </div>
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Unpaid Bookings</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">0</p>
              </div>
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Cancelled Bookings</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">12</p>
              </div>
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Pending Bookings</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">1</p>
              </div>
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Ongoing Bookings</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">0</p>
              </div>
              <div className="bg-white border border-grey-200 p-3 md:p-4 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <p className="text-xs text-grey-600 font-medium mb-1">Total Trips</p>
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-grey-900">1800</p>
              </div>
            </div>
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-grey-75 rounded-lg md:rounded-xl p-3 md:p-4 space-y-2 md:space-y-0">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-grey-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs md:text-sm text-grey-600 font-medium">Last Login</span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-grey-900">
                {customer.lastLogin ? formatDate(customer.lastLogin) : '12th August 2023|2:09PM'}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white border border-grey-200 rounded-xl md:rounded-3xl overflow-hidden">
          <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-3 md:px-4 py-3 md:py-4 m-3 md:m-4 rounded-lg md:rounded-xl text-sm font-medium text-[#1E93FF]">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-grey-900 text-xs md:text-sm">BOOKINGS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-grey-75">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider">
                    <span className="hidden sm:inline">Pickup Address</span>
                    <span className="sm:hidden">Pickup</span>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider hidden md:table-cell">
                    Pickup Time
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider">
                    <span className="hidden sm:inline">Number Of Trips</span>
                    <span className="sm:hidden">Trips</span>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider hidden lg:table-cell">
                    Dropoff Address
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider hidden lg:table-cell">
                    Dropoff Time
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-grey-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-grey-100">
                {bookings.map((booking: Booking, index: number) => (
                  <tr key={booking.id} className="hover:bg-grey-75 transition-colors duration-150">
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-grey-900 max-w-[100px] sm:max-w-[120px] md:max-w-none truncate">
                        {booking.pickupLocation || booking.pickupAddress}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-xs md:text-sm text-grey-900">{booking.startDate ? formatDate(booking.startDate) : ''}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-semibold text-grey-900">{booking.duration}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs md:text-sm text-grey-900 max-w-[100px] xl:max-w-[120px] truncate">{booking.dropoffLocation || booking.dropoffAddress}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-xs md:text-sm text-grey-900">{booking.endDate ? formatDate(booking.endDate) : ''}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <StatusBadge status={String(booking.bookingStatus || booking.rideStatus)} />
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <button className="text-grey-400 hover:text-grey-600 transition-colors duration-150 p-1 rounded-lg hover:bg-grey-100">
                        <MoreVertical className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback and Reviews */}
        <div className="bg-white border border-grey-200 rounded-xl md:rounded-3xl overflow-hidden">
          <div className="flex items-center space-x-2 bg-[#EDF8FF] w-fit px-3 md:px-4 py-3 md:py-4 m-3 md:m-4 rounded-lg md:rounded-xl text-sm font-medium text-[#1E93FF]">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-grey-900 text-xs md:text-sm">FEEDBACK AND REVIEWS</span>
          </div>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {reviews.map((review: Review, index: number) => (
              <div key={review.id} className="border-b border-grey-100 pb-4 md:pb-6 last:border-b-0">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                    {review.user?.profileImage ? (
                      <img src={review.user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                        {review.user?.firstName?.charAt(0)}{review.user?.lastName?.charAt(0)}
                    </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-3 space-y-1 sm:space-y-0">
                      <h4 className="font-semibold text-grey-900 text-sm md:text-lg truncate">{review.user?.firstName} {review.user?.lastName}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-xs md:text-sm text-grey-500 mb-2 md:mb-3 flex items-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {review.createdAt ? formatDate(review.createdAt) : ''}
                    </p>
                    <p className="text-xs md:text-sm text-grey-700 leading-relaxed bg-grey-75 p-3 md:p-4 rounded-lg">
                      {review.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}