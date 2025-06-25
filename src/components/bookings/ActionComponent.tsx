"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { EndTripModal } from "./modals/EndTripModal";
import { UpdateTripModal } from "./modals/UpdateTripModal";
import { ConfirmTripModal } from "./modals/ConfirmTripModal";
import { CancelTripModal } from "./modals/CancelTripModal";
import { TripBookingItem } from "@/utils/types";

interface ActionComponentProps {
    actionOption: string;
    trip: TripBookingItem;
}

const ActionComponent: React.FC<ActionComponentProps> = ({ actionOption, trip }) => {
    const [isActionOpen, setIsActionOpen] = useState(false);
    const actionRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState<boolean>(false);
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState<boolean>(false);
    const [isCancelTripModalOpen, setIsCancelTripModalOpen] = useState<boolean>(false);


    const actions = {
        unconfirmed: ["Confirm", "Update Trip", "View Booking", "Cancel"],
        confirmed: ["View booking", "Update Trip", "Cancel"],
        cancelled: ["View Booking"],
        ongoing: ["View Booking", "End Trip"],
        extratime: ["View Booking", "End Trip"],
    }

    enum Action {
        Unconfirmed = "unconfirmed",
        Confirmed = "confirmed",
        Cancelled = "cancelled",
        Ongoing = "ongoing",
        ExtraTime = "extratime",
    }
    const findActions = (action: string) => {
        switch (action) {
            case "unconfirmed":
                return actions[Action.Unconfirmed];
            case "confirmed":
                return actions[Action.Confirmed];
            case "cancelled":
                return actions[Action.Cancelled];
            case "ongoing":
                return actions[Action.Ongoing];
            case "extratime":
                return actions[Action.ExtraTime];
            default:
                return ["Not available"];
        }
    };


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                actionRef.current &&
                !actionRef.current.contains(event.target as Node)
            ) {
                setIsActionOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [actionRef]);


    const openModal = (action: string) => {
        if (action === "End Trip") {
            setIsOpen(true);
        }
        else if (action === "Update Trip") {
            setIsUpdateTripModalOpen(true)
        }
        else if (action === "Confirm") {
            setIsConfirmTripModalOpen(true)
        }
        else if (action === "Cancel") {
            setIsCancelTripModalOpen(true)

        }

    }

    return (
        <div className="relative" ref={actionRef}>
            {/* Filter Button */}
            <button
                className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 rounded-full p-2"
                onClick={() => setIsActionOpen(!isActionOpen)}
                aria-expanded={isActionOpen}
                aria-controls="filter-dropdown" >
                <MoreVertical size={16} />
            </button>

            {/* Filter Dropdown */}
            {isActionOpen && (
                <div
                    id="filter-dropdown"
                    className="absolute z-10 mt-2 w-60 bg-white rounded-[10%] shadow-lg border border-[#dbdfe5] overflow-hidden"
                    style={{ top: "calc(100% + 5px)", right: 0 }}
                >

                    <div className="p-5">
                        <div className="">
                            <div className="flex flex-col items-start">
                                <h4 className="text-base font-medium mb-1 text-gray-800">Actions</h4>

                                {
                                    findActions(actionOption).map((value, index) => {
                                        return <p
                                            key={index}
                                            className="my-2 w-full cursor-pointer py-2 rounded hover:bg-[#e0e4e9] text-sm text-start text-gray-700 transition-colors"
                                            onClick={() => openModal(value)}
                                        >
                                            {value}
                                        </p>
                                    })

                                }

                            </div>
                        </div>

                    </div>
                </div>
            )}
            <EndTripModal isOpen={isOpen} setIsOpen={setIsOpen} />
            <UpdateTripModal isOpen={isUpdateTripModalOpen} setIsOpen={setIsUpdateTripModalOpen} trip={trip} />
            <ConfirmTripModal isOpen={isConfirmTripModalOpen} setIsOpen={setIsConfirmTripModalOpen} tripId={trip.id} />
            <CancelTripModal isOpen={isCancelTripModalOpen} setIsOpen={setIsCancelTripModalOpen} tripId={trip.id} />

        </div>
    );
};

export default ActionComponent;
