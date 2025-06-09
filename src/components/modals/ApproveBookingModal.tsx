import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface ApproveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
}

const ApproveBookingModal: React.FC<ApproveBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer'
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await approveBooking({ bookingId, notes });
      console.log('Approving booking:', { bookingId, notes });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setNotes('');
      }, 1000);
    } catch (error) {
      console.error('Error approving booking:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Booking" size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          You are about to approve booking <span className="font-medium">{bookingId}</span> for {customerName}.
          This will change the booking status from Pending to Accepted.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-grey-700">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              placeholder="Add any notes about this approval..."
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
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
              Approve Booking
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ApproveBookingModal;
