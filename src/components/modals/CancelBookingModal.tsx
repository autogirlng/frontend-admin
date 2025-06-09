import React, { useState, useRef } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

const CANCELLATION_REASONS = [
  'Customer Request',
  'Vehicle Unavailable',
  'Weather Conditions',
  'Payment Issue',
  'Host Unavailable',
  'Booking Mistake',
  'Other'
];

type CancellationParty = 'Admin' | 'Host' | 'Customer';

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  bookingId
}) => {
  const [reason, setReason] = useState<string>('');
  const [cancellationParty, setCancellationParty] = useState<CancellationParty>('Admin');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a cancellation reason');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // const formData = new FormData();
      // formData.append('bookingId', bookingId);
      // formData.append('reason', reason);
      // formData.append('cancellationParty', cancellationParty);
      // if (file) formData.append('documentation', file);
      // await cancelBooking(formData);
      
      console.log('Cancelling booking:', {
        bookingId,
        reason,
        cancellationParty,
        file: file ? file.name : null
      });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setReason('');
        setCancellationParty('Admin');
        setFile(null);
      }, 1000);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Booking" size="lg">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="cancellationReason" className="block text-sm font-medium text-grey-700 mb-1">
                Cancellation Reason
              </label>
              <select
                id="cancellationReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Select a cancellation reason"
              >
                <option value="">Select reason</option>
                {CANCELLATION_REASONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-2">
                Who Initiated The Cancellation?
              </label>
              <div className="space-y-3">
                <label className="custom-radio block">
                  <input
                    type="radio"
                    name="cancellationParty"
                    checked={cancellationParty === 'Admin'}
                    onChange={() => setCancellationParty('Admin')}
                    aria-label="Admin initiated cancellation"
                  />
                  <span className="text-grey-800">Admin</span>
                </label>
                <label className="custom-radio block">
                  <input
                    type="radio"
                    name="cancellationParty"
                    checked={cancellationParty === 'Host'}
                    onChange={() => setCancellationParty('Host')}
                    aria-label="Host initiated cancellation"
                  />
                  <span className="text-grey-800">Host</span>
                </label>
                <label className="custom-radio block">
                  <input
                    type="radio"
                    name="cancellationParty"
                    checked={cancellationParty === 'Customer'}
                    onChange={() => setCancellationParty('Customer')}
                    aria-label="Customer initiated cancellation"
                  />
                  <span className="text-grey-800">Customer</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-2">
                Attach supporting documentation (optional)
              </label>
              <div className="file-upload-container relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="file-upload-input"
                  aria-label="Upload supporting documentation"
                />
                <div className="py-6 flex flex-col items-center">
                  <svg className="w-10 h-10 text-grey-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-grey-600 text-sm">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-grey-500 text-xs mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setReason('');
                setCancellationParty('Admin');
                setFile(null);
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

export default CancelBookingModal;