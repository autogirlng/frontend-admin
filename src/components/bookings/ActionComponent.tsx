"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { EndTripModal } from "./modals/trips/EndTripModal";
import { UpdateTripModal } from "./modals/trips/UpdateTripModal";
import { ConfirmTripModal } from "./modals/trips/ConfirmTripModal";
import { CancelTripModal } from "./modals/trips/CancelTripModal";

interface ActionComponentProps {
    actionOption: string;
}

const ActionComponent: React.FC<ActionComponentProps> = ({ actionOption }) => {
    const [isActionOpen, setIsActionOpen] = useState(false);
    const actionRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isUpdateTripModalOpen, setIsUpdateTripModalOpen] = useState<boolean>(false);
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState<boolean>(false);
    const [isCancelTripModalOpen, setIsCancelTripModalOpen] = useState<boolean>(false);



    const actions = {
        Unconfirmed: ["Confirm", "Update Trip", "View Booking", "Cancel"],
        Confirmed: ["View booking", "Confirm Booking", "Update Trip", "Cancel"],
        Cancelled: ["View Booking"],
        Ongoing: ["View Booking", "End Trip"],
        ExtraTime: ["View Booking", "End Trip"],
    }

    enum Action {
        Unconfirmed = "Unconfirmed",
        Confirmed = "Confirmed",
        Cancelled = "Cancelled",
        Ongoing = "Ongoing",
        ExtraTime = "ExtraTime",


    }
    const findActions = (action: string) => {
        switch (action) {
            case "Unconfirmed":
                return actions[Action.Unconfirmed];
            case "Confirmed":
                return actions[Action.Confirmed];
            case "Cancelled":
                return actions[Action.Cancelled];
            case "Ongoing":
                return actions[Action.Ongoing];
            case "Extra Time":
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
            <UpdateTripModal isOpen={isUpdateTripModalOpen} setIsOpen={setIsUpdateTripModalOpen} />
            <ConfirmTripModal isOpen={isConfirmTripModalOpen} setIsOpen={setIsConfirmTripModalOpen} />
            <CancelTripModal isOpen={isCancelTripModalOpen} setIsOpen={setIsCancelTripModalOpen} />

        </div>
    );
};

export default ActionComponent;
