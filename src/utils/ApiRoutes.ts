export const ApiRoutes = {
  // auth
  login: "/auth/admin/login",
  forgotPassword: "/auth/forgot-password",
  sendOtp: "/auth/resend-verify-email",
  resetPassword: "/auth/reset-password",
  getUser: "/user",
  getAllAdmin: "/user/all",
  getAllAdminTeam: "/team/all",
  addNewMember: "/auth/createUser",
  adminUser: "/user/admin",
  // VEHICLE ONBOARDING
  vehicleOnboardingTable: "/admin/vehicle-onboarding-list",
  vehicleOnboardingStats: "/api",
  vehicleOnboarding: "/admin/onboard",
  vehicleOnboardingStatus: "/listings/status",
  // FETCH NOTIFICATION
  notification: "/notifications",
  // HOST
  getAllHost: "/admin/host",
  getHostDetails: "/admin/host/details",
  getAllHostStat: "/admin/host/metrics",
  hostOnboarding: "/auth/createUser",
  unblockUser: "/auth/user/activate",
  // DASHBOARD
  getDashboard: "/admin/dashboard",
  // FLEET

  getFleet: "/admin/metrics/fleet",
  availability: "/listings",

  // SETTINGS
  changeRole: "/admin/role-permissions",
  deactivateMember: "/admin/deactivate-member",

  // VEHICLE
  fetchVehicle: "/listings/details",
  outskirtLocations: "/outskirt-locations",
  extremeAreas: "/extreme-areas",
};

export const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
