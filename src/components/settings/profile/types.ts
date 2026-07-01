import { AccessibleRoute } from "@/types/route-access";

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  profilePictureUrl?: string;
  referralCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  birthday?: string;
  accessibleRoutes?: AccessibleRoute[];
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface UpdateBirthdayPayload {
  birthday: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
