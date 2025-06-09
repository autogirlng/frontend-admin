import React, { useEffect, useState } from "react";
import InputField from "@/components/shared/inputField";
import {
  calculateRateGuestsWillSee,
  calculateServiceFee,
  formatNumberWithCommas,
} from "@/utils/functions";
import { standardServiceFeeInPercentage } from "@/utils/constants";

type OutskirtRowProps = {
  dailyRateValue?: string;
  rateName: string;
  rateUnit: string;
  regularFeeName: string;
  guestWillSeeName: string;
  rateValue: string;
  errors: any;
  touched: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const OutskirtRow = ({
  dailyRateValue,
  rateName,
  rateUnit,
  regularFeeName,
  guestWillSeeName,
  rateValue,
  errors,
  touched,
  handleChange,
  handleBlur,
}: OutskirtRowProps) => {
  const [guestWillSee, setGuestWillSee] = useState<number>(0);
  const [serviceFee, setServiceFee] = useState<number>(0);

  useEffect(() => {
    if (dailyRateValue) {
      const value = parseInt(rateValue);
      const dailyRate = parseInt(dailyRateValue || "");

      if (dailyRateValue === "" || rateValue === "" || isNaN(value)) {
        setGuestWillSee(0);
      } else {
        const calculatedFee = calculateServiceFee(
          value + dailyRate,
          standardServiceFeeInPercentage
        );
        setServiceFee(calculatedFee);

        setGuestWillSee(
          calculateRateGuestsWillSee(value + dailyRate, calculatedFee)
        );
      }
    } else {
      setGuestWillSee(0);
    }
  }, [rateValue, dailyRateValue]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-8 pt-8">
      <div className="flex items-center gap-2">
        <InputField
          name={rateName}
          id={rateName}
          type="text"
          label="Extra charge"
          placeholder="+NGN0"
          value={rateValue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors[rateName] && touched[rateName] ? errors[rateName] : ""}
          inputClass="text-right"
          className="sm:w-[150px] md:w-[180px]"
        />
        <p className="text-sm text-nowrap mt-5">{rateUnit}</p>
      </div>
      <div className="flex items-center gap-2">
        <InputField
          name={regularFeeName}
          id={regularFeeName}
          type="text"
          label="Your Regular fee"
          placeholder="NGN0"
          value={`NGN${dailyRateValue || 0}`}
          inputClass="text-right"
          className="sm:w-[150px] md:w-[180px]"
          disabled
        />
        <p className="text-sm text-nowrap mt-5">{rateUnit} </p>
      </div>
      <div className="flex items-center gap-2">
        <InputField
          name={guestWillSeeName}
          id={guestWillSeeName}
          type="text"
          label="Service Fee"
          placeholder="NGN0"
          value={`NGN${formatNumberWithCommas(serviceFee)}`}
          inputClass="text-right"
          className="sm:w-[150px] md:w-[180px]"
          disabled
        />
        <p className="text-sm text-nowrap mt-5">{rateUnit} </p>
      </div>
      <div className="flex items-center gap-2">
        <InputField
          name={guestWillSeeName}
          id={guestWillSeeName}
          type="text"
          label="Guests will see"
          placeholder="NGN0"
          value={`NGN${formatNumberWithCommas(guestWillSee)}`}
          inputClass="text-right"
          className="sm:w-[150px] md:w-[180px]"
          disabled
        />
        <p className="text-sm text-nowrap mt-5">{rateUnit} </p>
      </div>
    </div>
  );
};

export default OutskirtRow;
