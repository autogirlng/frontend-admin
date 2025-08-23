import { array, object, ref, string, mixed } from "yup";
import {
  emailRegEx,
  lowercaseRegex,
  numberRegex,
  spacesRegex,
  specialCharRegex,
  uppercaseRegex,
} from "@/utils/constants";
import { isValidPhoneNumber } from "react-phone-number-input";
import { validatePhoneNumber } from "./functions";

export const signupFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
  country: string().required("Please enter your country code"),
  email: string()
    .email("Please enter a valid email address")
    .required("Please enter your email")
    .matches(emailRegEx, "Please enter a valid email address"),
  password: string().required("Please enter your password"),
  // password: string()
  //   .required("Please enter your password")
  //   .matches(
  //     uppercaseRegex,
  //     "Password must contain at least one uppercase letter"
  //   )
  //   .matches(
  //     lowercaseRegex,
  //     "Password must contain at least one lowercase letter"
  //   )
  //   .matches(numberRegex, "Password must contain at least one number")
  //   .matches(
  //     specialCharRegex,
  //     "Password must contain at least one special character"
  //   )
  //   .matches(spacesRegex, "Password must not contain spaces")
  //   .min(8, "Password must be at least 8 characters long"),
});

export const loginFormValidationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: string()
    .required("Please enter your password")
    .matches(
      uppercaseRegex,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      lowercaseRegex,
      "Password must contain at least one lowercase letter"
    )
    .matches(numberRegex, "Password must contain at least one number")
    .matches(
      specialCharRegex,
      "Password must contain at least one special character"
    )
    .matches(spacesRegex, "Password must not contain spaces")
    .min(8, "Password must be at least 8 characters long"),
});

export const resetPasswordEmailValidationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
});

export const setNewPasswordValidationSchema = object().shape({
  password: string().required("Please enter your password"),
  // password: string()
  //   .required("Please enter your password")
  //   .matches(
  //     uppercaseRegex,
  //     "Password must contain at least one uppercase letter"
  //   )
  //   .matches(
  //     lowercaseRegex,
  //     "Password must contain at least one lowercase letter"
  //   )
  //   .matches(numberRegex, "Password must contain at least one number")
  //   .matches(
  //     specialCharRegex,
  //     "Password must contain at least one special character"
  //   )
  //   .matches(spacesRegex, "Password must not contain spaces")
  //   .min(8, "Password must be at least 8 characters long"),
  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "The passwords doesn’t match."),
});

export const verifyPhoneNumberSchema = object().shape({
  country: string().required("Please select country"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
});

export const verifyIdentitySchema = object().shape({
  // valdate day, month and year as dob
  // dob: string().required("Please enter your dob"),
  bvn: string().required("Please enter your bvn"),
});

export const withdrawalAccountSchema = object().shape({
  bankCode: string().required("Please enter your bank"),
  accountNumber: string().required("Please enter your account number"),
});

export const basicVehicleInformationSchema = object().shape({
  listingName: string().required("Vehicle name is required"),
  location: string().required("City is required"),
  latitude: string().required(
    "Latitude is missing. Please select an address from the list."
  ),
  longitude: string().required(
    "Longitude is missing. Please select an address from the list."
  ),
  address: string().required("Address is required"),
  vehicleType: string().required("Please select vehicle type"),
  make: string().required("Please select vehicle make"),
  model: string().required("Please select vehicle model"),
  yearOfRelease: string().required("Please select year of release"),
  hasInsurance: string().required("Please select insurance status"),
  hasTracker: string().required("Please select tracker status"),
});

export const addtionalVehicleInformationSchema = object().shape({
  licensePlateNumber: string().required("License plate number is required"),
  stateOfRegistration: string().required("State of registration is required"),
  vehicleDescription: string()
    .required("Vehicle description is required")
    .min(30, "30 characters minimum"),
  vehicleColor: string().required("Vehicle color is required"),
  numberOfSeats: string().required("Number of seats is required"),
  features: array().min(1, "Please select at least one feature"),
});

export const documentVehicleInformationSchema = object().shape({
  proofOfOwnership: mixed().optional(),
  vehicleRegistration: mixed().required(
    "Vehicle registration document is required."
  ),
  insuranceCertificate: mixed().required("Insurance certificate is required."),
  vehicleInspectionReport: mixed().optional(),
  maintenanceHistory: mixed().optional(),
  authorizationLetter: mixed().optional(),
});
export const vehiclePhotosSchema = object().shape({
  frontView: string().required("Please upload Front view image"),
  backView: string().required("Please upload Back view image"),
  sideView1: string().required("Please upload Side view image"),
  sideView2: string().required("Please uploadSide view image"),
  interior: string().required("Please upload Interior image"),
  other: string().required("Please upload other image"),
});

export const availabilityAndPricingSchema = object().shape({
  advanceNoticeInDays: string().required("Advance notice is required"),
  maxTripDurationInDays: string().required("Maximum duration is required"),
  driverProvided: string().required("Please select an option"),
  fuelProvided: string().required("Please select an option"),
  dailyRate: string().required("Please enter the amount"),
  extraHourRate: string().required("Please enter the amount"),
  // airportPickup: string().required("Please enter the amount"),

  // // these should be activated if discount is on
  // threeDaysDiscount: string().required("Please enter the amount"),
  // sevenDaysDiscount: string().required("Please enter the amount"),
  // thirtyDaysDiscount: string().required("Please enter the amount"),
});

export const assignNewDriverFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),
  phoneNumber: string()
    .required("Please enter your phone number")
    .test("phoneNumber", "Invalid phone number", function (val) {
      const { country } = this.parent;
      return validatePhoneNumber(val, country);
    }),
  country: string().required("Please enter your country code"),
});

export const profileFormValidationSchema = object().shape({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),

  // country: string().required("Please enter your country code"),
  // bio: string().required("Please enter your bio"),
  // city: string().required("Please select your city"),
});

export const changePasswordValidationSchema = object().shape({
  currentPassword: string().required("Please enter your current password"),

  password: string().required("Please enter your new password"),

  confirmPassword: string()
    .required("Please confirm your password")
    .oneOf([ref("password")], "The passwords doesn’t match."),
});

export const withdrawalSchema = object().shape({
  amount: string().required("Please enter amount to withdraw"),
  // minimum of 20k
});

export const reportBookingSchema = object().shape({
  message: string().required("Please type a message"),
});

export const replyReviewSchema = object().shape({
  message: string().required("Please type a message"),
});
