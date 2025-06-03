import React from "react";
import { FaUser } from "react-icons/fa6";

interface HostInfoProps {
  name: string;
  email: string;
  businessName: string;
  businessLocation: string;
}

const HostInformationCard: React.FC<HostInfoProps> = ({
  name,
  email,
  businessName,
  businessLocation,
}) => {
  return (
    <div className="bg-[#F7F9FC] flex items-center gap-4 rounded-lg shadow-sm py-4 px-6 w-fit">
      <div className="rounded-full p-3.5 bg-[#E0E0E0]">
        <FaUser className="text-3xl text-[#757575]" />
      </div>
      <div className="flex flex-col space-y-1">
        <h2 className="text-[0.7rem] font-semibold text-[#757575] uppercase tracking-wider">
          Host Information
        </h2>
        <p className="text-sm font-medium text-[#212121]">{name}</p>
        <p className="text-[0.7rem] text-[#757575]">{email}</p>
        <p className="text-[0.7rem] text-[#757575]">
          {businessName} • {businessLocation}
        </p>
      </div>
    </div>
  );
};

export default HostInformationCard;
