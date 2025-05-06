import { TipsPopup } from "@/components/shared/popup";
import Tips from "@/components/VehicleOnboarding//Tips";
import AvailabilityAndPricingForm from "./AvailabilityAndPricingForm";
import AvailabilityAndPricingTips from "./AvailabilityAndPricingTips";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function AvailabilityAndPricing({
  steps,
  setCurrentStep,
  currentStep,
}: Props) {
  return (
    <div className="flex justify-between flex-col-reverse md:flex-row gap-8">
      <AvailabilityAndPricingForm
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <DesktopTips />
      <MobileTips />
    </div>
  );
}

const DesktopTips = () => (
  <div className="hidden md:block">
    <Tips>
      <AvailabilityAndPricingTips />
    </Tips>
  </div>
);

const MobileTips = () => (
  <div className="block md:hidden">
    <TipsPopup
      trigger={
        <button className="w-full">
          <Tips />
        </button>
      }
      content={
        <Tips>
          <AvailabilityAndPricingTips />
        </Tips>
      }
    />
  </div>
);
