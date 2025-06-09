"use client";

import React, { useState, useRef, useEffect } from "react";
import { Booking } from "@/services/bookingService";

interface ActionComponentProps {
  booking: Booking;
  onActionSelect: (action: string) => void;
}

const ActionComponent = ({ booking, onActionSelect }: ActionComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActions = () => {
    const baseActions = [
      { id: 'view-details', label: 'View Details' },
      { id: 'assign-driver', label: 'Assign Driver' },
      { id: 'contact', label: 'Contact Customer' },
      { id: 'download-receipt', label: 'Download Receipt' },
      { id: 'add-notes', label: 'Add Notes' },
    ];

    switch (booking.status) {
      case 'PENDING':
        return [
          ...baseActions,
          { id: 'approve', label: 'Approve' },
          { id: 'reject', label: 'Reject' },
          { id: 'cancel', label: 'Cancel' },
        ];
      case 'APPROVED':
        return [
          ...baseActions,
          { id: 'cancel', label: 'Cancel' },
          { id: 'complete', label: 'Mark as Completed' },
        ];
      case 'COMPLETED':
        return [
          ...baseActions,
          { id: 'view-invoice', label: 'View Invoice' },
        ];
      case 'CANCELLED':
        return [
          ...baseActions,
          { id: 'view-cancellation', label: 'View Cancellation Details' },
        ];
      default:
        return baseActions;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]">
          <div className="py-1 flex flex-col" role="menu" aria-orientation="vertical">
            {getActions().map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onActionSelect(action.id);
                  setIsOpen(false);
                }}
                className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
                role="menuitem"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionComponent;
