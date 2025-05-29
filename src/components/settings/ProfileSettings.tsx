// ProfileSettings.tsx
import React, { useState, useEffect } from "react"; // Import useEffect
import InputField from "../shared/inputField"; // Adjust path as needed
import PhoneNumberAndCountryField from "../shared/phoneNumberAndCountryField"; // Adjust path as needed
import { useAppSelector } from "@/lib/hooks";
import { FullPageSpinner } from "../shared/spinner";

const ProfileSettings = () => {
  const { user } = useAppSelector((state) => state.user);

  // Initialize state with null/undefined, or default empty strings
  const [firstName, setFirstName] = useState<string | undefined | null>(null);
  const [lastName, setLastName] = useState<string | undefined | null>(null);
  const [countryCode, setCountryCode] = useState<string | undefined | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState<string | undefined | null>(
    null
  );
  const [role, setRole] = useState<string | undefined | null>(null);
  const [email, setEmail] = useState<string | undefined | null>(null);

  // Use useEffect to update state when the 'user' object changes (i.e., when it loads)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setCountryCode(user.countryCode);
      setPhoneNumber(user.phoneNumber);
      setRole(user.userRole);
      setEmail(user.email);
    }
  }, [user]); // Dependency array: this effect runs whenever 'user' changes

  // It's good practice to handle loading states or cases where user data might not be present
  if (!user) {
    return <FullPageSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-semibold text-grey-900 mb-6">
        Personal information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* First Name */}
        <InputField
          name="firstName"
          id="firstName"
          label="First name"
          placeholder="Enter first name"
          value={firstName || ""} // Provide a default empty string for display
          disabled
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
        />

        {/* Last Name */}
        <InputField
          name="lastName"
          id="lastName"
          label="Last name"
          placeholder="Enter last name"
          value={lastName || ""} // Provide a default empty string for display
          disabled
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
        />

        {/* Phone Number using PhoneNumberAndCountryField */}
        <PhoneNumberAndCountryField
          label="Phone number"
          inputName="phoneNumber"
          inputId="phoneNumber"
          inputPlaceholder="Enter phone number"
          inputValue={phoneNumber || ""} // Provide a default empty string for display
          inputOnChange={(value: string) => setPhoneNumber(value)}
          inputOnBlur={() => {}}
          inputDisabled
          selectName="countryCode"
          selectId="countryCode"
          selectPlaceholder="234"
          selectValue={countryCode || ""} // Provide a default empty string for display
          selectDisabled
          selectOnChange={(value: string) => setCountryCode(countryCode)}
          selectOnBlur={() => {}}
        />

        {/* Role */}
        <InputField
          name="role"
          id="role"
          label="Role"
          placeholder="Admin"
          value={role || ""} // Provide a default empty string for display
          disabled
        />

        {/* Email */}
        <div className="flex gap-4 justify-between items-center">
          <InputField
            id="email"
            name="email"
            label="Email"
            placeholder="Enter email"
            disabled
            value={email || ""} // Provide a default empty string for display
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            inputClass="pr-[90px]"
          />
          <span className="text-sm border border-success-500 text-success-500 rounded-lg px-6 py-3">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
