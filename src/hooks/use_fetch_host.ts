// src/hooks/use_host.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Define the API response types if you haven't already
export interface HostVehicleDetails {
  make: string;
  color: string | null;
  seatingCapacity: number | null;
  location: string;
  vehicleType: string;
}

export interface HostVehicle {
  image: string | null;
  name: string;
  status: string;
  details: HostVehicleDetails;
  extras: string[];
}

export interface HostProfile {
  id: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string | null; // Can be null if not a business
  status: string;
  lastLogin: string;
}

export interface HostActivity {
  completedBookings: number;
  unpaidBookings: number;
  canceledBookings: number;
  pendingBookings: number;
  ongoingBookings: number;
  totalTrips: number;
  lastLogin: string;
}

export interface HostDetailsApiResponse {
  host: HostProfile;
  activity: HostActivity;
  bookings: any[]; // Define a more specific type if you use bookings
  reviews: any[]; // Define a more specific type if you use reviews
  vehicles: HostVehicle[];
}

export function useHostDetails(hostId: string) {
  const { data, isLoading, error } = useQuery<HostDetailsApiResponse, Error>({
    queryKey: ["hostDetails", hostId],
    queryFn: async () => {
      // In a real application, you would fetch data from your API
      // Example: const response = await fetch(`${API_ROUTES.GET_HOST_BY_ID}/${hostId}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch host details');
      // }
      // return response.json();

      // Mocking the API response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            host: {
              id: hostId,
              profileImage:
                "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1727344328/66ddb4b8e45560fe9d34df42/profile/car_preview1.png",
              firstName: "Daniel",
              lastName: "Osariemen",
              email: "osazeepeter79@gmail.com",
              businessName: "Daniel Ventures",
              status: "Active",
              lastLogin: "2025-06-05T09:23:57.772Z",
            },
            activity: {
              completedBookings: 10,
              unpaidBookings: 2,
              canceledBookings: 1,
              pendingBookings: 3,
              ongoingBookings: 5,
              totalTrips: 21,
              lastLogin: "2025-06-05T09:23:57.772Z",
            },
            bookings: [], // empty for now
            reviews: [], // empty for now
            vehicles: [
              {
                image:
                  "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1745574328/66ddb4b8e45560fe9d34df42/vehicle/images/680b595d548e6ab1729d4726/Ticket%20details%20fill.png",
                name: "Hyundai Tucson 2020",
                status: "Approved", // Changed to match image status
                details: {
                  make: "Hyundai",
                  color: "Red",
                  seatingCapacity: 5,
                  location: "Benin City",
                  vehicleType: "Sports Car",
                },
                extras: ["Bluetooth", "BackupCamera", "HeatedSeats"],
              },
              {
                image:
                  "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1726641362/66ddb4b8e45560fe9d34df42/66e99f9b709820281651472b/Ticket%20details%20fill.png",
                name: "Toyota Camry 2018", // Changed name to match image
                status: "Pending", // Changed to match image status
                details: {
                  make: "Toyota",
                  color: "Blue", // Example color
                  seatingCapacity: 5,
                  location: "Lagos",
                  vehicleType: "Sedan", // Example type
                },
                extras: ["CruiseControl"], // Example extra
              },
              {
                image:
                  "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1733758723/66ddb4b8e45560fe9d34df42/vehicle/66e99f7f709820281651472a/Screenshot%202024-09-23%20130817.png",
                name: "Mercedes Benz C-Class 2022", // Changed name to match image
                status: "Rejected", // Changed to match image status
                details: {
                  make: "Mercedes Benz",
                  color: "Black", // Example color
                  seatingCapacity: 4,
                  location: "Abuja",
                  vehicleType: "Luxury Sedan", // Example type
                },
                extras: ["Sunroof", "LeatherSeats"], // Example extra
              },
              {
                image:
                  "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1727206763/66ddb4b8e45560fe9d34df42/66e96b7e11334ebda468375e/vehicle_image.png",
                name: "Hyundai Elantra 2020", // Changed name to match image
                status: "Unlisted", // Changed to match image status
                details: {
                  make: "Hyundai",
                  color: "White", // Example color
                  seatingCapacity: 5,
                  location: "Port Harcourt",
                  vehicleType: "Sedan", // Example type
                },
                extras: ["Bluetooth"], // Example extra
              },
              {
                image:
                  "http://res.cloudinary.com/do8zvgqpg/raw/upload/v1727206763/66ddb4b8e45560fe9d34df42/66e96b7e11334ebda468375e/vehicle_image.png",
                name: "Camry Corolla 2020", // Changed name to match image
                status: "Suspended", // Changed to match image status
                details: {
                  make: "Toyota",
                  color: "Grey", // Example color
                  seatingCapacity: 5,
                  location: "Kano",
                  vehicleType: "Compact", // Example type
                },
                extras: ["USB Port"], // Example extra
              },
              // Add more mock vehicles to match the image if needed
            ],
          });
        }, 1000);
      });
    },
    enabled: !!hostId, // Only fetch if hostId is available
    onError: (err) => {
      toast.error(`Error fetching host details: ${err.message}`);
    },
  });

  return { data, isLoading, error };
}
