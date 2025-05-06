import Image from "next/image";
import { ReactNode } from "react";

const Tips = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="py-2 md:py-7 3xl:py-9 px-2 md:px-6 3xl:px-[39px] bg-grey-75 h-fit md:max-w-[390px] 3xl:max-w-[490px] w-full min-w-[200px] rounded-[45px] text-grey-600 space-y-6">
      <div className="flex gap-3 items-center">
        <Image
          src="/icons/bulb.png"
          alt=""
          width={52}
          height={52}
          className="w-8 md:w-10 3xl:w-[52px] h-8 md:h-10 3xl:h-[52px]"
        />
        <h5 className="text-black text-base md:text-h5 !font-normal">Tips</h5>
      </div>
      {children}
    </div>
  );
};

export default Tips;
