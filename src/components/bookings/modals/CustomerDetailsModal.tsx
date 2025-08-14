import React from "react";
import { User } from "lucide-react";
import BookingModalLayout from "./BookingModalLayout";
import { ModalHeader } from "./ModalHeader";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    name: string;
    phone: string;
    email: string;
    memberSince: string;
    bookingHistory: {
      vehicle: string;
      date: string;
      status: string;
    }[];
  };
  title?: string;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  title,
}) => {
  return (
    <BookingModalLayout isOpen={isOpen}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <ModalHeader 
          LucideIcon={User}
          iconColor="#0AAF24"
          iconBackgroundColor="#DCFCE7"
          headerText={title || "Customer Details"}
          modalContent="View customer information and booking history"
        />
        
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-sm text-gray-900">{customer.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-sm text-gray-900">{customer.memberSince}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Booking History</h3>
            <div className="space-y-2">
              {customer.bookingHistory.map((booking, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.vehicle}</p>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </BookingModalLayout>
  );
}; 