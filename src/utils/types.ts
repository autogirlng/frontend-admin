import { JSX } from "react";
import { string } from "yup";
import { LucideProps } from "lucide-react";

export interface ErrorResponse {
  ERR_CODE: string;
  message: string;
}

// utils/types.ts (Ensure these types exist in your project)

export interface HostInformation {
  id?: string; // ID might be returned by the backend after creation, but not used for deciding POST/PUT here
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  email: string;
  cities: string[];
  isBusiness?: boolean;
  businessName?: string;
  businessAddress?: string;
  businessPhoneNumber?: string;
  businessCountry?: string;
  businessCountryCode?: string;
  businessEmail?: string;
  onBoardedBy: string;
  mou?: File | null; // This will be sent as a File, or null if not provided
  // Add other host-related fields as per your backend
}

interface PasswordChecks {
  length: boolean;
  uppercase_letters: boolean;
  lowercase_letters: boolean;
  digit: boolean;
  special_character: boolean;
  no_space: boolean;
}

export interface BankProp {
  bankId: string;
  baseUssdCode: string;
  code: string;
  name: string;
  nipBankCode: string;
  transferUssdTemplate: string;
  ussdTemplate: string;
}

export interface AccountSetupTask {
  icon: JSX.Element;
  title: string;
  link: string;
  linkText: string;
  isCompleted: boolean;
  taskId: keyof User;
}

export type MappedInformation = {
  [key: string]: string | number;
};

type CalendarValuePiece = Date | null;

export type CalendarValue =
  | CalendarValuePiece
  | [CalendarValuePiece, CalendarValuePiece];

// <================= FORM VALUES BEGINS =================>
export interface SignupFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  country: string;
  countryCode: string;
  password: string;
  password_checks?: PasswordChecks;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface verifyEmailValues {
  email: string;
  token: string;
}

export interface ResendVerifyEmailTokenValues {
  email: string;
}
export interface ResetPasswordEmailValues {
  email: string;
}

export interface VerifyPhoneNumberTokenValues {
  phoneNumber: string;
  token: string;
}

export interface SendPhoneNumberTokenValues {
  phoneNumber: string;
}

export interface VerifyOtpValues {
  token: string;
}

export interface SetNewPasswordValues {
  email: string;
  token: string;
  password?: string;
  confirmPassword: string;
  password_checks?: PasswordChecks;
}

export interface ChangePasswordValues {
  currentPassword: string;
  password: string;
  confirmPassword: string;
  password_checks?: PasswordChecks;
}

export interface VerifyPhoneNumberValues {
  phoneNumber: string;
  countryCode: string;
  country: string;
}

export interface VerifyIdentityValues {
  day: string;
  month: string;
  year: string;
  bvn: string;
}

export interface WithdrawalAccountValues {
  bank?: BankProp | null;
  bankCode: string;
  accountNumber: string;
  accountName?: string;
}

export interface BasicVehicleInformationValues {
  listingName: string;
  location: string;
  address: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: string;
  hasTracker: string;
  hasInsurance: string;
}

export interface AdditionalVehicleInformationValues {
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleDescription: string;
  features: string[];
  vehicleColor: string;
  numberOfSeats: string;
}
export interface DocumentVehicleInformationValues {
  proofOfOwnership: string;
  vehicleRegistration: string;
  insuranceCertificate: string;
  vehicleInspectionReport: string;
  maintenanceHistory?: string;
  authorizationLetter: string;
}
export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // email: string;
  country: string;
  countryCode: string;
  bio: string;

  profileImage?: string;
  city: string;
  isBusiness: boolean;
  businessAddress: string;
  businessEmail: string;
  businessLogo?: string;
  businessName: string;
  businessPhoneNumber: string;
  businessCountry?: string;
  businessCountryCode?: string;
}

export interface WithdrawalValues {
  amount: string | number;
}

// <================= FORM VALUES ENDS =================>

export type BankCodes = {
  bankId: string;
  baseUssdCode: string;
  code: string;
  name: string;
  nipBankCode: string;
  transferUssdTemplate: string;
  ussdTemplate: string;
};

