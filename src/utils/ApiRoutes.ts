export const ApiRoutes = {
  // auth
  login: "/auth/admin/login",
  forgotPassword: "/auth/forgot-password",
  sendOtp: "/auth/resend-verify-email",
  resetPassword: "/auth/reset-password",
  getUser: "/user",
  getAllAdmin: "/user/all",
  addNewMember: "/auth/createUser",
  // VEHICLE ONBOARDING
  vehicleOnboardingTable: "/admin/vehicle-onboarding-list",
  vehicleOnboardingStats: "/api",
  vehicleOnboarding: "/admin/onboard",
  // FETCH NOTIFICATION
  notification: "/notifications",
  // HOST
  getAllHost: "/user/all",
  // DASHBOARD
  getDashboard: "/admin/dashboard",
  // FLEET
  getFleet: "/admin/metrics/fleet",
  availability: "/listings",
};

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
