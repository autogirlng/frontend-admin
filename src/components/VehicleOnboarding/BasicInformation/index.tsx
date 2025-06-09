import { TipsPopup } from "@/components/shared/popup";
import Tips from "@/components/VehicleOnboarding//Tips";
import BasicVehicleInformationForm from "@/components/VehicleOnboarding/BasicInformation/BasicInformationForm";
import BasicInformationTips from "@/components/VehicleOnboarding/BasicInformation/BasicInformationTips";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const BasicVehicleInformation = ({
  steps,
  currentStep,
  setCurrentStep,
}: Props) => {
  return (
    <div className="flex justify-between flex-col-reverse md:flex-row gap-8">
      <BasicVehicleInformationForm
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
      <BasicInformationTips />
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
          <BasicInformationTips />
        </Tips>
      }
    />
  </div>
);

export default BasicVehicleInformation;
