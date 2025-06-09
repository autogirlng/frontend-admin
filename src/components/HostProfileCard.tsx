"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react"; // Import useEffect
import cn from "classnames";
import { Popup } from "./shared/popup";
import MoreButton from "./shared/moreButton";
import Link from "next/link";
import BlockUserModal from "./tables/Host/Details/modals/deactivateHostModal";
import Icons from "@/utils/Icon";
import { ImageAssets } from "@/utils/ImageAssets"; // This import seems to be for ImageAssets.icons.user, but we'll use hostProfile.profileImage directly for the main image.
import { FaUser } from "react-icons/fa";

export interface HostProfile {
  id: string;
  profileImage: string | null;
  firstName: string;
  lastName: string;
  email: string;
  businessName: string | null;
  status: string;
  lastLogin: string;
}

interface HostProfileCardProps {
  hostProfile: HostProfile;
}

const HostProfileCard: React.FC<HostProfileCardProps> = ({ hostProfile }) => {
  const fullName = `${hostProfile.firstName || ""} ${
    hostProfile.lastName || ""
  }`.trim();
  const isActive = hostProfile.status === "Active";
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false); // State to track image loading error

  // Reset imageError state if profileImage changes
  useEffect(() => {
    setImageError(false);
  }, [hostProfile.profileImage]);

  return (
    <div className="w-full p-6 flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0 md:space-x-8">
      {/* Left Section: Avatar, Name, Email, Status, Role, Business Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        {/* Avatar */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
          {imageError || !hostProfile.profileImage ? (
            // Render fallback icon if there's an error or no profileImage
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
              <FaUser className="w-1/2 h-1/2 text-gray-500" />{" "}
            </div>
          ) : (
            <Image
              src={hostProfile.profileImage} 
              alt={`${fullName}'s avatar`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
              priority
              onError={() => setImageError(true)} // Set imageError to true on error
            />
          )}
        </div>

        {/* Host Info */}
        <div className="text-center md:text-left flex-col flex space-y-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            {fullName}
          </h2>
          <p className="text-sm text-base text-gray-700 mt-0.5">
            {hostProfile.email}
          </p>
          {hostProfile.businessName && (
            <p className="text-sm text-base text-gray-700 mt-0.5">
              Business: {hostProfile.businessName}
            </p>
          )}
          <div className="mt-2 flex flex-col items-start space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={cn("w-2.5 h-2.5 rounded-full", {
                  "bg-error-500": !isActive, // Inactive status (red dot)
                  "bg-success-500": isActive, // Active status (green dot)
                })}
              ></span>
              <span className="text-sm text-black font-medium">
                {hostProfile.status}
              </span>
            </div>

            {/* Role (as seen in the image, "Host") */}
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Host
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Action Buttons (as shown in your sample) */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto mt-4 md:mt-0">
        <Popup
          trigger={<MoreButton className="!mx-0 !ml-auto" />}
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">
                {/* Block User - For Active hosts */}
                {hostProfile.status.toLocaleLowerCase() === "active" && (
                  <li>
                    {/* BlockUserModal will be triggered by this button */}
                    <BlockUserModal
                      openModal={isBlockModalOpen}
                      handleModal={setIsBlockModalOpen}
                      userId={hostProfile.id} // Pass the ID of the current host to the modal
                      trigger={
                        <button
                          onClick={() => setIsBlockModalOpen(true)}
                          className="!text-xs 3xl:!text-base text-left w-full"
                          type="button" // Important for accessibility and form submission prevention
                        >
                          Block User
                        </button>
                      }
                    />
                  </li>
                )}

                {/* Unblock User - For Banned/Blocked hosts */}
                {(hostProfile.status.toLocaleLowerCase() === "banned" ||
                  hostProfile.status.toLocaleLowerCase() === "inactive") && (
                  <li>
                    <Link
                      href={`/hosts/${hostProfile.id}/unblock`} // Example unblock route
                      className="!text-xs 3xl:!text-base"
                    >
                      Unblock User
                    </Link>
                  </li>
                )}

                {/* Resend Logins - Often for inactive or when requested */}
                {hostProfile.status.toLocaleLowerCase() !== "active" && (
                  <li>
                    <Link
                      href={`/hosts/${hostProfile.id}/resend-logins`} // Example resend logins route
                      className="!text-xs 3xl:!text-base"
                    >
                      Resend Logins
                    </Link>
                  </li>
                )}
              </ul>
            </>
          }
        />
      </div>
    </div>
  );
};

export default HostProfileCard;
