interface VehicleImage {
  id: string;
  frontView: string | null;
  backView: string | null;
  sideView1: string | null;
  sideView2: string | null;
  interior: string | null;
  other: string | null;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleBooking {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  bookingType: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  rentalAgreement: string | null;
  bookingStatus: string;
  isForSelf: boolean;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact: string;
  userEmail: string;
  userPhoneNumber: string;
  userCountry: string;
  countryCode: string | null;
  specialInstructions: string;
  paymentLink: string;
  outskirtsLocation: string[];
  areaOfUse: string;
  extraDetails: string;
  purposeOfRide: string;
  tripPurpose: string;
  secondaryPhoneNumber: string | null;
  currencyCode: string;
  vehicleId: string;
  userId: string;
  hostId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    pricing: any | null; 
    tripSettings: any | null; 
    id: string;
    listingName: string;
    location: string;
    address: string;
    VehicleImage: VehicleImage;
    vehicleType: string;
    make: string;
    model: string;
    yearOfRelease: string;
    hasTracker: boolean;
    hasInsurance: boolean;
    licensePlateNumber: string;
    vehicleColor: string;
    stateOfRegistration: string;
    vehicleDescription: string;
    numberOfSeats: number;
    status: string;
    vehicleStatus: string;
    userId: string;
    vehicleCurrency: string;
    isActive: boolean;
    areYouVehicleOwner: boolean;
    isReserved: boolean;
    reservationExpiresAt: string;
    unavailableFrom: string | null;
    unavailableUntil: string | null;
    features: string[];
    outskirtsLocation: string[];
    outskirtsPrice: number | null;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

type bookingType = {
  rides: number;
  naira: number;
  count: number;
};

export type BookingData = {
  // totalBookings: bookingType;
  ongoing: bookingType;
  completed: bookingType;
  cancelled: bookingType;
  total: bookingType;
};

export type PlatformUsersData = {
  totalHosts: number;
  totalCustomers: number;
  totalAdmins: number;
  totalDrivers: number;
};

export type FleetData = {
  totalVehicles: number;
  suspendedVehicles: number;
  activeVehicles: number;
  inactiveVehicles: number;
};

export type FinanceData = {
  totalBookings: number;
  hostPayments: number;
  autogirlRevenue: number;
  customerWalletBalance: number;
  hostWalletBalance: number;
};

export type CustomerData = {
  totalCustomers: number;
  activeCustomers: number;
  recentActiveCustomers: number;
  customersWithCompletedBookings: number;
  totalCustomerSpending: number;
  topCustomers: any[];
};

export type Dashboard = {
  booking?: BookingData;
  platformUsers?: PlatformUsersData;
  fleet?: FleetData;
  finance?: FinanceData;
  recentBookings?: VehicleBooking[];
  mostBookedVehicles?: VehicleBooking[];
  customer?: CustomerData;
};
