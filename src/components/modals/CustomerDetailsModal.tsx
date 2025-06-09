import React from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customerDetails
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="md">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">Name</label>
            <div className="p-3 bg-grey-50 rounded-lg text-grey-900 border border-grey-200">
              {customerDetails.name}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">Phone Number</label>
            <div className="p-3 bg-grey-50 rounded-lg text-grey-900 border border-grey-200">
              {customerDetails.phone}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">Email</label>
            <div className="p-3 bg-grey-50 rounded-lg text-grey-900 border border-grey-200">
              {customerDetails.email}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outlined" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            variant="filled"
            onClick={() => {
              // Implement any "add driver" logic here
              console.log('Adding new driver with customer details:', customerDetails);
              onClose();
            }}
          >
            Add New Driver
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;