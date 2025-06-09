import { useState } from "react";

export default function usePasswordValidation() {
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] =
    useState<boolean>(true);

  const toggleHiddenPassword = () => setIsPasswordHidden(!isPasswordHidden);
  const toggleCurrentHiddenPassword = () =>
    setIsCurrentPasswordHidden(!isCurrentPasswordHidden);

  const isLengthValid = (password: string) => {
    const isLengthValid = password.length >= 8;
    return isLengthValid;
  };

  const isUpperCaseValid = (password: string) => {
    const uppercaseRegex = /[A-Z]/;
    const hasUppercase = uppercaseRegex.test(password);

    return hasUppercase;
  };

  const isLowerCaseValid = (password: string) => {
    const lowercaseRegex = /[a-z]/;
    const hasLowercase = lowercaseRegex.test(password);

    return hasLowercase;
  };

  const isDigitValid = (password: string) => {
    const numberRegex = /[0-9]/;
    const hasNumber = numberRegex.test(password);

    return hasNumber;
  };

  const isSpecialCharacterValid = (password: string) => {
    const specialCharRegex = /[@$!#%*?_&]/;
    const hasSpecialChar = specialCharRegex.test(password);

    return hasSpecialChar;
  };

  // const isSpaceValid = (password: string) => {
  //   //  add must not include spaces

  //   const noSpace = numberRegex.test(password);

  //   return noSpace;
  // };

  return {
    isPasswordHidden,
    toggleHiddenPassword,
    isCurrentPasswordHidden,
    toggleCurrentHiddenPassword,
    isLengthValid,
    isUpperCaseValid,
    isLowerCaseValid,
    isDigitValid,
    isSpecialCharacterValid,
    // isSpaceValid,
  };
}
