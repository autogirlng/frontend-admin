import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface RejectBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
}

const REJECTION_REASONS = [
  'Unavailable Vehicle',
  'Invalid Booking Details',
  'Driver Unavailability',
  'Location Restriction',
  'Customer Verification Issues',
  'Pricing Discrepancy',
  'Policy Violation',
  'Other'
];

const RejectBookingModal: React.FC<RejectBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer'
}) => {
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a reason for rejection');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await rejectBooking({ bookingId, reason, notes });
      console.log('Rejecting booking:', { bookingId, reason, notes });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setReason('');
        setNotes('');
      }, 1000);
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Booking" size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          You are about to reject booking <span className="font-medium">{bookingId}</span> for {customerName}.
          This will change the booking status from Pending to Rejected.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-grey-700">
              Rejection Reason*
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a reason</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-grey-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              placeholder="Add any additional details about this rejection..."
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setReason('');
                setNotes('');
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
              Reject Booking
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RejectBookingModal;