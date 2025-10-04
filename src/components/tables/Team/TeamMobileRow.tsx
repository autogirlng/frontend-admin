"use client";
import React, { useState } from "react"; // Import useState
import Link from "next/link";
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import { useAppDispatch } from "@/lib/hooks";
import { updateMember } from "@/lib/features/teamMemberSlice";
import { LocalRoute } from "@/utils/LocalRoutes";
import { MobileTableCell } from "@/components/TableCell";
// Import the modals
import EditTeamMember from "./Details/modals/EditTeamMember";
import DeactivateMemberModal from "./Details/modals/DeactivateAdminModal";
import ActivateMemberModal from "./Details/modals/ActivateMember";
export default function TeamMobileRow({ items }: { items: Member }) {
  const dispatch = useAppDispatch();

  // State to control the modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const handleSelectMember = () => {
    dispatch(updateMember(items));
  };

  const getPopupContent = (status: "active" | "inactive" | "successful") => {
    switch (status) {
      case "active":
        return (
          <>
            <li>
              <Link
                onClick={handleSelectMember}
                href={`${LocalRoute.teamMemberProfilePage}/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                View Member
              </Link>
            </li>
            <li>
              <EditTeamMember
                openModal={isEditModalOpen}
                handleModal={setIsEditModalOpen}
                member={items as any}
                trigger={
                  <div className="!text-xs 3xl:!text-base cursor-pointer">
                    Edit Member
                  </div>
                }
              />
            </li>
            <li>
              <DeactivateMemberModal
                member={items}
                openModal={isDeactivateModalOpen}
                handleModal={setIsDeactivateModalOpen}
                trigger={
                  <div className="!text-xs 3xl:!text-base cursor-pointer">
                    Disable Member
                  </div>
                }
              />
            </li>
          </>
        );

      case "inactive":
        return (
          <>
            <li>
              <Link
                onClick={handleSelectMember}
                href={`${LocalRoute.teamMemberProfilePage}/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                View Member
              </Link>
            </li>
            {/* <li>
              <Link
                href={`/resend-invite/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                Resend Invite
              </Link>
            </li> */}
            <li>
              <ActivateMemberModal
                member={items}
                openModal={isActivateModalOpen}
                handleModal={setIsActivateModalOpen}
                trigger={
                  <div className="!text-xs 3xl:!text-base cursor-pointer">
                    Activate Member
                  </div>
                }
              />
            </li>
            {/* <li>
              <Link
                href={`/delete-member/${items?.id}`}
                className="!text-xs 3xl:!text-base text-error-500"
              >
                Delete Member
              </Link>
            </li> */}
          </>
        );

      case "successful":
        return (
          <>
            <li>
              <Link
                onClick={handleSelectMember}
                href={`${LocalRoute.teamMemberProfilePage}/${items?.id}`}
                className="!text-xs 3xl:!text-base"
              >
                View Member
              </Link>
            </li>
            <li>
              <EditTeamMember
                openModal={isEditModalOpen}
                handleModal={setIsEditModalOpen}
                member={items as any}
                trigger={
                  <div className="!text-xs 3xl:!text-base cursor-pointer">
                    Edit Member
                  </div>
                }
              />
            </li>
            <li>
              <DeactivateMemberModal
                member={items}
                openModal={isDeactivateModalOpen}
                handleModal={setIsDeactivateModalOpen}
                trigger={
                  <div className="!text-xs 3xl:!text-base cursor-pointer">
                    Disable Member
                  </div>
                }
              />
            </li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 pt-5 pb-3 border-b border-grey-300">
      <Popup
        trigger={<MoreButton className="!mx-0 !ml-auto" />}
        content={
          <>
            <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
            <ul className="space-y-2 *:py-2">
              {getPopupContent(items.status as any)}
            </ul>
          </>
        }
      />
      <MobileTableCell title="First Name" content={items?.firstName ?? "-"} />
      <MobileTableCell
        title="Last Name"
        content={`${items?.lastName ?? "-"}`}
      />
      <MobileTableCell title="Email" content={items?.email ?? "-"} />

      <MobileTableCell title="Role" content={items?.role} />
      <MobileTableCell
        title="Last Login"
        content={
          items?.lastLogin
            ? format(new Date(items?.lastLogin), "MMM d ,yyyy")
            : "-"
        }
      />
      <MobileTableCell
        title="Joined"
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d ,yyyy") : ""
        }
      />
      <MobileTableCell title="Status" content={items?.status} />
    </div>
  );
}