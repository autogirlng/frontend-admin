"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/core/form-field/InputField";
import SelectInputField from "../components/core/form-field/SelectField";
import CheckboxGroup from "../components/core/form-field/CheckboxGroup";

const initialValues = {
  licensePlate: "",
  stateOfRegistration: "",
  vehicleDescription: "",
  vehicleFeatures: [],
  vehicleColor: "",
  numberOfSeats: "",
};

const validationSchema = Yup.object({
  licensePlate: Yup.string().required("Required"),
  stateOfRegistration: Yup.string().required("Required"),
  vehicleDescription: Yup.string().required("Required"),
  vehicleFeatures: Yup.array().min(1, "Select at least one feature"),
  vehicleColor: Yup.string().required("Required"),
  numberOfSeats: Yup.string().required("Required"),
});

const vehicleFeaturesList = [
  "All wheel drive",
  "Android auto",
  "Apple car play",
  "Aux Input",
  "Backup camera",
  "Bike rack",
  "Blind spot warning",
  "Bluetooth",
  "Child seat",
  "Convertible",
  "GPS",
  "Heated seats",
  "Keyless entry",
  "Pet friendly",
  "Ski rack",
  "USB Charger",
  "Sunroof",
  "Toll pass",
  "USB input",
  "Wheelchair accessible",
];

interface AdditionalVehicleFormProps {
  onFormValidationChange: (isValid: boolean) => void;
}

const AdditionalVehicleForm: React.FC<AdditionalVehicleFormProps> = ({
  onFormValidationChange = () => {},
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount
      onSubmit={(values) => {
        console.log("Form Data:", values); // Save form data here
      }}
    >
      {({ isValid, dirty }) => {
        onFormValidationChange?.(isValid && dirty);

        return (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto p-6">
            <InputField
              name="licensePlate"
              label="License Plate Number"
              placeholder="Enter license plate number"
            />
            <InputField
              name="stateOfRegistration"
              label="State Of Registration"
              placeholder="Enter state of registration"
            />

            {/* Text Area */}
            <div className="col-span-2">
              <InputField
                multiline={true}
                name="vehicleDescription"
                label="Vehicle Description"
                placeholder="E.g 2015 Toyota Camry with good fuel efficiency, spacious interior, and advanced safety features.
                 Perfect for city driving and long trips. Includes GPS, Bluetooth connectivity, and a sunroof."
              />
            </div>

            {/* Checkboxes for Features */}
            <CheckboxGroup
              name="vehicleFeatures"
              label="Vehicle Features"
              options={vehicleFeaturesList}
            />

            <SelectInputField
              name="vehicleColor"
              label="Vehicle Color"
              options={["Red", "Blue", "Orange", "Black", "White"]}
            />

            <InputField
              name="numberOfSeats"
              label="Number Of Seats"
              placeholder="E.g 4"
              type="number"
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default AdditionalVehicleForm;
