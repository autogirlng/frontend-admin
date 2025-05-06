// const baseUrl = process.env.NEXT_BASE_URL || "";
export const ApiRoutes = {
  // auth
  login: "/auth/admin/login",
  forgotPassword: "/auth/forgot-password",
  sendOtp: "/auth/resend-verify-email",
  resetPassword: "/auth/reset-password",
  getUser: "/user",
  // VEHICLE ONBOARDING
  vehicleOnboardingTable: "/listings",
  vehicleOnboardingStats: "/api",
  vehicleOnboarding: "/vehicle-onboarding",
  // FETCH NOTIFICATION
  notification: "/notifications",
};

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
