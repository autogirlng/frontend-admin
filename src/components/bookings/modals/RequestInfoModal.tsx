import React, { useState } from "react";
import { Info } from "lucide-react";
import BookingModalLayout from './BookingModalLayout';
import { ModalHeader } from "./ModalHeader";

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedInfo: string[]) => void;
}

const additionalInfoOptions = [
  "Additional Info 1",
  "Additional Info 2",
  "Additional Info 3",
  "Additional Info 4",
  "Additional Info 5",
];

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedInfo, setSelectedInfo] = useState<string[]>([]);

  const handleCheckboxChange = (info: string) => {
    setSelectedInfo((prev) =>
      prev.includes(info)
        ? prev.filter((item) => item !== info)
        : [...prev, info]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedInfo);
  };

  if (!isOpen) return null;

  return (
    <BookingModalLayout isOpen={isOpen}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <ModalHeader 
          LucideIcon={Info}
          iconColor="#0673FF"
          iconBackgroundColor="#E0F2FE"
          headerText="Request Additional Information"
          modalContent="This would send an email to the customer requesting what you select below"
        />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {additionalInfoOptions.map((info) => (
              <label key={info} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedInfo.includes(info)}
                  onChange={() => handleCheckboxChange(info)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{info}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Driver
            </button>
          </div>
        </form>
      </div>
    </BookingModalLayout>
  );
};

export default RequestInfoModal; 