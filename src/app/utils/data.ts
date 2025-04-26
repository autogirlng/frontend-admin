import { BookingTrips } from "../types";
import { ImageAssets } from "./ImageAssets";

export const vehiclesData = [
  {
    id: "all-vehicles",
    name: "All Vehicles",
    image: ImageAssets.vehicleType,
  },
  {
    id: "sedans",
    name: "Sedans",
    image: ImageAssets.vehicleType,
  },
  {
    id: "suvs",
    name: "SUVs",
    image: ImageAssets.vehicleType,
  },
  {
    id: "trucks",
    name: "Trucks",
    image: ImageAssets.vehicleType,
  },
  {
    id: "vans",
    name: "Vans",
    image: ImageAssets.vehicleType,
  },
  {
    id: "sports",
    name: "Sports Cars",
    image: ImageAssets.vehicleType,
  },
  {
    id: "Gwagon",
    name: "Gwagon Cars",
    image: ImageAssets.vehicleType,
  },
  {
    id: "DWagon",
    name: "DWagon Cars",
    image: ImageAssets.vehicleType,
  },
  {
    id: "S sports",
    name: "S Sports Cars",
    image: ImageAssets.vehicleType,
  },
];

export const timeSlots = [
  { id: "1", time: "09:00", available: true },
  { id: "2", time: "10:00", available: false },
  { id: "3", time: "11:00", available: true },
  { id: "4", time: "12:00", available: false },
  { id: "5", time: "13:00", available: true },
  { id: "6", time: "14:00", available: true },
  { id: "7", time: "15:00", available: false },
  { id: "8", time: "16:00", available: true },
  { id: "9", time: "17:00", available: true },
];

export const sampleBookingsTrip: BookingTrips[] = [
  {
    invoiceNumber: "INV-7394-BCX2-46/09",
    bookingId: "BKG-4567-GH12",
    customerName: "Oluwaseun Qjo",
    tripNumber: " 2",
    pickupTime: "2025-04-15",
    pickupLocation: "River Plaza...",
    driverAsgn: "Assigned",
    hostAsgn: "Assigned",
    paymentStatus: "Paid",
    rideStatus: "Pending",
  },
  {
    invoiceNumber: "INV-7394-BCX2-46/09",
    bookingId: "BKG-4567-GH12",
    customerName: "Chukwuemeka Oleeke",
    tripNumber: " 3",
    pickupTime: "2025-04-15",
    pickupLocation: "Skyine Park...",
    driverAsgn: "Unassigned",
    hostAsgn: "Assigned",
    paymentStatus: "Paid",
    rideStatus: "Completed",
  },
  {
    invoiceNumber: "INV-7394-BCX2-46/09",
    bookingId: "BKG-5678-U34",
    customerName: "Chiogzie Nuamani",
    tripNumber: "4",
    pickupTime: "2025-04-15",
    pickupLocation: "Main St. Lot...",
    driverAsgn: "Assigned",
    hostAsgn: "Assigned",
    paymentStatus: "Paid",
    rideStatus: "Canceled",
  },
];
