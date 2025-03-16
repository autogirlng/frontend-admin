"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/core/form-field/InputField";
import SelectInputField from "../components/core/form-field/SelectField";

const vehicleMakes = [
  "Toyota",
  "Ford",
  "Honda",
  "Chevrolet",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
];

const initialValues = {
  listingName: "",
  city: "",
  address: "",
  vehicleType: "",
  vehicleMake: "",
  vehicleModel: "",
  yearOfRelease: "",
  hasInsurance: "",
  hasTracker: "",
};

const validationSchema = Yup.object({
  listingName: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  vehicleType: Yup.string().required("Required"),
  vehicleMake: Yup.string().required("Required"),
  vehicleModel: Yup.string().required("Required"),
  yearOfRelease: Yup.string().required("Required"),
  hasInsurance: Yup.string().required("Required"),
  hasTracker: Yup.string().required("Required"),
});

interface VehicleFormProps {
  onFormValidationChange: (isValid: boolean) => void;
}
const VehicleForm: React.FC<VehicleFormProps> = ({
  onFormValidationChange = () => {}, // Default no-op function
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={() => {}}
    >
      {({ isValid, dirty }) => {
        onFormValidationChange?.(isValid && dirty); // Optional chaining prevents crashes

        return (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto p-6">
            <InputField
              type="textArea"
              name="listingName"
              label="Vehicle listing name"
              placeholder="Enter vehicle name"
            />
            <InputField
              name="city"
              label="What city is your vehicle located?"
              placeholder="Enter city"
            />
            <div className="col-span-2">
              <InputField
                name="address"
                label="Address"
                placeholder="Enter full address"
              />
            </div>
            <SelectInputField
              name="vehicleType"
              label="Vehicle Type"
              options={vehicleMakes}
            />
            <SelectInputField
              name="vehicleMake"
              label="Vehicle Make"
              options={vehicleMakes}
            />
            <SelectInputField
              name="yearOfRelease"
              label="Year of Release"
              options={vehicleMakes}
            />
            <InputField
              name="vehicleModel"
              label="Vehicle Model"
              placeholder="Enter model"
            />
            <SelectInputField
              name="hasInsurance"
              label="Does your vehicle have insurance?"
              options={["Yes", "No"]}
            />
            <SelectInputField
              name="hasTracker"
              label="Does your vehicle have a tracker?"
              options={["Yes", "No"]}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default VehicleForm;
