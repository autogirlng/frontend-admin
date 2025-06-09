import { TipsPopup } from "@/components/shared/popup";
import Tips from "@/components/VehicleOnboarding//Tips";
import DocumentInformationTips from "./DocumentInformationTip";
import DocumentInformationForm from "./DocumentInformationForm";

const DocumentInformation = ({
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
      <DocumentInformationForm
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
      <DocumentInformationTips />
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
          <DocumentInformationTips />
        </Tips>
      }
    />
  </div>
);

export default DocumentInformation;
