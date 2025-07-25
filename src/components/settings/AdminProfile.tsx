// components/AdminProfileCard.tsx
import Image from "next/image";
import cn from "classnames";
import { Member } from "@/utils/types"; // Import your Member type
import Icons from "@/utils/Icon";
import ChangeRole from "../tables/Team/Details/modals/ChangeRoleModal";
import { useState } from "react";
import DeactivateMemberModal from "../tables/Team/Details/modals/DeactivateAdminModal";

interface AdminProfileCardProps {
  member: Member; // Now the prop is a single 'member' object of type Member
}

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({
  member, // Destructure the 'member' object from props
}) => {
  // Extract properties from the 'member' object for easier use
  const { firstName, lastName, email, role, status, id: avatar } = member;

  // Determine isActive based on the status property
  const isActive = status === "Active" || status === "Successful";
  const fullName = `${firstName} ${lastName}`;

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-6 md:p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl   p-6 flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0 md:space-x-8">
        {/* Left Section: Avatar, Name, Email, Status, Role */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-500">
            <Image
              src={"/images/default-avatar.png"}
              alt={`${fullName}'s avatar`}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              priority
              onError={(e) => {
                {
                  Icons.ic_instagram;
                }
              }}
            />
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {fullName} {/* Use the combined full name */}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">{email}</p>
            <div className="mt-2 flex flex-col items-start space-y-2">
              <div className="flex justify-center items-center ">
                <span
                  className={cn("text-xs font-medium px-2 py-2 rounded-full", {
                    "bg-error-500 text-red-300": !isActive, // Inactive status
                    "bg-success-500 text-green-400": isActive, // Active status
                  })}
                ></span>
                <span className="text-xs text-black">{status}</span>
              </div>

              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning-300 text-warning-700">
                {role} Customer Support
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto mt-4 md:mt-0">
          <ChangeRole
            openModal={isChangeModalOpen}
            handleModal={setIsChangeModalOpen}
            trigger={
              <button className="px-6 py-2.5 rounded-lg text-sm font-medium bg-grey-600 border border-gray-300 text-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 w-full sm:w-auto">
                Change Role
              </button>
            }
          />

          <DeactivateMemberModal
            openModal={isChangeModalOpen}
            handleModal={setIsChangeModalOpen}
            trigger={
              <button className="px-6 py-2.5 rounded-lg text-sm font-medium bg-grey-600 border border-gray-300 text-white hover:bg-gray-50   w-full sm:w-auto">
                Change Role
              </button>
            }
          />

          <button className="px-6 py-2.5 rounded-lg text-sm font-medium bg-grey-600 text-white hover:bg-red-700   w-full sm:w-auto">
            Deactivate Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileCard;

// Removed Member type definition from here as it should be in utils/types.ts
// Do NOT export Member type from this component file unless it's exclusively used here.
// export type Member = { ... };
