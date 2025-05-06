import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorResponse, NotificationType } from "@/utils/types";

import {
  lowercaseRegex,
  numberRegex,
  spacesRegex,
  specialCharRegex,
  uppercaseRegex,
} from "@/utils/constants";
import { daysOfTheWeek } from "./data";
import Icons from "@/components/shared/icons";

export const isLengthValid = (password: string): boolean => {
  const isLengthValid = password.length >= 8;
  return isLengthValid;
};

export const isUpperCaseValid = (password: string): boolean => {
  const hasUppercase = uppercaseRegex.test(password);
  return hasUppercase;
};

export const isLowerCaseValid = (password: string): boolean => {
  const hasLowercase = lowercaseRegex.test(password);
  return hasLowercase;
};

export const isDigitValid = (password: string): boolean => {
  const hasNumber = numberRegex.test(password);
  return hasNumber;
};

export const isSpecialCharacterValid = (password: string): boolean => {
  const hasSpecialChar = specialCharRegex.test(password);
  return hasSpecialChar;
};

export const isSpaceValid = (password: string): boolean => {
  const noSpace = spacesRegex.test(password);
  return noSpace;
};

export const validatePhoneNumber = (phoneNumber: string, country: string) => {
  let isPhoneNumberValid = false;
  if (country === "NG") {
    isPhoneNumberValid = phoneNumber.length === 11;
  } else {
    isPhoneNumberValid = phoneNumber.length === 10;
  }

  return isPhoneNumberValid;
};

export const replaceCharactersWithString = (str: string): string => {
  return str.replace(/\D/g, "");
};

export const addSpaceBeforeUppercase = (str: string): string => {
  return str?.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const keyAndValueInAChip = (
  key: string,
  value: string | number
): string => {
  return `${addSpaceBeforeUppercase(
    key.charAt(0).toUpperCase() + key.slice(1)
  )}: ${value}`;
};

export const getInitialsFromName = (
  firstName: string,
  lastName: string
): string => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
};

export const mapRentalAvailabilityToArray = (days: {
  [key: string]: boolean;
}): string[] => {
  return Object.keys(days).filter((day) => days[day]);
};

export const mapRentalAvailabilityArrayToObject = (
  daysArray: string[]
): {
  [key: string]: boolean;
} => {
  return daysOfTheWeek.reduce((acc, day) => {
    acc[day] = daysArray.includes(day);
    return acc;
  }, {} as { [key: string]: boolean });
};

export const copyToCipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const formatNumberWithCommas = (number: string | number): string => {
  return number?.toLocaleString();
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const firstPart = phoneNumber.slice(0, 3);
  const lastPart = phoneNumber.slice(-3);
  const middlePart = "*".repeat(phoneNumber.length - 6);

  return `${firstPart}${middlePart}${lastPart}`;
};

export const calculateServiceFee = (
  price: number,
  standardFee: number
): number => {
  return price * standardFee;
};

export const calculateRateGuestsWillSee = (
  price: number,
  serviceFee: number
): number => {
  return price + serviceFee;
};

// ============================= Notification Icons, Color and Bg Color starts ============================= //
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return Icons.ic_booking_request;
    case NotificationType.BOOKING_CONFIRMED:
      return Icons.ic_booking_confirmed;
    case NotificationType.BOOKING_CANCELED:
      return Icons.ic_booking_canceled;
    case NotificationType.UPCOMING_BOOKING:
      return Icons.ic_upcoming_booking;
    case NotificationType.GUEST_CHECK_IN:
      return Icons.ic_check_in;
    case NotificationType.GUEST_CHECK_OUT:
      return Icons.ic_check_out;
    case NotificationType.VEHICLE_ACCEPTED:
      return Icons.ic_car;
    case NotificationType.PAYMENT_RECEIVED:
      return Icons.ic_payment_received;
    case NotificationType.SECURITY_ALERT:
      return Icons.ic_lock;
    case NotificationType.NEW_REVIEW:
      return Icons.ic_star_square;
    case NotificationType.SPECIAL_OFFER:
      return Icons.ic_upcoming_booking;
    default:
      return Icons.ic_lock;
  }
};

export const getNotificationIconColor = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return "text-primary-600";
    case NotificationType.BOOKING_CONFIRMED:
      return "text-success-600";
    case NotificationType.BOOKING_CANCELED:
      return "text-error-900";
    case NotificationType.UPCOMING_BOOKING:
      return "text-warning-400";
    case NotificationType.GUEST_CHECK_IN:
      return "text-grey-700";
    case NotificationType.GUEST_CHECK_OUT:
      return "text-grey-700";
    case NotificationType.VEHICLE_ACCEPTED:
      return "text-success-600";
    case NotificationType.PAYMENT_RECEIVED:
      return "text-success-600";
    case NotificationType.SECURITY_ALERT:
      return "text-error-900";
    case NotificationType.NEW_REVIEW:
      return "text-warning-400";
    case NotificationType.SPECIAL_OFFER:
      return "text-warning-400";
    default:
      return "text-grey-700";
  }
};