export interface AssignNewDriver {
  vehicleId: string;
  // bookingId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface VehiclePhotos {
  frontView: string;
  backView: string;
  sideView1: string;
  sideView2: string;
  interior: string;
  other: string;
}
export interface AvailabilityAndPricingValues {
  advanceNoticeInDays: string;
  minTripDurationInDays: string;
  maxTripDurationInDays: string;
  // selfDrive: string;
  driverProvided: string;
  fuelProvided: string;
  dailyRate: string;
  extraHourRate: string;
  airportPickup: string;
  threeDaysDiscount: string;
  sevenDaysDiscount: string;
  thirtyDaysDiscount: string;
  outskirtsLocation: string[];
  outskirtsPrice: string;
}

// <================= STATUS =================>// src/utils/types/status.ts
export enum Status {
  Joined = "joined",
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Cancelled = "cancelled",
  Completed = "completed",
  Draft = "draft",
  Submitted = "submitted",
  Accepted = "accepted",
  InReview = "inReview",
  Successful = "successful",
  Failed = "failed",
  Paid = "paid",
  Booked = "booked",
  Maintenance = "maintenance",
  Unavailable = "unavailable",
  Review = "review",
  Feedback = "feedback",
  Suspended = "suspended",
  Assigned = "assigned",
  Unassigned = "unassigned",
  Error = "error",
  Success = "success",
  Warning = "warning",
  Info = "info",
  Processing = "processing",
  OnHold = "on_hold",
  Expired = "expired",
  Deleted = "deleted",
  Published = "published",
  Archived = "archived",
}
export enum BookingBadgeStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
}

export enum VehicleOnboardingStatus {
  ACCEPTED = "accepted",
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
  INREVIEW = "inReview",
}
export enum PaymentBadgeStatus {
  SUCCESSFUL = "successful",
  PENDING = "pending",
  FAILED = "failed",
  PAID = "paid",
  CANCELLED = "cancelled",
}

export enum VehicleStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SUBMITTED = "submitted",
  ACTIVE = "active",
  BOOKED = "booked",
  MAINTENANCE = "maintenance",
  UNAVAILABLE = "unavailable",
  INACTIVE = "inactive",
}
export enum ListingStatus {
  REVIEW = "review",
  REJECTED = "rejected",
  APPROVED = "approved",
  ACCEPTED = "accepted",
  FEEDBACK = "feedback",
  SUSPENDED = "suspended",
}

export enum DriverStatus {
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
}

export const enum BookingType {
  SINGLE_DAY = "SINGLE_DAY",
  MULTI_DAY = "MULTI_DAY",
}

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum TransactionStatus {
  SUCCESS = "SUCCESS",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TransactionOrigin {
  WITHDRAWAL = "WITHDRAWAL",
  BOOKING = "BOOKING",
}

export enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELED = "BOOKING_CANCELED",
  UPCOMING_BOOKING = "UPCOMING_BOOKING",
  GUEST_CHECK_IN = "GUEST_CHECK_IN",
  GUEST_CHECK_OUT = "GUEST_CHECK_OUT",
  VEHICLE_ACCEPTED = "VEHICLE_ACCEPTED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  SECURITY_ALERT = "SECURITY_ALERT",
  NEW_REVIEW = "NEW_REVIEW",
  SPECIAL_OFFER = " SPECIAL_OFFER",
}

// EARNINGS
export enum EarningPeriod {
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  ALL_TIME = "all_time",
}

// <================= USER/LISTING/BOOKING/VEHICLE =================>
type UserVerification = {
  id: string;
  phoneNumber: string;
  otpToken: string | null;
  bvnNumber: string | null;
  dob: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string | null;
  profileImage: string | null;
  countryCode: string;
  country: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  withdrawalAccountVerified: boolean;
  bvnVerified: boolean;
  bio: string | null;
  city: string | null;
  userRole: "HOST" | "CUSTOMER" | "ADMIN";
  businessLogo: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessPhoneNumber: string | null;
  businessEmail: string | null;
  createdAt: string;
  updatedAt: string;
  Verification: UserVerification | null;
  averageRating: number;
  statistics?: EarningsStatistics;
};

export interface EarningsStatistics {
  bookingsCompleted: number;
  cancelledBookings: number;
  numberOfCustomers: number;
  totalRevenue: number;
}

