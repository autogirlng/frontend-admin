import axios from 'axios';
import { LocalRoute } from '@/utils/LocalRoutes';

export interface BookingFilters {
  limit?: number;
  page?: number;
  bookingType?: 'MULTI_DAY' | 'HOURLY' | 'DAILY';
  vehicleId?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED' | 'APPROVED';
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  search?: string;
}

export interface Booking {
  bookingId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  vehicle: string;
  status: string;
  price?: number;
  bookingType: 'SINGLE_DAY' | 'MULTI_DAY' | 'HOURLY';
  hostName: string;
  startDate?: string;
  duration?: number;
  city?: string;
}

export interface BookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If no token is found, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = LocalRoute.login;
    }
  }
  
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_token');
        window.location.href = LocalRoute.login;
      }
    }
    return Promise.reject(error);
  }
);

export const bookingService = {
  getBookings: async (filters: BookingFilters): Promise<BookingsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      // Use the correct endpoint for admin bookings
      const response = await api.get(`/admin/booking/list?${queryParams.toString()}`);
      console.log('Bookings API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Add other booking-related API calls here
  assignDriver: async (bookingId: string, driverId: string) => {
    try {
      const response = await api.post(`/api/admin/bookings/${bookingId}/assign-driver`, {
        driverId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  },

  getAvailableDrivers: async () => {
    try {
      const response = await api.get('/api/admin/drivers/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available drivers:', error);
      throw error;
    }
  }
}; 