import * as Yup from "yup";

export const vehicleOnboardingSchema = Yup.object({
  vehicleName: Yup.string().required("Vehicle name is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  vehicleType: Yup.string().required("Vehicle type is required"),
  vehicleMake: Yup.string().required("Vehicle make is required"),
  vehicleModel: Yup.string().required("Vehicle model is required"),
  yearOfRelease: Yup.string().required("Year of release is required"),
  hasInsurance: Yup.string().required("Insurance status is required"),
  hasTracker: Yup.string().required("Tracker status is required"),
});
