import { Formik, Form } from "formik";
import { StepperNavigation } from "@/components/shared/stepper";
import { GroupCheckBox } from "@/components/shared/checkbox";
import SelectInput from "@/components/shared/select";
import AppSwitch from "@/components/shared/switch";
import Icons from "@/components/shared/icons";
import FormRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/FormRow";
import PricingRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/PricingRow";
import DiscountRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/DiscountRow";
import OutskirtRow from "@/components/VehicleOnboarding/AvailabilityAndPricing/OutskirtRow";
import useAvailabilityAndPricingForm from "@/components/VehicleOnboarding/AvailabilityAndPricing/useAvailabilityAndPricingForm";
import {
  outskirtsLocationOptions,
  vehicleAvailabilityOptions,
} from "@/utils/data";
import { availabilityAndPricingSchema } from "@/utils/validationSchema";
import Tooltip from "@/components/shared/tooltip";
import { useState } from "react";
import { useOutskirtLocations } from "./useOutskirtLocation";
import { useExtremeAreas } from "./useExtremeAreas";
import { Spinner } from "@/components/shared/spinner";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const AvailabilityAndPricingForm = ({
  steps,
  setCurrentStep,
  currentStep,
}: Props) => {
  const {
    submitStep4,
    saveStep4,
    mapValuesToApiPayload,
    initialValues,
    showOuskirts,
    setShowOuskirts,
    showExtremeAreas,
    setShowExtremeAreas,
  } = useAvailabilityAndPricingForm({ currentStep, setCurrentStep });
  const [showDiscount, setShowDiscount] = useState(
    Boolean(
      initialValues.sevenDaysDiscount ||
        initialValues.threeDaysDiscount ||
        initialValues.thirtyDaysDiscount
    )
  );

  const {
    data: outskirtLocations,
    isLoading,
    error,
  } = useOutskirtLocations(showOuskirts);

  const {
    data: extremeAreas,
    isLoading: isExtremeAreasLoading,
    error: extremeAreasError,
  } = useExtremeAreas(showExtremeAreas);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={availabilityAndPricingSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Form values:", values);
        const payload = mapValuesToApiPayload(values);
        submitStep4.mutate(payload);
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
        <Form className="w-full md:w-[calc(100%-250px)] space-y-[72px]">
          <div className="max-w-[800px] w-full space-y-[72px]">
            <FormRow
              title="Advance notice"
              description=" How much advance notice do you need before the trip starts?"
            >
              <SelectInput
                id="advanceNoticeInDays"
                label="Advance notice"
                placeholder="1 day"
                variant="outlined"
                className="max-w-[375px]"
                options={vehicleAvailabilityOptions}
                value={values.advanceNoticeInDays}
                onChange={(value: string) => {
                  setFieldTouched("advanceNoticeInDays", true);
                  setFieldValue("advanceNoticeInDays", value);
                }}
                error={
                  errors.advanceNoticeInDays && touched.advanceNoticeInDays
                    ? errors.advanceNoticeInDays
                    : ""
                }
                info
                tooltipTitle="Advance Notice"
                tooltipDescription=" Set the amount of time in advance that rental requests should be made to ensure availability."
              />
            </FormRow>
            <FormRow
              title="Trip duration"
              description="What’s the shortest and longest trip you’ll accept?"
            >
              <div className="max-w-[770px] flex flex-col sm:flex-row gap-5">
                <SelectInput
                  id="minTripDurationInDays"
                  label="Minimum trip duration"
                  placeholder="1 day"
                  variant="outlined"
                  options={[{ value: "1 day", option: "1 day" }]}
                  value={values.minTripDurationInDays}
                  disabled
                  info
                  tooltipTitle="Minumum Duration"
                  tooltipDescription="This is the shortest distance you can provide for this vehicle and the standard is 1 day, which equals 12 hours - non-editable."
                />
                <SelectInput
                  id="maxTripDurationInDays"
                  label="Maximum trip duration"
                  placeholder="1 day"
                  variant="outlined"
                  options={[
                    { value: "1 day", option: "1 day" },
                    { value: "2 days", option: "2 days" },
                    { value: "3 days", option: "3 days" },
                    { value: "1 week", option: "1 week" },
                  ]}
                  value={values.maxTripDurationInDays}
                  onChange={(value: string) => {
                    setFieldTouched("maxTripDurationInDays", true);
                    setFieldValue("maxTripDurationInDays", value);
                  }}
                  error={
                    errors.maxTripDurationInDays &&
                    touched.maxTripDurationInDays
                      ? errors.maxTripDurationInDays
                      : ""
                  }
                  info
                  tooltipTitle="Maximum Duration"
                  tooltipDescription=" Define the longest duration you are comfortable providing rental services."
                />
              </div>
            </FormRow>

            {/* <FormRow title="Self-drive eligibility">
              <SelectInput
                id="selfDrive"
                label="Is your vehicle for self-driving services?"
                placeholder="No"
                variant="outlined"
                className="max-w-[375px]"
                options={[
                  { value: "yes", option: "Yes" },
                  { value: "no", option: "No" },
                ]}
                value={values.selfDrive}
                onChange={(value: string) => {
                  setFieldTouched("selfDrive", true);
                  setFieldValue("selfDrive", value);
                }}
                error={
                  errors.selfDrive && touched.selfDrive ? errors.selfDrive : ""
                }
                info
                tooltipTitle=""
                tooltipDescription=""
              />
            </FormRow> */}
            <FormRow title="Additional Services">
              <div className="max-w-[770px] flex flex-col sm:flex-row gap-5">
                <SelectInput
                  id="driverProvided"
                  label="Will you provide a driver?"
                  placeholder="Yes/No"
                  variant="outlined"
                  options={[
                    { value: "yes", option: "Yes" },
                    { value: "no", option: "No" },
                  ]}
                  value={values.driverProvided}
                  onChange={(value: string) => {
                    setFieldTouched("driverProvided", true);
                    setFieldValue("driverProvided", value);
                  }}
                  error={
                    errors.driverProvided && touched.driverProvided
                      ? errors.driverProvided
                      : ""
                  }
                  info
                  tooltipTitle=""
                  tooltipDescription="Indicate if you are offering a driver along with your rental services for a complete experience. Accommodation should be provided for drivers for journey or 24 hours bookings."
                />
                <SelectInput
                  id="fuelProvided"
                  label="Will you provide at least 20 liters of fuel?"
                  placeholder="Yes/No"
                  variant="outlined"
                  options={[
                    { value: "yes", option: "Yes" },
                    { value: "no", option: "No" },
                  ]}
                  value={values.fuelProvided}
                  onChange={(value: string) => {
                    setFieldTouched("fuelProvided", true);
                    setFieldValue("fuelProvided", value);
                  }}
                  error={
                    errors.fuelProvided && touched.fuelProvided
                      ? errors.fuelProvided
                      : ""
                  }
                  info
                  tooltipTitle=""
                  tooltipDescription="We will provide 15 litres of fuel for your ride, in the event the fuel finishes during trips, you will be responsible for fueling an amount that can complete your ride."
                />
              </div>
            </FormRow>
          </div>

          <div className="space-y-8">
            <p className="text-h6 3xl:text-h5 font-medium text-black">
              Pricing
            </p>
            <div className="space-y-8 3xl:space-y-[50px]">
              <PricingRow
                title="What is your daily rate?"
                rateLabel="You'll receive"
                rateName="dailyRate"
                ratePlaceholder="NGN0"
                rateUnit="/day"
                serviceFeeName="serviceFeeDaily"
                guestWillSeeName="guestWillSeeDaily"
                tooltipTitle="Daily Rate"
                tooltipDescription=" Specify your standard rate for providing rental services per day."
                rateValue={values.dailyRate}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <PricingRow
                title="What is your extra hourly rate?"
                rateLabel="You'll receive"
                rateName="extraHourRate"
                ratePlaceholder="NGN0"
                rateUnit="/hr"
                serviceFeeName="serviceFeeHourly"
                guestWillSeeName="guestWillSeeHourly"
                rateValue={values.extraHourRate}
                tooltipDescription="Indicate the additional charge for any extra hours beyond the daily booking duration."
                tooltipTitle="Hourly Rate"
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <PricingRow
                title="Airport pickups & dropoffs"
                rateLabel="You'll receive"
                rateName="airportPickup"
                ratePlaceholder="NGN0"
                rateUnit="/hr"
                serviceFeeName="serviceFeeAirport"
                guestWillSeeName="guestWillSeeAirport"
                rateValue={values.airportPickup}
                errors={errors}
                touched={touched}
                tooltipDescription="Select if you are available for airport pick-ups and drop-offs to cater to travelers."
                tooltipTitle="Airport pickups & dropoffs"
                handleChange={handleChange}
                handleBlur={handleBlur}
                optional
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-h6 3xl:text-h5 font-medium text-black flex justify-between items-center gap-1">
                Discounts
                <Tooltip
                  title="Discounts"
                  description=" Mention any discounts you offer for long-term bookings, special promotions,
                     or specific customer groups."
                />
              </p>
              {!showDiscount && (
                <p
                  onClick={() => setShowDiscount(true)}
                  className="text-primary-500 font-medium text-sm 3xl:text-xl flex items-center gap-1 "
                >
                  {Icons.ic_add} <span>Add Discounts</span>
                </p>
              )}
              {showDiscount && (
                <p
                  onClick={() => {
                    setShowDiscount(false);
                    setFieldValue("sevenDaysDiscount", "");
                    setFieldValue("threeDaysDiscount", "");
                    setFieldValue("thirtyDaysDiscount", "");
                  }}
                  className="text-primary-500 cursor-pointer font-medium text-sm 3xl:text-xl flex items-center gap-1"
                >
                  {Icons.ic_remove} <span>Remove Discounts</span>
                </p>
              )}
            </div>
            {showDiscount && (
              <div className="space-y-8 3xl:space-y-[50px] pt-8">
                <DiscountRow
                  title="3+ days discount"
                  percentageLabel="Percentage discount"
                  percentageName="threeDaysDiscount"
                  percentagePlaceholder="10%"
                  rateUnit="for 3+ days trips"
                  serviceFeeName="serviceFeeDaily"
                  rateValue={values.threeDaysDiscount}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  dailyRateValue={values.dailyRate}
                />
                <DiscountRow
                  title="7+ days discount"
                  percentageLabel="Percentage discount"
                  percentageName="sevenDaysDiscount"
                  percentagePlaceholder="10%"
                  rateUnit="for 7+ days trips"
                  serviceFeeName="serviceFeeDaily"
                  rateValue={values.sevenDaysDiscount}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  dailyRateValue={values.dailyRate}
                />
                <DiscountRow
                  title="30+ days discount"
                  percentageLabel="Percentage discount"
                  percentageName="thirtyDaysDiscount"
                  percentagePlaceholder="10%"
                  rateUnit="for 30+ days trips"
                  serviceFeeName="serviceFeeDaily"
                  rateValue={values.thirtyDaysDiscount}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  dailyRateValue={values.dailyRate}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between gap-3">
              <p className="text-h6 3xl:text-h5 font-medium text-black flex justify-between items-center gap-1">
                Do you charge extra for outskirt locations?
                <Tooltip
                  title="Do you charge extra for outskirt locations?"
                  description="Do you charge extra for outskirt locations? Outskirts locations
                include but not limited to Sangotedo, Badagry, Amuwo Odofin,
                Festac Town, Alaba, Ikorodu Town, Agbara, Agege, Epe, Free Trade
                Zone, Igando, Akowonjo, Dopemu, Ajah, Agbado, Ojodu Berger,
                Ajegunle, Ibese, Iyana Ipaja, Alimoso, Ibeju Lekki."
                />
              </p>
              <AppSwitch
                id="outskirtLocations"
                name="outskirtLocations"
                value={showOuskirts}
                onChange={(checked) => {
                  setShowOuskirts(checked);
                  // Clear fields if the switch is turned off
                  if (!checked) {
                    setFieldValue("outskirtsPrice", "");
                    setFieldValue("outskirtsLocation", []);
                  }
                }}
              />
            </div>
            {showOuskirts && (
              <div className="space-y-8">
                <OutskirtRow
                  rateName="outskirtsPrice"
                  rateUnit="/day"
                  regularFeeName="regularFeeOutskirt"
                  guestWillSeeName="guestWillSeeOutskirt"
                  rateValue={values.outskirtsPrice}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  dailyRateValue={values.dailyRate}
                />
                <div className="space-y-3">
                  <label
                    htmlFor="features"
                    className="text-sm block font-medium text-black"
                  >
                    Outskirt Locations
                  </label>
                  <p className="text-sm text-grey-600">
                    Uncheck locations you do not want to visit with your vehicle
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-8">
                    {/* Render different states based on the query status */}
                    {isLoading && <Spinner />}
                    {error && (
                      <p className="text-error-500">
                        Failed to load locations.
                      </p>
                    )}

                    {/* Map over the fetched data from the hook */}
                    {outskirtLocations?.map((location) => (
                      <GroupCheckBox
                        key={location.id}
                        feature={location.name}
                        checkedValues={values.outskirtsLocation}
                        onChange={(feature: string, isChecked: boolean) => {
                          if (isChecked) {
                            const newValues = [
                              ...values.outskirtsLocation,
                              feature,
                            ];
                            setFieldValue("outskirtsLocation", newValues);
                          } else {
                            const newValues = values.outskirtsLocation.filter(
                              (value) => value !== feature
                            );
                            setFieldValue("outskirtsLocation", newValues);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between gap-3">
              <p className="text-h6 3xl:text-h5 font-medium text-black flex justify-between items-center gap-1">
                Do you charge extra for extreme areas?
                <Tooltip
                  title="Do you charge extra for extreme areas?"
                  description="Specify if you charge an additional fee for trips to locations considered extreme, such as areas with difficult terrain or remote zones."
                />
              </p>
              <AppSwitch
                id="extremeAreas"
                name="extremeAreas"
                value={showExtremeAreas}
                onChange={(checked) => {
                  setShowExtremeAreas(checked);
                  if (!checked) {
                    setFieldValue("extremeAreaPrice", "");
                    setFieldValue("extremeAreasLocation", []);
                  }
                }}
              />
            </div>
            {showExtremeAreas && (
              <div className="space-y-8">
                <OutskirtRow
                  rateName="extremeAreaPrice"
                  rateUnit="/day"
                  regularFeeName="regularFeeExtreme"
                  guestWillSeeName="guestWillSeeExtreme"
                  rateValue={values.extremeAreaPrice}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  dailyRateValue={values.dailyRate}
                />
                <div className="space-y-3">
                  <label
                    htmlFor="extreme-locations"
                    className="text-sm block font-medium text-black"
                  >
                    Extreme Areas
                  </label>
                  <p className="text-sm text-grey-600">
                    Uncheck locations you do not want to visit with your vehicle
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-8">
                    {isExtremeAreasLoading && <Spinner />}
                    {extremeAreasError && (
                      <p className="text-error-500">
                        Failed to load extreme areas.
                      </p>
                    )}
                    {extremeAreas?.map((location) => (
                      <GroupCheckBox
                        key={location.id}
                        feature={location.name}
                        checkedValues={values.extremeAreasLocation}
                        onChange={(feature: string, isChecked: boolean) => {
                          if (isChecked) {
                            const newValues = [
                              ...values.extremeAreasLocation,
                              feature,
                            ];
                            setFieldValue("extremeAreasLocation", newValues);
                          } else {
                            const newValues =
                              values.extremeAreasLocation.filter(
                                (value) => value !== feature
                              );
                            setFieldValue("extremeAreasLocation", newValues);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <StepperNavigation
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            handleSaveDraft={() => {
              const payload = mapValuesToApiPayload(values);
              saveStep4.mutate(payload);
            }}
            isSaveDraftloading={saveStep4.isPending}
            isNextLoading={isSubmitting || submitStep4.isPending}
            disableNextButton={
              !isValid || isSubmitting || submitStep4.isPending
              // ||disableNextButton
            }
          />
        </Form>
      )}
    </Formik>
  );
};

export default AvailabilityAndPricingForm;
