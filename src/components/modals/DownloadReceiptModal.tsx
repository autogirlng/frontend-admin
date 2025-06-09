import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface DownloadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerName?: string;
}

const RECEIPT_TYPES = [
  'Standard Receipt',
  'Detailed Invoice',
  'Tax Invoice',
  'Payment Confirmation'
];

const FILE_FORMATS = [
  'PDF',
  'CSV',
  'Excel'
];

const DownloadReceiptModal: React.FC<DownloadReceiptModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerName = 'Customer'
}) => {
  const [receiptType, setReceiptType] = useState<string>(RECEIPT_TYPES[0]);
  const [fileFormat, setFileFormat] = useState<string>(FILE_FORMATS[0]);
  const [includeCustomerDetails, setIncludeCustomerDetails] = useState<boolean>(true);
  const [includePaymentDetails, setIncludePaymentDetails] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await downloadReceipt({ 
      //   bookingId, 
      //   receiptType, 
      //   fileFormat, 
      //   includeCustomerDetails, 
      //   includePaymentDetails 
      // });
      console.log('Downloading receipt:', { 
        bookingId, 
        receiptType, 
        fileFormat, 
        includeCustomerDetails, 
        includePaymentDetails 
      });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Receipt" size="md">
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          Download receipt for booking <span className="font-medium">{bookingId}</span> for {customerName}.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="receiptType" className="block text-sm font-medium text-grey-700">
              Receipt Type
            </label>
            <select
              id="receiptType"
              value={receiptType}
              onChange={(e) => setReceiptType(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {RECEIPT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="fileFormat" className="block text-sm font-medium text-grey-700">
              File Format
            </label>
            <select
              id="fileFormat"
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {FILE_FORMATS.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <span className="block text-sm font-medium text-grey-700">
              Include in Receipt
            </span>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeCustomerDetails}
                  onChange={() => setIncludeCustomerDetails(!includeCustomerDetails)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">Customer Details</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includePaymentDetails}
                  onChange={() => setIncludePaymentDetails(!includePaymentDetails)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-700">Payment Details</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              isLoading={isSubmitting}
            >
              Download
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DownloadReceiptModal;