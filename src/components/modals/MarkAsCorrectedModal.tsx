import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface MarkAsCorrectedModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
}

const CORRECTION_TYPES = [
  'Booking Details',
  'Payment Information',
  'Schedule Adjustment',
  'Vehicle Change',
  'Driver Assignment',
  'Customer Information',
  'Other'
];

const MarkAsCorrectedModal: React.FC<MarkAsCorrectedModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer'
}) => {
  const [correctionType, setCorrectionType] = useState<string>('');
  const [correctionNotes, setCorrectionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!correctionType) {
      alert('Please select a correction type');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await markCorrected({ bookingId, correctionType, correctionNotes });
      console.log('Marking as corrected:', { bookingId, correctionType, correctionNotes });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setCorrectionType('');
        setCorrectionNotes('');
      }, 1000);
    } catch (error) {
      console.error('Error marking as corrected:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark As Corrected" size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          Mark booking <span className="font-medium">{bookingId}</span> for {customerName} as corrected.
          This will update the booking status to indicate that corrections have been applied.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="correctionType" className="block text-sm font-medium text-grey-700">
              Correction Type*
            </label>
            <select
              id="correctionType"
              value={correctionType}
              onChange={(e) => setCorrectionType(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select correction type</option>
              {CORRECTION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="correctionNotes" className="block text-sm font-medium text-grey-700">
              Correction Notes
            </label>
            <textarea
              id="correctionNotes"
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px]"
              placeholder="Describe what corrections were made..."
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setCorrectionType('');
                setCorrectionNotes('');
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
              Mark As Corrected
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MarkAsCorrectedModal;