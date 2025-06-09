import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
  noteType?: 'booking' | 'trip';
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer',
  noteType = 'booking'
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notes.trim()) {
      alert('Please enter notes');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await addNotes({ bookingId, notes, noteType });
      console.log('Adding notes:', { bookingId, notes, noteType });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setNotes('');
      }, 1000);
    } catch (error) {
      console.error('Error adding notes:', error);
      setIsSubmitting(false);
    }
  };
  
  const title = noteType === 'trip' ? 'Add Trip Notes' : 'Add Booking Notes';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          Adding notes to booking <span className="font-medium">{bookingId}</span> for {customerName}.
          These notes will be visible to admin staff only.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-grey-700">
              Notes*
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[150px]"
              placeholder="Enter your notes here..."
              required
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
              Save Notes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddNotesModal;