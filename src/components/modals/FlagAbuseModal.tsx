import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface FlagAbuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerEmail: string;
}

const REASON_OPTIONS = [
  'Repeated Late Payments',
  'Vehicle Damage',
  'Booking Policy Violations',
  'Excessive Mileage',
  'Unauthorized Vehicle Use',
  'Disrespectful Behavior',
  'Other'
];

const FlagAbuseModal: React.FC<FlagAbuseModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerEmail
}) => {
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a reason');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await flagBooking({ bookingId, reason, customerEmail });
      console.log('Flagging booking:', { bookingId, reason, customerEmail });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setReason('');
      }, 1000);
    } catch (error) {
      console.error('Error flagging booking:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Flag Abuse or Pattern" size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          This would send an email to the customer requesting what you select below
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-grey-700">
              Reason
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Select a reason for flagging"
            >
              <option value="">Select reason</option>
              {REASON_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setReason('');
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              isLoading={isSubmitting}
            >
              Confirm Flag
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FlagAbuseModal;