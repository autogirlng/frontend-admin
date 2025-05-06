import React, { useEffect, useState } from "react";
import InputField from "@/components/shared/inputField";

import { formatNumberWithCommas, stripNonNumeric } from "@/utils/formatters";

type DiscountRowProps = {
  title: string;
  dailyRateValue?: string;
  percentageLabel: string;
  percentageName: string;
  percentagePlaceholder: string;
  rateUnit: string;
  serviceFeeName: string;
  rateValue: string;
  errors: any;
  touched: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const DiscountRow = ({
  title,
  dailyRateValue = "0",
  percentageLabel,
  percentageName,
  percentagePlaceholder,
  rateUnit,
  serviceFeeName,
  rateValue,
  errors,
  touched,
  handleChange,
  handleBlur,
}: DiscountRowProps) => {
  const [whatYouWillReceive, setWhatYouWillReceive] = useState<number>(0);

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let cleaned = stripNonNumeric(value);
    if (Number(cleaned) > 100) cleaned = "100";

    e.target.value = `${cleaned}%`;
    handleChange(e);
  };

  const calculateDiscount = (daily: string, rate: string): number => {
    const dailyRate = parseFloat(stripNonNumeric(daily));
    const discountRate = parseFloat(stripNonNumeric(rate));
    const discountAmount = (discountRate / 100) * dailyRate;
    return dailyRate - discountAmount;
  };

  useEffect(() => {
    if (!dailyRateValue || !rateValue) {
      setWhatYouWillReceive(0);
      return;
    }
    const received = calculateDiscount(dailyRateValue, rateValue);
    setWhatYouWillReceive(received);
  }, [dailyRateValue, rateValue]);

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center justify-between w-full pb-10 sm:pb-5 md:pb-0">
      <p className="text-sm font-semibold text-nowrap min-w-[200px] text-grey-600">
        {title}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-8">
        {/* Percentage Input */}
        <div className="flex items-center gap-2">
          <InputField
            name={percentageName}
            id={percentageName}
            type="text"
            label={percentageLabel}
            placeholder={percentagePlaceholder}
            value={rateValue}
            onChange={handleFormattedChange}
            onBlur={handleBlur}
            error={
              errors[percentageName] && touched[percentageName]
                ? errors[percentageName]
                : ""
            }
            inputClass="text-right"
            className="sm:w-[150px] md:w-[180px]"
          />
          <p className="text-sm text-nowrap mt-5">/day</p>
        </div>

        {/* You'll receive */}
        <div className="flex items-center gap-2">
          <InputField
            name={serviceFeeName}
            id={serviceFeeName}
            type="text"
            label="You'll receive"
            placeholder="NGN0"
            value={`NGN${formatNumberWithCommas(
              whatYouWillReceive.toString()
            )}`}
            inputClass="text-right"
            className="sm:w-[150px] md:w-[180px]"
            disabled
          />
          <p className="text-sm text-nowrap mt-5">{rateUnit}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscountRow;
