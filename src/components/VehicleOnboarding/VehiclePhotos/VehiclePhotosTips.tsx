import Image from "next/image";
import { photoUploadTips } from "@/utils/data";

type Props = { photoTipIndex: number };

export default function VehiclePhotosTips({ photoTipIndex }: Props) {
  return (
    <div className="py-2 md:py-4 3xl:py-5 px-2 md:px-4 3xl:px-6 bg-grey-75 h-fit w-full rounded-[45px]">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex md:block gap-3 items-center min-w-fit">
          <Image
            src="/icons/bulb.png"
            alt=""
            width={72}
            height={72}
            className="w-8 md:w-[60px] 3xl:w-[72px] h-8 md:h-[60px] 3xl:h-[72px]"
          />
          <h5 className="text-black text-base md:text-h5 !font-normal block md:hidden">
            Tips
          </h5>
        </div>
        <div className="text-base 3xl:text-h6 text-grey-700">
          <p className="font-medium">
            {photoUploadTips[photoTipIndex || 0]?.title}
          </p>
          <p className="font-normal">
            {photoUploadTips[photoTipIndex || 0]?.description}{" "}
            {/* <button className="text-primary-400">View example</button> */}
          </p>
        </div>
      </div>
    </div>
  );
}
