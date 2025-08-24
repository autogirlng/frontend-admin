import { useState, useCallback } from "react";
import { VehicleOnboardingTable } from "@/utils/types";
import { useHttp } from "@/utils/useHttp";
import { toast } from "react-toastify";
import {ApiRoutes} from "@/utils/ApiRoutes";
import { useQueryClient } from "@tanstack/react-query";

// Modal states interface
interface ModalStates {
  approveModal: boolean;
  rejectModal: boolean;
  requestUpdateModal: boolean;
  selectedVehicle: VehicleOnboardingTable | null;
}

// Loading states interface
interface LoadingStates {
  isApproving: boolean;
  isRejecting: boolean;
  isRequestingUpdate: boolean;
}

// Hook for managing all vehicle onboarding actions
export const useVehicleOnboardingActions = () => {
  const http = useHttp();
  const queryClient = useQueryClient();
  
  const [modalStates, setModalStates] = useState<ModalStates>({
    approveModal: false,
    rejectModal: false,
    requestUpdateModal: false,
    selectedVehicle: null,
  });

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    isApproving: false,
    isRejecting: false,
    isRequestingUpdate: false,
  });

  // Generic function to open modals
  const openModal = useCallback((modalType: keyof Omit<ModalStates, 'selectedVehicle'>, vehicle: VehicleOnboardingTable) => {
    setModalStates(prev => ({
      ...prev,
      [modalType]: true,
      selectedVehicle: vehicle,
    }));
  }, []);

  // Generic function to close modals
  const closeModal = useCallback((modalType: keyof Omit<ModalStates, 'selectedVehicle'>) => {
    setModalStates(prev => ({
      ...prev,
      [modalType]: false,
      selectedVehicle: null,
    }));
  }, []);

  // Close specific modal
  const closeApproveModal = useCallback(() => {
    setModalStates(prev => ({
      ...prev,
      approveModal: false,
      selectedVehicle: null,
    }));
  }, []);

  const closeRejectModal = useCallback(() => {
    setModalStates(prev => ({
      ...prev,
      rejectModal: false,
      selectedVehicle: null,
    }));
  }, []);

  const closeRequestUpdateModal = useCallback(() => {
    setModalStates(prev => ({
      ...prev,
      requestUpdateModal: false,
      selectedVehicle: null,
    }));
  }, []);

  // Close all modals
  const closeAllModals = useCallback(() => {
    setModalStates({
      approveModal: false,
      rejectModal: false,
      requestUpdateModal: false,
      selectedVehicle: null,
    });
  }, []);

  // Approve vehicle action
  const approveVehicle = useCallback(async (vehicleId: string, rejectReason?: string) => {
    setLoadingStates(prev => ({ ...prev, isApproving: true }));
    
    try {
      await http.put(`${ApiRoutes.vehicleOnboardingStatus}/${vehicleId}`, {
        status: "review",
        rejectReason: rejectReason || ""
      });
      
      toast.success("Vehicle approved successfully!");
      closeModal('approveModal');
      
      // Invalidate and refetch table data
      await queryClient.invalidateQueries({ queryKey: ["vehicleOnboardingTable"] });
      
      return true;
    } catch (error) {
      console.error("Error approving vehicle:", error);
      toast.error("Failed to approve vehicle. Please try again.");
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, isApproving: false }));
    }
  }, [http, closeModal, queryClient]);

  // Reject vehicle action
  const rejectVehicle = useCallback(async (vehicleId: string, rejectReason: string) => {
    setLoadingStates(prev => ({ ...prev, isRejecting: true }));
    
    try {
      await http.put(`${ApiRoutes.vehicleOnboardingStatus}/${vehicleId}`, {
        status: "rejected",
        rejectReason: rejectReason
      });
      
      toast.success("Vehicle rejected successfully!");
      closeModal('rejectModal');
      
      // Invalidate and refetch table data
      await queryClient.invalidateQueries({ queryKey: ["vehicleOnboardingTable"] });
      
      return true;
    } catch (error) {
      console.error("Error rejecting vehicle:", error);
      toast.error("Failed to reject vehicle. Please try again.");
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, isRejecting: false }));
    }
  }, [http, closeModal, queryClient]);

  // Request update action
  const requestUpdate = useCallback(async (vehicleId: string, message: string) => {
    setLoadingStates(prev => ({ ...prev, isRequestingUpdate: true }));
    
    try {
      await http.put(`${ApiRoutes.vehicleOnboardingStatus}/${vehicleId}`, {
        status: "feedback",
        rejectReason: message
      });
      
      toast.success("Update request sent successfully!");
      closeModal('requestUpdateModal');
      
      // Invalidate and refetch table data
      await queryClient.invalidateQueries({ queryKey: ["vehicleOnboardingTable"] });
      
      return true;
    } catch (error) {
      console.error("Error requesting update:", error);
      toast.error("Failed to send update request. Please try again.");
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, isRequestingUpdate: false }));
    }
  }, [http, closeModal, queryClient]);

  // Action handlers for opening modals
  const handleApprove = useCallback((vehicle: VehicleOnboardingTable) => {
    openModal('approveModal', vehicle);
  }, [openModal]);

  const handleReject = useCallback((vehicle: VehicleOnboardingTable) => {
    openModal('rejectModal', vehicle);
  }, [openModal]);

  const handleRequestUpdate = useCallback((vehicle: VehicleOnboardingTable) => {
    openModal('requestUpdateModal', vehicle);
  }, [openModal]);

  return {
    // Modal states
    modalStates,
    loadingStates,
    
    // Modal actions
    openModal,
    closeModal,
    closeAllModals,
    closeApproveModal,
    closeRejectModal,
    closeRequestUpdateModal,
    
    // Action handlers
    handleApprove,
    handleReject,
    handleRequestUpdate,
    
    // API actions
    approveVehicle,
    rejectVehicle,
    requestUpdate,
  };
}; 