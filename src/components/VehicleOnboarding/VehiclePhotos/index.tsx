import { useEffect, useState } from "react";
import { TipsPopup } from "@/components/shared/popup";
import Tips from "@/components/VehicleOnboarding//Tips";
import VehiclePhotosForm from "@/components/VehicleOnboarding/VehiclePhotos/VehiclePhotosForm";
import VehiclePhotosTips from "@/components/VehicleOnboarding/VehiclePhotos/VehiclePhotosTips";

type Props = {
  steps: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const VehiclePhotos = ({ steps, currentStep, setCurrentStep }: Props) => {
  const [photoTipIndex, setPhotoTipIndex] = useState<number>(0);

  useEffect(() => {
    console.log(photoTipIndex);
  }, [photoTipIndex]);

  return (
    <div className="space-y-[52px]">
      <DesktopTips photoTipIndex={photoTipIndex} />
      <MobileTips photoTipIndex={photoTipIndex} />

      <VehiclePhotosForm
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setPhotoTipIndex={setPhotoTipIndex}
      />
    </div>
  );
};

const DesktopTips = ({ photoTipIndex }: { photoTipIndex: number }) => (
  <div className="hidden md:block">
    <VehiclePhotosTips photoTipIndex={photoTipIndex} />
  </div>
);

const MobileTips = ({ photoTipIndex }: { photoTipIndex: number }) => (
  <div className="block md:hidden">
    <TipsPopup
      trigger={
        <button className="w-full">
          <Tips />
        </button>
      }
      content={<VehiclePhotosTips photoTipIndex={photoTipIndex} />}
    />
  </div>
);

export default VehiclePhotos;
