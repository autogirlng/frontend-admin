import React from 'react';
import { useModal } from '../../context/ModalContext';
import FlagAbuseModal from './FlagAbuseModal';
import RequestInfoModal from './RequestInfoModal';
import CustomerDetailsModal from './CustomerDetailsModal';
import CancelBookingModal from './CancelBookingModal';
import ApproveBookingModal from './ApproveBookingModal';
import AssignDriverModal from './AssignDriverModal';
import ContactCustomerModal from './ContactCustomerModal';
import VehicleAvailabilityModal from './VehicleAvailabilityModal';
import DownloadReceiptModal from './DownloadReceiptModal';
import MarkAsCorrectedModal from './MarkAsCorrectedModal';
import AddNotesModal from './AddNotesModal';
import RejectBookingModal from './RejectBookingModal';
import InitiateCancellationModal from './InitiateCancellationModal';

const ModalManager: React.FC = () => {
  const { 
    activeModal, 
    currentBookingId, 
    currentCustomerDetails, 
    vehicleInfo,
    closeModal 
  } = useModal();

  // Default customer details if none provided
  const defaultCustomerDetails = {
    name: 'Customer',
    phone: '',
    email: '',
  };

  // Determine if we should use provided customer details or default ones
  const customerDetails = currentCustomerDetails || defaultCustomerDetails;

  return (
    <>
      <FlagAbuseModal 
        isOpen={activeModal === 'flag'} 
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerEmail={customerDetails.email}
      />
      
      <RequestInfoModal 
        isOpen={activeModal === 'request-info'} 
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerEmail={customerDetails.email}
      />
      
      <CustomerDetailsModal 
        isOpen={activeModal === 'view-details'} 
        onClose={closeModal}
        customerDetails={customerDetails}
      />
      
      <CancelBookingModal 
        isOpen={activeModal === 'cancel'} 
        onClose={closeModal}
        bookingId={currentBookingId || ''}
      />

      <ApproveBookingModal 
        isOpen={activeModal === 'approve'} 
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />

      <AssignDriverModal 
        isOpen={activeModal === 'assign-driver'} 
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        vehicleInfo={vehicleInfo || ''}
      />

      <ContactCustomerModal
        isOpen={activeModal === 'contact'}
        onClose={closeModal}
        customerDetails={customerDetails}
        bookingId={currentBookingId || ''}
      />

      <VehicleAvailabilityModal
        isOpen={activeModal === 'vehicle-availability'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        vehicleInfo={vehicleInfo || ''}
      />

      <DownloadReceiptModal
        isOpen={activeModal === 'download-receipt'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />

      <MarkAsCorrectedModal
        isOpen={activeModal === 'mark-corrected'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />

      <AddNotesModal
        isOpen={activeModal === 'add-notes'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />

      <RejectBookingModal
        isOpen={activeModal === 'reject'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />

      <InitiateCancellationModal
        isOpen={activeModal === 'view-cancellation'}
        onClose={closeModal}
        bookingId={currentBookingId || ''}
        customerName={customerDetails.name}
      />
    </>
  );
};

export default ModalManager;