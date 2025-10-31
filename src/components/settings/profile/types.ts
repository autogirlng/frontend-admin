// app/dashboard/profile/types.ts

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
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}
