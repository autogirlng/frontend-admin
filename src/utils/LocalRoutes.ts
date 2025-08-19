export const LocalRoute = {
  // auth
  login: "/auth/login",
  resetPasswordPage: "/auth/reset-password",
  newPasswordPage: "/auth/new-password",
  forgotPasswordPage: "/auth/forgot-password",
  otpSentPage: "/auth/otp-sent",
  getUser: "/api/user",
  deactivateUser: "/user/deactivate",
  // dashboard
  dashboardPage: "/",
  // hosts
  hostPage: "/host",
  hostViewAllPage: "/host/view-all",
  hostSuccessfulOnboarding: "/host/onboarding/successful",
  hostOnboarding: "/host/onboarding",
  addNewHostPage: "/host/onboarding",

  // vehicle onboarding
  hostOnboardingPage: "/host/onboarding?returnUrl=/dashboard/onboarding/hosts",
  selectHostPage: "/dashboard/onboarding/hosts",
  vehiclesOnboardedPage: "/dashboard/onboarding",
  vehicleOnboardingPage: "/dashboard/vehicle-onboarding",
outskirtLocationPage:'/outskirt-location',
  // Dashboard
  bookingPage: "/dashboard/bookings",
  bookingPerfomance: "/dashboard/booking-perfomance",
  bookingTrips: "/dashboard/trips",
  bookingsTripTablePage: "/dashboard/bookings/trips",
  allBookingsTablePage: "/dashboard/bookings/list",
  // bookingTrips: "/dashboard/trips",

  // finance
  financePage: "/finance",
  // fleet
  fleetPage: "/dashboard/fleet",
  availabilityPage: "/dashboard/fleet/availability",
  vehiclePage: "/vehicle",
  // customer
  customersPage: "/customer",

  // SETTINGS
  settings: "/settings",
  teamMemberProfilePage: "/settings/team-member",
};
