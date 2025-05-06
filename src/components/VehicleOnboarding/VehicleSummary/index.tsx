import cn from "classnames";
import Link from "next/link";
import { StepperNavigation } from "@/components/shared/stepper";
import { SingleCheckBox } from "@/components/shared/checkbox";
import { useAppSelector } from "@/lib/hooks";
import useVehicleSummary from "@/components/VehicleOnboarding/VehicleSummary/useVehicleSummary";
import ViewAsCustomer from "@/components/VehicleOnboarding/VehicleSummary/ViewAsCustomer";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function VehicleSummary({
  steps,
  currentStep,
  setCurrentStep,
}: Props) {
  const { vehicle } = useAppSelector((state) => state.vehicleOnboarding);

  const { submitVehicleOnboarding, agreeToTerms, setAgreeToTerms } =
    useVehicleSummary({ vehicle, currentStep, setCurrentStep });

  return (
    <div className="space-y-11">
      <ViewAsCustomer vehicle={vehicle} />

      <div>
        {/* checkbox */}
        <p className="text-xs md:text-xl 3xl:text-h6 !font-normal flex items-center gap-3">
          <SingleCheckBox
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(isChecked: boolean) => {
              setAgreeToTerms(isChecked);
            }}
          />
          By submitting your vehicle you agree to the Rental{" "}
          <Link href="/" className="text-primary-500">
            Terms and Services
          </Link>
        </p>
      </div>

      <StepperNavigation
        submitText="Submit Vehicle"
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleSubmit={() => {
          submitVehicleOnboarding.mutate();
        }}
        isSubmitloading={submitVehicleOnboarding.isPending}
        disableSubmitButton={!agreeToTerms}
        disableSaveDraftButton
      />
    </div>
  );
}

const SectionTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <h6
    className={cn("text-grey-700 text-xl 3xl:text-h6 !font-medium", className)}
  >
    {text}
  </h6>
);

const PricingTitle = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-xs md:text-base 3xl:text-xl", className)}>{text}</p>
);

const PricingDescription = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <p className={cn("text-sm md:text-xl 3xl:text-h6 !font-medium", className)}>
    {text}
  </p>
);
