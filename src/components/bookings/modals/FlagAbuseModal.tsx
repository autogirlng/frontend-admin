import React, { useState } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import BookingModalLayout from "./BookingModalLayout";
import { ModalHeader } from "./ModalHeader";

interface FlagAbuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onConfirm?: (reason: string) => void;
}

const abuseReasons = [
  "Inappropriate Behavior",
  "Payment Issues",
  "Cancellation Pattern",
  "Vehicle Damage",
  "Other",
];

export const FlagAbuseModal: React.FC<FlagAbuseModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [abuseType, setAbuseType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm && onConfirm(reason);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  return (
    <BookingModalLayout isOpen={isOpen}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <ModalHeader 
          LucideIcon={AlertTriangle}
          iconColor="#F3A218"
          iconBackgroundColor="#FEF3C7"
          headerText="Flag Abuse"
          modalContent="Please provide details about the abuse incident"
        />
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="abuseType" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Abuse
            </label>
            <select
              id="abuseType"
              value={abuseType}
              onChange={(e) => setAbuseType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              {abuseReasons.map((reason) => (
                <option key={reason} value={reason.toLowerCase().replace(" ", "_")}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please provide details about the abuse..."
            />
          </div>

          <div>
            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
              Evidence (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload File</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="submit"
              disabled={!abuseType || !description}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </BookingModalLayout>
  );
}; 