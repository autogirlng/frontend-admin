import React, { useEffect, useState } from "react";
import {
  calculateRateGuestsWillSee,
  calculateServiceFee,
} from "@/utils/functions";
import { standardServiceFeeInPercentage } from "@/utils/constants";
import InputField from "@/components/shared/inputField";
import Tooltip from "@/components/shared/tooltip";
import {
  formatNumberWithCommas,
  isPercentageField,
  stripNonNumeric,
} from "@/utils/formatters";

type PricingRowNewProps = {
  optional?: boolean;
  title: string;
  rateLabel: string;
  rateName: string;
  ratePlaceholder: string;
  rateUnit: string;
  serviceFeeName: string;
  guestWillSeeName: string;
  // Change 1: Allow rateValue to be undefined
  rateValue: string | undefined;
  errors: any;
  touched: any;
  tooltipDescription?: string;
  tooltipTitle?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const PricingRowNew = ({
  optional,
  title,
  rateLabel,
  rateName,
  ratePlaceholder,
  rateUnit,
  serviceFeeName,
  guestWillSeeName,
  rateValue,
  errors,
  touched,
  tooltipDescription = "",
  tooltipTitle = "",
  handleChange,
  handleBlur,
}: PricingRowNewProps) => {
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [guestWillSee, setGuestWillSee] = useState<number>(0);

  const handleFormattedNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    let cleaned = stripNonNumeric(value);

    if (isPercentageField(name)) {
      if (Number(cleaned) > 100) cleaned = "100";
      e.target.value = cleaned ? `${cleaned}%` : "";
    } else {
      e.target.value = formatNumberWithCommas(cleaned);
    }

    handleChange(e);
  };

  useEffect(() => {
    // Change 2: Safely handle potentially undefined rateValue
    const currentRateValue = rateValue ?? "";
    const unformatted = stripNonNumeric(currentRateValue.replace(/%/g, ""));
    const value = parseFloat(unformatted);

    if (currentRateValue === "" || isNaN(value)) {
      setServiceFee(0);
      setGuestWillSee(0);
    } else {
      const calculatedFee = calculateServiceFee(
        value,
        standardServiceFeeInPercentage
      );
      setServiceFee(calculatedFee);
      setGuestWillSee(calculateRateGuestsWillSee(value, calculatedFee));
    }
  }, [rateValue]);

  return (
    <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap gap-6 md:items-center justify-between w-full pb-10 sm:pb-5 md:pb-0">
      <p className=" text-sm  text-nowrap min-w-[200px] text-grey-600">
        <span className="label font-semibold flex justify-between items-center gap-1 text-sm">
          {title}
          {tooltipDescription && (
            <Tooltip
              title={tooltipTitle || ""}
              description={tooltipDescription || ""}
            />
          )}
        </span>
        {optional && (
          <>
            <br /> (optional)
          </>
        )}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap lg:flex-nowrap gap-8">
        <div className="flex items-center gap-2">
          <InputField
            name={rateName}
            id={rateName}
            type="text"
            label={rateLabel}
            placeholder={ratePlaceholder}
            // Change 3: Provide a fallback for the value prop
            value={rateValue ?? ""}
            onChange={handleFormattedNumberChange}
            onBlur={handleBlur}
            error={
              errors[rateName] && touched[rateName] ? errors[rateName] : ""
            }
            inputClass="text-right"
            className="sm:w-[150px] md:w-[180px]"
          />
          <p className="text-sm text-nowrap mt-5">{rateUnit}</p>
        </div>
        <div className="flex items-center gap-2">
          <InputField
            name={serviceFeeName}
            id={serviceFeeName}
            type="text"
            label="Service fee"
            placeholder="+NGN0"
            value={`+NGN${formatNumberWithCommas(serviceFee.toFixed(2))}`}
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
            value={`NGN${formatNumberWithCommas(guestWillSee.toFixed(2))}`}
            inputClass="text-right"
            className="sm:w-[150px] md:w-[180px]"
            disabled
          />
          <p className="text-sm text-nowrap mt-5">{rateUnit} </p>
        </div>
      </div>
    </div>
  );
};

export default PricingRowNew;