export interface TripSettings {
  advanceNotice: string;
  maxTripDuration: string;
  provideDriver: boolean;
  fuelProvided: boolean;
}

export interface Rate {
  value: number;
  unit: string;
}

export interface Discount {
  durationInDays: number;
  percentage: number;
}

export interface Pricing {
  dailyRate: Rate;
  extraHoursFee: number;
  // hourlyRate: Rate;
  airportPickupFee: number;
  discounts: Discount[];
}

export interface AvailabilityAndPricing {
  tripSettings: TripSettings;
  pricing: Pricing;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
}

export interface HostOnboardingFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  country: string;
  countryCode: string;
}

// update this
export interface TopRatedVehicle {
  id: string;
}

export interface DashboardStatistics {
  totalEarnings: number;
  totalOnboardedVehicles: number;
  totalCompletedRides: number;
  walletBalance: number;
  // topRatedVehicle: null | TopRatedVehicle;
  topRatedVehicle: null | TopRatedVehicleType;
}

export interface VehicleOnboardingStatistics {
  totalListings: number;
  approved: number;
  rejected: number;
  inReview: number;
  drafts: number;
}

export interface FleetStatistics {
  totalVehicles: number;
  activeVehicles: number;
  inactiveVehicles: number;
  vehiclesInMaintenance: number;
  suspendedVehicles: number;
}

export interface HostStatistics {
  totalHosts: number;
  activeHosts: number;
  inactiveHosts: number;
  blockedHosts: number;
  onboardingDistribution: {
    selfOnboarded: number;
    adminOnboarded: number;
  };
}
export interface BookingStatistics {
  totalBookings: number;
  pendingApprovals: number;
  rejectedBookings: number;
  approvedRequests: number;
}
export interface VehicleOnboardingTable {
  vehicleId: string;
  host: string;
  location: string;
  makeAndModel: string;
  vehicleType: string;
  year: string;
  dateCreated: string;
  hostRate: string;
  customerRate: string;
  status: "accepted" | "pending" | "rejected" | "review";
  // vehicleStatus: "accepted" | "pending" | "rejected" | "review";
}

export interface FleetTable {
  vehicleId: string;
  host: string;
  location: string;
  makeAndModel: string;
  vehicleType: string;
  year: string;
  plateNumber: string;
  dateCreated: string;
  bookingCount: number;
  vehicleStatus: string;
}

export interface HostTable {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: Date | null;
  profileImage: string | null;
  countryCode: string;
  country: string;
  emailConfirmed: boolean;
  otp: string | null;
  passwordOtp: string | null;
  phoneNumber: string;
  isActive: boolean;
  phoneVerified: boolean;
  bvnVerified: boolean;
  withdrawalAccountVerified: boolean;
  bio: string | null;
  city: string | null;
  location: string | null;
  userRole: "HOST" | "ADMIN" | "USER"; // Example roles
  isBusiness: boolean;
  businessLogo: string | null;
  businessName: string | null;
  businessAddress: string | null;
  businessPhoneNumber: string | null;
  businessEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  referralCode: string;
  referredBy: string | null;
  referralBalance: number;
  onBoardedBy: string;
  mouDocument: string | null;
}
export interface TravelCompanion {
  id: string;
  name: string;
  phoneNumber: string;
  bookingId: string;
}

export interface BookingInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  bookingType: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  rentalAgreement: string | null;
  bookingStatus: string;
  isForSelf?: boolean;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact?: string | null;
  userEmail?: string | null;
  userPhoneNumber?: string | null;
  userCountry?: string;
  countryCode?: string;
  specialInstructions?: string | null;
  paymentLink?: string | null;
  outskirtsLocation?: string[];
  areaOfUse?: string;
  extraDetails?: string;
  purposeOfRide?: string;
  tripPurpose?: string | null;
  secondaryPhoneNumber?: string;
  currencyCode: string;
  vehicleId: string;
  userId: string;
  hostId?: string;
  version?: number;
  createdAt: string;
  updatedAt: string;
  vehicle?: ListingInformation;
  travelCompanions?: TravelCompanion[];
}
export interface VehicleInformation {
  id?: string;
  listingName: string;
  location?: string;
  address?: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: string;
  hasTracker: boolean;
  hasInsurance: boolean;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleDescription: string;
  features: string[];
  vehicleColor: string;
  numberOfSeats: number;
  VehicleImage: VehiclePhotos;
  tripSettings: TripSettings;
  pricing: Pricing;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
  status: ListingStatus;
  vehicleStatus: VehicleStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  VehicleDocument: DocumentVehicleInformationValues;
}

