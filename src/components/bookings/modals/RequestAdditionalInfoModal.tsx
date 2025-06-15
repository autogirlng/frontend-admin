import React from 'react';
import { Info } from 'lucide-react';
import BookingModalLayout from './BookingModalLayout';
import { ModalHeader } from './ModalHeader';

const RequestAdditionalInfoModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [infoType, setInfoType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [deadline, setDeadline] = React.useState('');

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <BookingModalLayout isOpen={isOpen}>
      <div className="p-6">
        <ModalHeader 
          LucideIcon={Info}
          iconColor="#0673FF"
          iconBackgroundColor="#E6F0FF"
          headerText="Request Additional Information"
          modalContent="Please specify what additional information you need from the customer"
        />
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="infoType" className="block text-sm font-medium text-gray-700 mb-1">
              Information Type
            </label>
            <select
              id="infoType"
              value={infoType}
              onChange={(e) => setInfoType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="identification">Identification Document</option>
              <option value="payment">Payment Information</option>
              <option value="vehicle">Vehicle Details</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message to Customer
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please provide a message explaining what information you need..."
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Response Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!infoType || !message || !deadline}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </BookingModalLayout>
  );
};

export default RequestAdditionalInfoModal; 