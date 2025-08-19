import { ChangeEvent } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { FullPageSpinner } from "@/components/shared/spinner";
import { StepperNavigation } from "@/components/shared/stepper";
import InputField from "@/components/shared/inputField";
import SelectInput from "@/components/shared/select";
import FormRow from "@/components/VehicleOnboarding/FormRow";
import useBasicInformationForm from "@/components/VehicleOnboarding/BasicInformation/useBasicInformationForm";
import { basicVehicleInformationSchema } from "@/utils/validationSchema";
import {
  citiesOptions,
  stateOptions,
  vehicleMakesOptions,
  vehicleModelsOptions,
  vehicleTypesOptions,
  yearOfReleaseOptions,
  yesOrNoOptions,
} from "@/utils/data";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const BasicVehicleInformationForm = ({
  steps,
  currentStep,
  setCurrentStep,
}: Props) => {
  const {
    submitStep1,
    saveStep1,
    initialValues,
    googlePlaces,
    searchAddressError,
    searchAddressLoading,
    setSearchAddressQuery,
    setShowAddressList,
    showAddressList,
  } = useBasicInformationForm({
    currentStep,
    setCurrentStep,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={basicVehicleInformationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Form values:", values);
        submitStep1.mutate(values);
        setSubmitting(false);
      }}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
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
              name="listingName"
              id="listingName"
              type="text"
              label="Vehicle Listing Name"
              placeholder="Enter vehicle listing name"
              value={values.listingName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.listingName && touched.listingName
                  ? errors.listingName
                  : ""
              }
              info
              tooltipTitle="Vehicle listing name:"
              tooltipDescription="Give your vehicle a name that will help potential renters easily recognize it. For example, you could use something like ‘Blue Toyota Camry 2018.’"
            />

            <SelectInput
              id="location"
              label="What city is your vehicle located?"
              placeholder="Select location"
              variant="outlined"
              options={stateOptions}
              value={values.location}
              onChange={(value: string) => {
                setFieldTouched("location", true);
                setFieldValue("location", value);
              }}
              error={errors.location && touched.location ? errors.location : ""}
              info
              tooltipTitle="What city is your vehicle located?"
              tooltipDescription="Select the city where the vehicle is primarily available for bookings. This ensures your vehicle is shown to users searching for vehicles in that specific city."
            />
          </FormRow>

          <div className="space-y-2">
            <InputField
              name="address"
              id="address"
              type="text"
              label="Address"
              placeholder="Enter address"
              value={values.address}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                setSearchAddressQuery(value);
                setFieldValue("address", value);
              }}
              onBlur={handleBlur}
              error={errors.address && touched.address ? errors.address : ""}
              info
              tooltipTitle="Address:"
              tooltipDescription="Provide the exact address where the vehicle is located when it’s not in use."
            />
            {(searchAddressLoading ||
              (googlePlaces.length > 0 && showAddressList)) && (
              <ul className="list-none border border-grey-300 rounded-xl py-4 px-2 w-full bg-white  max-h-[200px] overflow-auto shadow-[-2px_4px_6px_-2px_#10192808,12px_16px_37.4px_-4px_#10192814]">
                {searchAddressError ? (
                  <p>{searchAddressError}</p>
                ) : searchAddressLoading ? (
                  <FullPageSpinner className="!min-h-[100px]" />
                ) : (
                  googlePlaces.map((address, index) => (
                    <li
                      key={`address-${index}`}
                      onClick={() => {
                        setShowAddressList(false);
                        setFieldValue(
                          "address",
                          address?.formattedAddress || ""
                        );
                        setFieldValue(
                          "latitude",
                          String(address?.location?.latitude || "")
                        );
                        setFieldValue(
                          "longitude",
                          String(address?.location?.longitude || "")
                        );
                      }}
                      className="cursor-pointer hover:bg-primary-75 py-2 px-4 text-sm text-grey-900 rounded-xl"
                    >
                      {address?.formattedAddress || ""}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <FormRow>
            <SelectInput
              id="vehicleType"
              label="Vehicle Type"
              placeholder="Select vehicle type"
              variant="outlined"
              options={vehicleTypesOptions}
              value={values.vehicleType}
              onChange={(value: string) => {
                setFieldTouched("vehicleType", true);
                setFieldValue("vehicleType", value);
              }}
              error={
                errors.vehicleType && touched.vehicleType
                  ? errors.vehicleType
                  : ""
              }
              info
              tooltipTitle="Vehicle type:"
              tooltipDescription="Select the category that best describes your vehicle. This helps customers filter vehicles based on their needs and preferences."
            />

            <SelectInput
              id="make"
              label="Vehicle Make"
              placeholder="Select vehicle make"
              variant="outlined"
              options={vehicleMakesOptions}
              value={values.make}
              onChange={(value: string) => {
                setFieldTouched("make", true);
                setFieldValue("make", value);
              }}
              error={errors.make && touched.make ? errors.make : ""}
              info
              tooltipTitle="Vehicle make:"
              tooltipDescription="Specify the brand of the vehicle, such as Toyota, Ford, Honda, etc. This helps users identify the manufacturer of your vehicle"
            />
          </FormRow>

          <FormRow>
            <SelectInput
              id="model"
              label="Vehicle Model"
              placeholder="Select vehicle model"
              variant="outlined"
              options={vehicleModelsOptions}
              value={values.model}
              onChange={(value: string) => {
                setFieldTouched("model", true);
                setFieldValue("model", value);
              }}
              error={errors.model && touched.model ? errors.model : ""}
              info
              tooltipTitle="Vehicle model: "
              tooltipDescription="Select the specific model of your vehicle, such as ‘Civic,’ ‘Camry,’ or ‘Ranger.’ This, combined with the make and year, provides precise details about your vehicle."
            />

            <SelectInput
              id="yearOfRelease"
              label="Year of Release"
              placeholder="Select year of release"
              variant="outlined"
              options={yearOfReleaseOptions}
              value={values.yearOfRelease}
              onChange={(value: string) => {
                setFieldTouched("yearOfRelease", true);
                setFieldValue("yearOfRelease", value);
              }}
              error={
                errors.yearOfRelease && touched.yearOfRelease
                  ? errors.yearOfRelease
                  : ""
              }
              info
              tooltipTitle="Year of release:"
              tooltipDescription="Indicate the year your vehicle was manufactured. This helps customers assess the vehicle’s age and can influence their booking decision."
            />
          </FormRow>

          <FormRow>
            <SelectInput
              id="hasInsurance"
              label="Does your vehicle have insurance?"
              placeholder="Select an option"
              variant="outlined"
              options={yesOrNoOptions}
              value={values.hasInsurance}
              onChange={(value: string) => {
                setFieldTouched("hasInsurance", true);
                setFieldValue("hasInsurance", value);
              }}
              error={
                errors.hasInsurance && touched.hasInsurance
                  ? errors.hasInsurance
                  : ""
              }
              info
              tooltipTitle="Does your vehicle have insurance?"
              tooltipDescription="Let us know if your vehicle is currently insured. Providing insurance information increases the trust and security of potential bookings"
            />

            <SelectInput
              id="hasTracker"
              label="Does your vehicle have a tracker?"
              placeholder="Select an option"
              variant="outlined"
              options={yesOrNoOptions}
              value={values.hasTracker}
              onChange={(value: string) => {
                setFieldTouched("hasTracker", true);
                setFieldValue("hasTracker", value);
              }}
              error={
                errors.hasTracker && touched.hasTracker ? errors.hasTracker : ""
              }
              info
              tooltipTitle="Does your vehicle have a tracker?"
              tooltipDescription="Specify whether your vehicle is equipped with a GPS tracker. This feature is useful for safety, to track the vehicle's location when rented."
            />
          </FormRow>

          <StepperNavigation
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            handleSaveDraft={() => {
              if (values.listingName) {
                saveStep1.mutate(values);
              } else
                toast.error(
                  "Enter your vehicle listing name before you save to draft"
                );
            }}
            isSaveDraftloading={saveStep1.isPending}
            isNextLoading={isSubmitting || submitStep1.isPending}
            disableNextButton={
              !isValid || isSubmitting || submitStep1.isPending
              // ||disableNextButton
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default BasicVehicleInformationForm;
