import cn from "classnames";
import { ChangeEvent, FocusEvent, ReactNode } from "react";
import { EyeSlash, Eye, CheckCircle } from "@phosphor-icons/react";
import {
  isDigitValid,
  isLengthValid,
  isLowerCaseValid,
  isSpaceValid,
  isSpecialCharacterValid,
  isUpperCaseValid,
} from "@/utils/functions";
import { passwordChecks } from "@/utils/constants";
import InputField from "@/components/shared/inputField";

import { FormikErrors } from "formik";
import usePasswordValidation from '@/hooks/usePasswordValidation';

type Props = {
  name?: string;
  label?: string;
  placeholder?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<any>>;
  values: any;
  error: string;
  children?: ReactNode;
  showChecks?: boolean;
};

export default function PasswordChecks({
  name,
  label,
  placeholder,
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  error,
  showChecks = true,
  children,
}: Props) {
  const { isPasswordHidden, toggleHiddenPassword } = usePasswordValidation();

  return (
    <div className="space-y-3">
      <InputField
        name={name || "password"}
        id="password"
        type={isPasswordHidden ? "password" : "text"}
        label={label || "Password"}
        placeholder={placeholder || "Enter password"}
        icon={
          isPasswordHidden ? (
            <Eye size={20} fill="inherit" />
          ) : (
            <EyeSlash size={20} fill="inherit" />
          )
        }
        value={values.password}
        toggleShowPassword={toggleHiddenPassword}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          handleChange(event);
          const lengthValid = isLengthValid(event.target.value);
          const uppercaseValid = isUpperCaseValid(event.target.value);
          const lowercaseValid = isLowerCaseValid(event.target.value);
          const digitValid = isDigitValid(event.target.value);
          const specialCharacterValid = isSpecialCharacterValid(
            event.target.value
          );
          const spaceValid = isSpaceValid(event.target.value);

          setFieldValue("password_checks.length", lengthValid);
          setFieldValue("password_checks.uppercase_letters", uppercaseValid);
          setFieldValue("password_checks.lowercase_letters", lowercaseValid);
          setFieldValue("password_checks.digit", digitValid);
          setFieldValue(
            "password_checks.special_character",
            specialCharacterValid
          );
          setFieldValue("password_checks.no_space", spaceValid);
        }}
        onBlur={handleBlur}
        error={error}
      />
      {children}
      {showChecks && values.password && (
        <div className="space-y-3 text-sm">
          <p className="text-black">Password must include at least:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-9 max-w-[430px]">
            {passwordChecks.map(({ label, check }) => (
              <p
                key={check}
                className={cn(
                  "flex items-center gap-1",
                  values.password_checks[check]
                    ? "fill-success-600 text-success-600"
                    : "fill-grey-500 text-grey-500"
                )}
              >
                <CheckCircle size={18} fill="inherit" />
                <span className="ml-2">{label}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
