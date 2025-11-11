// app/dashboard/types.ts

export interface BookingStats {
  totalBookingsCount: number;
  totalBookingsPrice: number;
  ongoingBookingsCount: number;
  ongoingBookingsPrice: number;
  completedBookingsCount: number;
  completedBookingsPrice: number;
}

export interface PlatformStats {
  totalHosts: number;
  totalCustomers: number;
  totalAdmins: number;
  totalDrivers: number;
}

export interface VehicleOnboardingStats {
  totalVehicles: number;
  totalApproved: number;
  totalRejected: number;
  totalInReview: number;
  totalDrafts: number;
}

export interface VehicleFleetStats {
  totalVehicles: number;
  activeVehicles: number;
  inactiveVehicles: number;
  inMaintenance: number;
  unavailable: number;
  companyUse: number;
}

export interface WalletStats {
  totalPlatformEarnings: number;
  earningsFromHostVehicles: number;
  earningsFromAutogirlVehicles: number;
}
