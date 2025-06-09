import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface InitiateCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
}

const CANCELLATION_REASONS = [
  'Customer Request',
  'Vehicle Unavailability',
  'Scheduling Conflict',
  'Payment Issue',
  'Service Issues',
  'Weather/Safety Concerns',
  'Policy Violation',
  'Other'
];

const InitiateCancellationModal: React.FC<InitiateCancellationModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer'
}) => {
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isRefundable, setIsRefundable] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a cancellation reason');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await cancelBooking({ bookingId, reason, notes, isRefundable });
      console.log('Cancelling booking:', { bookingId, reason, notes, isRefundable });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setReason('');
        setNotes('');
        setIsRefundable(true);
      }, 1000);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initiate Cancellation" size="md">
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Warning:</strong> Cancelling this booking will notify the customer and may trigger a refund process based on your selection below.
          </p>
        </div>
        
        <p className="text-grey-600 text-base">
          You are about to cancel booking <span className="font-medium">{bookingId}</span> for {customerName}.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-grey-700">
              Cancellation Reason*
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a reason</option>
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-grey-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              placeholder="Add any additional details about this cancellation..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isRefundable}
                onChange={() => setIsRefundable(!isRefundable)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-700">Process refund based on cancellation policy</span>
            </label>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setReason('');
                setNotes('');
                setIsRefundable(true);
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
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InitiateCancellationModal;