export const getNotificationBgColor = (type: string) => {
  switch (type) {
    case NotificationType.BOOKING_REQUEST:
      return "bg-primary-75";
    case NotificationType.BOOKING_CONFIRMED:
      return "bg-success-75";
    case NotificationType.BOOKING_CANCELED:
      return "bg-error-100";
    case NotificationType.UPCOMING_BOOKING:
      return "bg-warning-75";
    case NotificationType.GUEST_CHECK_IN:
      return "bg-grey-90";
    case NotificationType.GUEST_CHECK_OUT:
      return "bg-grey-90";
    case NotificationType.VEHICLE_ACCEPTED:
      return "bg-success-75";
    case NotificationType.PAYMENT_RECEIVED:
      return "bg-success-75";
    case NotificationType.SECURITY_ALERT:
      return "bg-error-100";
    case NotificationType.NEW_REVIEW:
      return "bg-warning-75";
    case NotificationType.SPECIAL_OFFER:
      return "bg-warning-75";
    default:
      return "bg-grey-90";
  }
};
// ============================= Notification Icons, Color and Bg Color ends ============================= //

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const handleFilterQuery = ({
  filters,
  month,
  year,
  search,
  startDate,
  endDate,
}: {
  filters: Record<string, string[]>;
  month?: number;
  year?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const filterQuery = new URLSearchParams();
  Object.entries(filters).forEach(([key, values]) => {
    values.forEach((value) => {
      if (key === "vehicle")
        return filterQuery.append("vehicleId", value.toString());
      else return filterQuery.append(key, value);
    });
  });

  if (month) filterQuery.append("month", month.toString());
  if (year) filterQuery.append("year", year.toString());
  if (search) filterQuery.append("search", search.toString());
  if (startDate) filterQuery.append("startDate", startDate.toString());
  if (endDate) filterQuery.append("endDate", endDate.toString());

  return encodeURIComponent(filterQuery.toString());
};

export const handleErrors = (
  error: AxiosError<ErrorResponse>,
  page?: string
) => {
  console.log(
    `${page} error`,
    error,
    error.response?.status,
    error.response?.data
  );

  const ERR_CODE = error.response?.data?.ERR_CODE;

  if (error?.message === "Network Error") {
    console.log(error);
    return toast.error("Network Error");
  }

  if (error.response?.status === 500) {
    return toast.error(error.response?.data?.message);
  }

  if (ERR_CODE === "USER_ALREADY_EXIST") {
    return toast.error("Email already registered");
  }

  if (ERR_CODE === "PHONE_ALREADY_USED") {
    return toast.error("Phone number already registered");
  }

  if (ERR_CODE === "INVALID_CREDENTIALS") {
    return toast.error("Invalid login credentials");
  }

  if (ERR_CODE === "USER_NOT_FOUND") {
    return toast.error("User not found");
  }

  if (ERR_CODE === "EMAIL_NOT_CONFIRMED") {
    toast.error("Email not verified");
    const parsedData = JSON.parse(error.config?.data);
    console.log(parsedData);

    window.location.href = `/verify-email?email=${encodeURIComponent(
      parsedData?.email ?? ""
    )}`;
    return;
  }

  if (ERR_CODE === "EMAIL_ALREADY_CONFIRMED") {
    return toast.error("Email already confirmed");
  }

  if (ERR_CODE === "PHONE_NUMBER_NOT_FOUND") {
    return toast.error("Phone Number not found");
  }

  if (ERR_CODE === "HOST_NOT_OWNER_OF_VEHICLE") {
    return toast.error("Host not owner of vehicle");
  }

  if (ERR_CODE === "INCORRECT_OTP") {
    return toast.error("Incorrect OTP");
  }

  if (
    ERR_CODE === "NO_WITHDRAWAL_ACCOUNT_FOUND" ||
    ERR_CODE === "RENTAL_AVALIABLITY_NOT_FOUND" ||
    ERR_CODE === "WALLET_NOT_FOUND "
  ) {
    return;
  }

  if (ERR_CODE) {
    return toast.error(ERR_CODE);
  }

  if (error.response?.data?.message) {
    return toast.error(error.response.data.message);
  }

  return {};
};
