import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface ContactCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  bookingId?: string;
}

const CONTACT_METHODS = [
  'Email',
  'SMS',
  'Phone Call',
  'In-App Message'
];

const CONTACT_SUBJECTS = [
  'Booking Confirmation',
  'Payment Update',
  'Schedule Change',
  'Vehicle Information',
  'Driver Details',
  'Customer Support',
  'Policy Reminder',
  'Other'
];

const ContactCustomerModal: React.FC<ContactCustomerModalProps> = ({
  isOpen,
  onClose,
  customerDetails,
  bookingId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement the actual API call to send message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Customer"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerDetails.name}
              disabled
              className="w-full px-4 py-2 border border-grey-200 rounded-lg bg-grey-50 text-grey-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={customerDetails.email}
              disabled
              className="w-full px-4 py-2 border border-grey-200 rounded-lg bg-grey-50 text-grey-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerDetails.phone}
              disabled
              className="w-full px-4 py-2 border border-grey-200 rounded-lg bg-grey-50 text-grey-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-2 border border-grey-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactCustomerModal;