import { FaUser } from "react-icons/fa";

interface HostInfoProps {
  name: string;
  email: string;
  company: string;
  location: string;
}

const HostInformation: React.FC<HostInfoProps> = ({
  name,
  email,
  company,
  location,
}) => {
  return (
    <div className="flex gap-4 items-center rounded-lg shadow-xs bg-[#F7F9FC] py-4 px-6">
      <div className="rounded-full p-4 bg-[#D0D5DD] text-gray-400">
        <FaUser size={18} />
      </div>
      <div className="flex flex-col">
        <h2 className="text-[#667185] text-xs">HOST INFORMATION</h2>
        <h2 className="font-semibold text-black text-sm">{name}</h2>
        <p className="text-[#667185] text-xs">{email}</p>
        <h2 className="text-gray-700 text-xs">
          {company}, {location}
        </h2>
      </div>
    </div>
  );
};

export default HostInformation;
