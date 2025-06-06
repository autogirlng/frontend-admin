// Example of how it should look in initialValues.ts (adjust types as needed)
export interface HostOnboardingFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string; // e.g., "NG"
  countryCode: string; // e.g., "+234"
  email: string;
  outskirtsLocation: string[];
  isOperatingAsBusiness: boolean; // New field
  businessName: string; // New field, conditional
  businessAddress: string; // New field, conditional
  businessNumber: string; // New field, conditional
  businessCountry: string; // New field, conditional (for business phone)
  businessCountryCode: string; // New field, conditional (for business phone)
  businessEmail: string; // New field, conditional
  mou: File | null;
  onboardedBy: string;
}

export const hostOnboardingValues: HostOnboardingFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  country: "",
  countryCode: "",
  email: "",
  outskirtsLocation: [],
  isOperatingAsBusiness: false, // Default to false
  businessName: "",
  businessAddress: "",
  businessNumber: "",
  businessCountry: "",
  businessCountryCode: "",
  businessEmail: "",
  mou: null,
  onboardedBy: "",
};
