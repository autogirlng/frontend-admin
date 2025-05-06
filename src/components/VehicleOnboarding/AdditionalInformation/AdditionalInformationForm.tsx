import { Formik, Form } from "formik";
import { GroupCheckBox } from "@/components/shared/checkbox";
import { StepperNavigation } from "@/components/shared/stepper";
import { addSpaceBeforeUppercase } from "@/utils/functions";
import { addtionalVehicleInformationSchema } from "@/utils/validationSchema";
import { vehicleColorsOptions, vehicleFeaturesOptions } from "@/utils/data";
import InputField from "@/components/shared/inputField";
import TextArea from "@/components/shared/textarea";
import SelectInput from "@/components/shared/select";
import FormRow from "../FormRow";
import useAdditionalInformationForm from "./useAdditionalInformationForm";

const AdditionalInformationForm = ({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const { submitStep2, saveStep2, initialValues } =
    useAdditionalInformationForm({ currentStep, setCurrentStep });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addtionalVehicleInformationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Form values:", values);
        submitStep2.mutate(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        touched,
        errors,
        isValid,
        dirty,
        handleBlur,
        handleChange,
        setFieldTouched,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form className="max-w-[800px] w-full space-y-8">
          <FormRow>
            <InputField
              name="licensePlateNumber"
              id="licensePlateNumber"
              type="text"
              label="License Plate Number"
              placeholder="E.g AB124-CDE"
              value={values.licensePlateNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.licensePlateNumber && touched.licensePlateNumber
                  ? errors.licensePlateNumber
                  : ""
              }
              info
              tooltipTitle="License plate number:"
              tooltipDescription="Your vehicle’s license plate number is required to verify its legal registration and for identification purposes."
            />

            <InputField
              name="stateOfRegistration"
              id="stateOfRegistration"
              type="text"
              label="State Of Registration"
              placeholder="Enter state of reg"
              value={values.stateOfRegistration}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.stateOfRegistration && touched.stateOfRegistration
                  ? errors.stateOfRegistration
                  : ""
              }
              info
              tooltipTitle="State of registration:"
              tooltipDescription="Knowing the state where your vehicle is registered helps us ensure compliance with local laws and regulations."
            />
          </FormRow>

          {/* text area*/}
          <TextArea
            name="vehicleDescription"
            id="vehicleDescription"
            type="text"
            label="Vehicle Description"
            placeholder={`E.g 2015 Toyota Camry with good fuel efficiency, spacious interior, and
advanced safety features. Perfect for city driving and long trips. Includes GPS,
Bluetooth connectivity, and a sunroof.`}
            value={values.vehicleDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.vehicleDescription && touched.vehicleDescription
                ? errors.vehicleDescription
                : ""
            }
            info
            tooltipTitle="Vehicle of description:"
            tooltipDescription="Providing a detailed description helps customers understand the unique features and specifications of your vehicle."
          />
          {/* vehicle features */}
          <div className="space-y-3">
            <label
              htmlFor="features"
              className="text-sm block font-medium text-nowrap text-grey-900"
            >
              Vehicle Features
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[50px] gap-y-3 max-w-[686px]">
              {vehicleFeaturesOptions.map((feature) => (
                <GroupCheckBox
                  key={feature}
                  feature={addSpaceBeforeUppercase(feature)}
                  checkedValues={values.features}
                  onChange={(feature: string, isChecked: boolean) => {
                    if (isChecked) {
                      const newValues = [...values.features, feature];
                      setFieldValue("features", newValues);
                    } else {
                      const newValues = values.features.filter(
                        (value) => value !== feature
                      );
                      setFieldValue("features", newValues);
                    }
                  }}
                />
              ))}
            </div>
            {errors.features && touched.features ? (
              <p className="text-error-500 text-sm mt-2 text-nowrap">
                {errors.features}
              </p>
            ) : (
              ""
            )}
          </div>

          <FormRow>
            <SelectInput
              id="vehicleColor"
              label="Vehicle Color"
              placeholder="Select vehicle color"
              variant="outlined"
              options={vehicleColorsOptions}
              value={values.vehicleColor}
              onChange={(value: string) => {
                setFieldTouched("vehicleColor", true);
                setFieldValue("vehicleColor", value);
              }}
              error={
                errors.vehicleColor && touched.vehicleColor
                  ? errors.vehicleColor
                  : ""
              }
              info
              tooltipTitle="Vehicle color:"
              tooltipDescription="Indicating your vehicle’s color is important for easy identification during customer pickups and possible inspections."
            />

            <InputField
              name="numberOfSeats"
              id="numberOfSeats"
              type="text"
              label="Number of seats"
              placeholder="Enter number of seats"
              value={values.numberOfSeats}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.numberOfSeats && touched.numberOfSeats
                  ? errors.numberOfSeats
                  : ""
              }
              info
              tooltipTitle="Number of seats:"
              tooltipDescription="Knowing how many seats your vehicle has allows customers to choose the right vehicle for their needs, especially for group rides."
            />
          </FormRow>

          <StepperNavigation
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            handleSaveDraft={() => {
              saveStep2.mutate(values);
            }}
            isSaveDraftloading={saveStep2.isPending}
            isNextLoading={isSubmitting || submitStep2.isPending}
            disableNextButton={
              !isValid || isSubmitting || submitStep2.isPending
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default AdditionalInformationForm;
