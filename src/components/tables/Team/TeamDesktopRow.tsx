// src/components/tables/Team/Details/modals/TeamDesktopRow.tsx

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Member } from "@/utils/types";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import TableCell from "@/components/TableCell";
import { LocalRoute } from "@/utils/LocalRoutes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateMember } from "@/lib/features/teamMemberSlice";
import EditTeamMember from "./Details/modals/EditTeamMember";
import DeactivateMemberModal from "./Details/modals/DeactivateAdminModal";
import ActivateMemberModal from "./Details/modals/ActivateMember";
export default function TeamDesktopRow({ items }: { items: Member }) {
  const { member } = useAppSelector((state) => state.teamMember);
  const dispatch = useAppDispatch();

  // State to control the modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false); // New state for activate modal

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
              {/* This is the new component for activating */}
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
    <tr>
      <TableCell
        content={items?.firstName}
        className="!text-grey-900 text-wrap capitalize !font-medium"
      />
      <TableCell className="text-wrap" content={items?.lastName ?? "-"} />
      <TableCell className="text-wrap" content={`${items?.email ?? "-"}`} />
      <TableCell content={items?.role} />
      <TableCell
        content={
          items?.lastLogin ? format(new Date(items?.lastLogin), "MMM d, yyyy") : "-"
        }
      />
      <TableCell
        content={
          items?.joined ? format(new Date(items?.joined), "MMM d, yyyy") : ""
        }
      />
      <TableCell content={items?.status} isBadge={true} />
      <td>
        <Popup
          trigger={<MoreButton />}
          content={
            <>
              <p className="!text-xs 3xl:!text-base !font-semibold">Actions</p>
              <ul className="space-y-2 *:py-2">{getPopupContent(items.status)}</ul>
            </>
          }
        />
      </td>
    </tr>
  );
}