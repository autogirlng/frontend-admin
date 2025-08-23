import * as Yup from "yup";

// Renamed from signupFormValidationSchema
export const hostFormValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  outskirtsLocation: Yup.array().of(Yup.string()), // Optional, based on your form logic
  isOperatingAsBusiness: Yup.boolean(),
  businessName: Yup.string().when("isOperatingAsBusiness", {
    is: true,
    then: (schema) => schema.required("Business name is required"),
  }),
  businessAddress: Yup.string().when("isOperatingAsBusiness", {
    is: true,
    then: (schema) => schema.required("Business address is required"),
  }),
  businessNumber: Yup.string().when("isOperatingAsBusiness", {
    is: true,
    then: (schema) => schema.required("Business phone number is required"),
  }),
  businessCountry: Yup.string().when("isOperatingAsBusiness", {
    is: true,
    then: (schema) => schema.required("Business country is required"),
  }),
  businessEmail: Yup.string()
    .email("Invalid email")
    .when("isOperatingAsBusiness", {
      is: true,
      then: (schema) => schema.required("Business email is required"),
    }),
  mou: Yup.mixed().nullable(), // For file uploads, validation might be more complex
});