export interface AssignedDriver {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleId: string;
  bookingId: string;
  assignmentDate: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  driverImage: null | string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverResponse {
  data: Driver[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

export interface EarningsStatistics {
  bookingsCompleted: number;
  cancelledBookings: number;
  numberOfCustomers: number;
  totalRevenue: number;
}

export interface ListingInformation {
  id?: string;
  listingName: string;
  location?: string;
  address?: string;
  vehicleType: string;
  make: string;
  model: string;
  yearOfRelease: string;
  hasTracker: boolean;
  hasInsurance: boolean;
  licensePlateNumber: string;
  stateOfRegistration: string;
  vehicleDescription: string;
  features: string[];
  vehicleColor: string;
  numberOfSeats: number;
  outskirtsLocation?: string[];
  outskirtsPrice?: number;
  status: ListingStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  unavailableFrom: string;
  unavailableUntil: string;
  vehicleStatus: VehicleStatus;
  VehicleImage: VehiclePhotos;
  pricing: Pricing;
  tripSettings: TripSettings;
  user: User;
  AssignedDriver: AssignedDriver[];
  Booking: BookingInformation[];
  statistics: EarningsStatistics;
}

export interface BookingDetailsInformation {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  // bookingType: string;
  amount: number;
  // paymentStatus: string;
  // paymentMethod: string;
  // rentalAgreement: string | null;
  // bookingStatus: string;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact: string;
  vehicleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // vehicle: Vehicle;
  // travelCompanions: TravelCompanion[];
}

export type Transaction = {
  id: string;
  transactionId: string;
  apiTransactionReference: string | null;
  date: string;
  time: string;
  amount: number;
  currencyCode: string;
  type: TransactionType;
  status: TransactionStatus;
  origin: TransactionOrigin;
  userId: string;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WalletBalance = {
  id: string;
  userId: string;
  walletBalance: number;
  // otpExpires: null;
  locked: boolean;
  // createdAt: string;
  // updatedAt: string;
};

export type Review = {
  id: string;
  rating: number;
  message: string;
  userId: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  Reply?: ReviewReply[];
};

export type ReviewReply = {
  id: string;
  message: string;
  userId: string;
  reviewId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  trxReference: null;
  transaction: null;
  notificationType: NotificationType;
};

// ==================== hard coded types - to be changed ====================//
export type TopRatedVehicleType = {
  make: string;
  model: string;
  year: string;
  colour: string;
  seatingCapacity: string;
  totalRides: string;
  totalEarnings: string;
};

export type TransactionTableRow = {
  transactionId: string;
  date: string;
  bookingId: string;
  type: string;
  vehicle: string;
  purpose: string;
  amount: string;
  status: string;
  actions: string;
};

export type DateRange = { startDate: Date | null; endDate: Date | null };

export type Member = {
  id: string;
  profileImage: string;
  firstName: string;
  lastName: string;
  email: string;
  totalBooking: number;
  totalRides: number;
  lastBooked: string;
  location: string;
  vehicles: number;
  businessName: string;
  phoneNumber: string;
  role:
    | "Admin"
    | "Customer Support "
    | "Finance Manager"
    | "Operation Manager"
    | string;
  lastLogin: string;
  joined: string;
  status: "active" | "inactive" | "successful" ;
};
export enum UserRole {
  Admin = "ADMIN",
  OperationManager = "OPERATION_MANAGER",
  CustomerSupport = "CUSTOMER_SUPPORT",
  FinanceManager = "FINANCE_MANAGER",
  // SuperAdmin = "Super Admin",
  // ADMIN, CUSTOMER_SUPPORT, FINANCE_MANAGER, OPERATION_MANAGER, HOST. CUSTOMER
}

export interface AddMemberPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  email: string;
  userRole: UserRole;
  isBusiness?: boolean;
}

export interface EditMemberPayload {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  email: string;
  userRole: UserRole;
}
export interface ChangeRolePayload {
  role: string;
}

// Define the booking data type based on the image content
export interface Booking {
  id: string;
  customerName: string;
  city: string;
  bookingType: "Single Day" | "Multi Day";
  pickupLocation: string;
  vehicle: string;
  bookingStatus:
    | "Paid"
    | "Unpaid"
    | "Pending"
    | "Completed"
    | "Rejected"
    | "Cancelled";
  tripStatus:
    | "Unconfirmed"
    | "Confirmed"
    | "Ongoing"
    | "Extra Time"
    | "Cancelled"
    | "Completed";
}

export type LucideIconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

export interface TripBookingResponse {
  data: TripBookingItem[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface TripBookingItem {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  driverName: string;
  driverPhone: string;
  hostName: string;
  opsAgentName: string;
  csAgentName: string;
  bookedHours: number;
  pickupState: string;
  pickupTime: string;
  serviceDate: string;
  bookingType: "SINGLE_DAY" | "MULTI_DAY" | string;
  pickupLocation: string;
  vehicle: string;
  vehicleIdentifier: string;
  bookingStatus:
    | "PENDING"
    | "PAID"
    | "UNPAID"
    | "PENDING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";
  tripStatus:
    | "UNCONFIRMED"
    | "CONFIRMED"
    | "ONGOING"
    | "EXTRA_TIME"
    | "CANCELLED"
    | "COMPLETED";
  booking: TripBookingDetails;
}

export interface TripBookingDetails {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  bookingType: "SINGLE_DAY" | string;
  amount: number;
  paymentStatus: "PENDING" | string;
  paymentMethod: "ACCOUNT_TRANSFER" | string;
  rentalAgreement: string | null;
  bookingStatus:
    | "PENDING"
    | "PAID"
    | "UNPAID"
    | "PENDING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";
  isForSelf: boolean;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  emergencyContact: string | null;
  userEmail: string | null;
  userPhoneNumber: string | null;
  userCountry: string;
  countryCode: string;
  specialInstructions: string | null;
  paymentLink: string;
  outskirtsLocation: string[];
  areaOfUse: string;
  extraDetails: string;
  purposeOfRide: string | null;
  tripPurpose: string | null;
  secondaryPhoneNumber: string;
  currencyCode: string;
  vehicleId: string;
  userId: string;
  hostId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleId: string;
  bookingId: string;
  assignmentDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SingleTrip {
  id: string;
  bookingId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  booking: {
    id: string;
    startDate: string;
    endDate: string;
    duration: number;
    bookingType: string;
    amount: number;
    paymentStatus: string;
    paymentMethod: string;
    rentalAgreement: any;
    bookingStatus: string;
    isForSelf: boolean;
    guestName: string;
    guestEmail: string;
    guestPhoneNumber: string;
    pickupLocation: string;
    dropoffLocation: string;
    emergencyContact: any;
    userEmail: any;
    userPhoneNumber: any;
    userCountry: string;
    countryCode: string;
    specialInstructions: any;
    paymentLink: string;
    outskirtsLocation: string[];
    areaOfUse: string;
    extraDetails: string;
    purposeOfRide: any;
    tripPurpose: any;
    secondaryPhoneNumber: string;
    currencyCode: string;
    vehicleId: string;
    userId: string;
    hostId: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    vehicle: {
      user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        id: string;
      };
      AssignedDriver: Driver[];
      pricing: {
        dailyRate: {
          value: number;
          currency: any;
          unit: string;
        };
        extraHoursFee: number;
        airportPickupFee: number;
        hourlyRate: any;
        discounts: {
          durationInDays: number;
          percentage: number;
        }[];
      };
      tripSettings: {
        advanceNotice: string;
        maxTripDuration: string;
        provideDriver: boolean;
        fuelProvided: boolean;
      };
      id: string;
      listingName: string;
      location: string;
      make: string;
      model: string;
      yearOfRelease: string;
      vehicleColor: string;
      numberOfSeats: number;
      latitude: any;
      longitude: any;
      features: string[];
    };
  };
  notes: {
    id: string;
    note: string;
    tripId: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
