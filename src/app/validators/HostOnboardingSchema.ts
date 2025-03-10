import * as Yup from "yup";

export const hostOnboardingSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  businessName: Yup.string().when("isBusinessActive", {
    is: true,
    then: (schema) => schema.required("Business name is required"),
  }),
  businessAddress: Yup.string().when("isBusinessActive", {
    is: true,
    then: (schema) => schema.required("Business address is required"),
  }),
  businessPhone: Yup.string().when("isBusinessActive", {
    is: true,
    then: (schema) => schema.required("Business phone is required"),
  }),
  businessEmail: Yup.string().when("isBusinessActive", {
    is: true,
    then: (schema) =>
      schema.email("Invalid email").required("Business email is required"),
  }),
});
