import Link from "next/link";
import { useState } from "react";
import { ListingStatus } from "@/utils/types";
import { ListingBadge } from "@/components/shared/badge";
import { BlurredDialog } from "@/components/shared/dialog";
import { Popup } from "@/components/shared/popup";
import MoreButton from "@/components/shared/moreButton";
import Icons from "@/utils/Icon";
import BackLink from "@/components/BackLink";
import DeleteListing from "@/components/Listings/Details/modals/DeleteListing";
import DeactivateListing from "@/components/Listings/Details/modals/DeactivateListing";
import { LocalRoute } from "@/utils/LocalRoutes";

type Props = {
  name?: string;
  status?: ListingStatus;
  id?: string;
};

export default function ListingDetailsHeader({ name, status, id }: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openDeactivateModal, setOpenDeactivateModal] =
    useState<boolean>(false);

  const handleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDeactivateModal = () => {
    setOpenDeactivateModal(!openDeactivateModal);
  };
  return (
    <div className="space-y-5">
      <div className="flex justify-between gap-2">
        <BackLink backLink="/dashboard/onboarding" />
        <div className="flex items-center gap-3">
          <div className="flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-500 ">
            {Icons.ic_calendar}
          </div>
          <Popup
            trigger={
              <button
                className={
                  "block border border-grey-200 bg-white text-black rounded-lg p-2 w-fit"
                }
              >
                {Icons.ic_more}
              </button>
            }
            content={
              <>
                <p className="!text-xs 3xl:!text-base text-grey-700 !font-bold">
                  Actions
                </p>
                <ul className="space-y-2 *:py-2">
                  <li>
                    <Link
                      href={`${LocalRoute.vehicleOnboardingPage}?id=${id}`}
                      className="!text-xs 3xl:!text-base"
                    >
                      Edit listing
                    </Link>
                  </li>
                  <li>
                    <BlurredDialog
                      open={openDeleteModal}
                      onOpenChange={handleDeleteModal}
                      trigger={
                        <button className="!text-xs 3xl:!text-base hover:text-error-500">
                          Delete listing
                        </button>
                      }
                      content={
                        <DeleteListing
                          handleModal={handleDeleteModal}
                          id={id}
                        />
                      }
                    />
                  </li>
                  <li>
                    <BlurredDialog
                      open={openDeactivateModal}
                      onOpenChange={handleDeactivateModal}
                      trigger={
                        <button className="!text-xs 3xl:!text-base hover:text-primary-500">
                          Deactivate listing
                        </button>
                      }
                      content={
                        <DeactivateListing
                          handleModal={handleDeactivateModal}
                          id={id}
                        />
                      }
                    />
                  </li>
                  {/* <li>
                    <Link
                      href={`/listings/view-as-customer/${id}`}
                      className="!text-xs 3xl:!text-base "
                    >
                      View as customer
                    </Link>
                  </li> */}
                </ul>
              </>
            }
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <h5 className="text-h6 sm:text-4xl 3xl:text-h2 !font-bold">
          {name || ""}
        </h5>
        <ListingBadge status={status ? status : "review"} />
      </div>
    </div>
  );
}
