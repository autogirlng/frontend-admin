import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for modals
type ModalType = 
  | 'flag' 
  | 'request-info' 
  | 'view-details' 
  | 'cancel' 
  | 'approve' 
  | 'assign-driver' 
  | 'contact'
  | 'vehicle-availability'
  | 'download-receipt'
  | 'mark-corrected'
  | 'add-notes'
  | 'reject'
  | 'view-cancellation'
  | 'reject-refund'
  | 'release'
  | null;

interface ModalContextType {
  activeModal: ModalType;
  currentBookingId: string | null;
  currentCustomerDetails: {
    name: string;
    phone: string;
    email: string;
  } | null;
  vehicleInfo: string | null;
  openModal: (type: ModalType, bookingId: string, customerDetails?: any, vehicleInfo?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [currentCustomerDetails, setCurrentCustomerDetails] = useState<{
    name: string;
    phone: string;
    email: string;
  } | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<string | null>(null);

  const openModal = (type: ModalType, bookingId: string, customerDetails?: any, vehicleInfo?: string) => {
    setActiveModal(type);
    setCurrentBookingId(bookingId);
    if (customerDetails) {
      setCurrentCustomerDetails(customerDetails);
    }
    if (vehicleInfo) {
      setVehicleInfo(vehicleInfo);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentBookingId(null);
    setCurrentCustomerDetails(null);
    setVehicleInfo(null);
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        currentBookingId,
        currentCustomerDetails,
        vehicleInfo,
        openModal,
        closeModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};