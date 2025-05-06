import { TipsPopup } from "@/components/shared/popup";
import Tips from "@/components/VehicleOnboarding//Tips";
import AdditionalInformationForm from "./AdditionalInformationForm";
import AdditionalInformationTips from "./AdditionalInformationTips";

const AdditionalInformation = ({
  steps,
  currentStep,
  setCurrentStep,
}: {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  return (
    <div className="flex justify-between flex-col-reverse md:flex-row gap-8">
      <AdditionalInformationForm
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      <DesktopTips />
      <MobileTips />
    </div>
  );
};

const DesktopTips = () => (
  <div className="hidden md:block">
    <Tips>
      <AdditionalInformationTips />
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
          <AdditionalInformationTips />
        </Tips>
      }
    />
  </div>
);

export default AdditionalInformation;
