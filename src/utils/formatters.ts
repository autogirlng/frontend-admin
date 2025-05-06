// utils/formatters.ts

export const formatNumberWithCommas = (value: string) => {
  const number = value.replace(/,/g, "");
  if (!number || isNaN(Number(number))) return "";
  const [intPart, decimalPart] = number.split(".");
  return (
    Number(intPart).toLocaleString() + (decimalPart ? `.${decimalPart}` : "")
  );
};

export const stripNonNumeric = (value: string) => {
  return value.replace(/[^\d.]/g, "");
};

export const isPercentageField = (fieldName: string) => {
  const percentageFields = [
    "discount",
    "rateDiscount",
    "someOtherPercentField",
  ];
  return percentageFields.includes(fieldName);
};
