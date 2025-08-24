# Vehicle Onboarding Table - Complete Implementation

This directory contains a complete implementation of the vehicle onboarding table with working approve, reject, and request update functionality for both mobile and desktop.

## 🚀 Features

- **Approve Vehicle**: Approve vehicles with optional reason
- **Reject Vehicle**: Reject vehicles with required reason
- **Request Update**: Send update requests to hosts with custom messages
- **Mobile & Desktop Support**: Responsive modals for both platforms
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: Toast notifications for success/error states
- **Form Validation**: Required field validation for reject and request update actions

## 📁 File Structure

```
VehicleOnboarding/
├── hooks/
│   ├── useVehicleOnboardingTable.ts (existing)
│   ├── useVehicleOnboardingStats.ts (existing)
│   └── useVehicleOnboardingActions.ts (new - main hooks file)
├── modals/
│   ├── ApproveVehicleModal.tsx (desktop approve modal)
│   ├── RejectVehicleModal.tsx (desktop reject modal)
│   ├── RequestUpdateModal.tsx (desktop request update modal)
│   └── MobileActionModal.tsx (mobile unified modal)
├── Table.tsx (updated)
├── VehicleOnboardingDesktopRow.tsx (updated)
├── VehicleOnboardingMobileRow.tsx (updated)
├── vehicleOnboardingTable.tsx (updated)
└── README.md (this file)
```

## 🪝 Hooks Documentation

### `useVehicleOnboardingActions` (Main Hook)

The primary hook that manages all vehicle onboarding actions and modal states.

```typescript
const {
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
} = useVehicleOnboardingActions();
```

#### Modal States
- `modalStates.approveModal`: Boolean for approve modal visibility
- `modalStates.rejectModal`: Boolean for reject modal visibility
- `modalStates.requestUpdateModal`: Boolean for request update modal visibility
- `modalStates.selectedVehicle`: Currently selected vehicle for action

#### Loading States
- `loadingStates.isApproving`: Boolean for approve action loading
- `loadingStates.isRejecting`: Boolean for reject action loading
- `loadingStates.isRequestingUpdate`: Boolean for request update action loading

#### Action Handlers
- `handleApprove(vehicle)`: Opens approve modal for a vehicle
- `handleReject(vehicle)`: Opens reject modal for a vehicle
- `handleRequestUpdate(vehicle)`: Opens request update modal for a vehicle

#### API Actions
- `approveVehicle(vehicleId, reason?)`: Approves a vehicle (reason optional)
- `rejectVehicle(vehicleId, reason)`: Rejects a vehicle (reason required)
- `requestUpdate(vehicleId, message)`: Sends update request (message required)

### Individual Modal Hooks

#### `useApproveModal`
```typescript
const {
  isOpen,
  selectedVehicle,
  isLoading,
  reason,
  setReason,
  openModal,
  closeModal,
  handleApprove,
} = useApproveModal();
```

#### `useRejectModal`
```typescript
const {
  isOpen,
  selectedVehicle,
  isLoading,
  reason,
  setReason,
  openModal,
  closeModal,
  handleReject,
} = useRejectModal();
```

#### `useRequestUpdateModal`
```typescript
const {
  isOpen,
  selectedVehicle,
  isLoading,
  message,
  setMessage,
  openModal,
  closeModal,
  handleRequestUpdate,
} = useRequestUpdateModal();
```

### Platform-Specific Hooks

#### `useMobileModalManager`
```typescript
const {
  activeModal,
  selectedVehicle,
  openModal,
  closeModal,
} = useMobileModalManager();
```

#### `useDesktopModalManager`
```typescript
const {
  activeModal,
  selectedVehicle,
  openModal,
  closeModal,
} = useDesktopModalManager();
```

## 🎨 Modal Components

### Desktop Modals

#### `ApproveVehicleModal`
- **Purpose**: Approve vehicles with optional reason
- **Props**: `isOpen`, `onClose`, `vehicle`, `onApprove`, `isLoading`
- **Features**: Form validation, loading states, vehicle details display

#### `RejectVehicleModal`
- **Purpose**: Reject vehicles with required reason
- **Props**: `isOpen`, `onClose`, `vehicle`, `onReject`, `isLoading`
- **Features**: Required field validation, loading states, vehicle details display

#### `RequestUpdateModal`
- **Purpose**: Send update requests to hosts
- **Props**: `isOpen`, `onClose`, `vehicle`, `onRequestUpdate`, `isLoading`
- **Features**: Required field validation, loading states, vehicle details display

### Mobile Modal

#### `MobileActionModal`
- **Purpose**: Unified modal for all actions on mobile
- **Props**: `isOpen`, `onClose`, `vehicle`, `actionType`, `onApprove`, `onReject`, `onRequestUpdate`, `isLoading`
- **Features**: 
  - Bottom sheet design for mobile
  - Dynamic content based on action type
  - Form validation
  - Loading states
  - Vehicle details display

## 🔧 Usage Example

```typescript
import { useVehicleOnboardingActions } from './hooks/useVehicleOnboardingActions';
import ApproveVehicleModal from './modals/ApproveVehicleModal';
import RejectVehicleModal from './modals/RejectVehicleModal';
import RequestUpdateModal from './modals/RequestUpdateModal';
import MobileActionModal from './modals/MobileActionModal';

function VehicleOnboardingTable() {
  const {
    modalStates,
    loadingStates,
    handleApprove,
    handleReject,
    handleRequestUpdate,
    approveVehicle,
    rejectVehicle,
    requestUpdate,
    closeApproveModal,
    closeRejectModal,
    closeRequestUpdateModal,
  } = useVehicleOnboardingActions();

  return (
    <div>
      {/* Your table component */}
      <OnboardedAnalyticsTable
        items={data}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestUpdate={handleRequestUpdate}
      />

      {/* Desktop Modals */}
      <ApproveVehicleModal
        isOpen={modalStates.approveModal}
        onClose={closeApproveModal}
        vehicle={modalStates.selectedVehicle}
        onApprove={approveVehicle}
        isLoading={loadingStates.isApproving}
      />

      <RejectVehicleModal
        isOpen={modalStates.rejectModal}
        onClose={closeRejectModal}
        vehicle={modalStates.selectedVehicle}
        onReject={rejectVehicle}
        isLoading={loadingStates.isRejecting}
      />

      <RequestUpdateModal
        isOpen={modalStates.requestUpdateModal}
        onClose={closeRequestUpdateModal}
        vehicle={modalStates.selectedVehicle}
        onRequestUpdate={requestUpdate}
        isLoading={loadingStates.isRequestingUpdate}
      />

      {/* Mobile Modal */}
      <MobileActionModal
        isOpen={modalStates.approveModal || modalStates.rejectModal || modalStates.requestUpdateModal}
        onClose={() => {
          closeApproveModal();
          closeRejectModal();
          closeRequestUpdateModal();
        }}
        vehicle={modalStates.selectedVehicle}
        actionType={
          modalStates.approveModal ? 'approve' :
          modalStates.rejectModal ? 'reject' :
          modalStates.requestUpdateModal ? 'requestUpdate' : null
        }
        onApprove={approveVehicle}
        onReject={rejectVehicle}
        onRequestUpdate={requestUpdate}
        isLoading={loadingStates.isApproving || loadingStates.isRejecting || loadingStates.isRequestingUpdate}
      />
    </div>
  );
}
```

## 🔌 API Integration

The hooks are currently set up with simulated API calls. To integrate with real APIs:

1. **Replace the TODO comments** in `useVehicleOnboardingActions.ts` with actual API endpoints
2. **Update the API routes** in `ApiRoutes.ts` to include:
   - `/admin/vehicle/{id}/approve`
   - `/admin/vehicle/{id}/reject`
   - `/admin/vehicle/{id}/request-update`

Example API integration:
```typescript
// In useVehicleOnboardingActions.ts
const approveVehicle = useCallback(async (vehicleId: string, reason?: string) => {
  setLoadingStates(prev => ({ ...prev, isApproving: true }));
  
  try {
    await http.post(`/admin/vehicle/${vehicleId}/approve`, { reason });
    toast.success("Vehicle approved successfully!");
    closeModal('approveModal');
    return true;
  } catch (error) {
    console.error("Error approving vehicle:", error);
    toast.error("Failed to approve vehicle. Please try again.");
    return false;
  } finally {
    setLoadingStates(prev => ({ ...prev, isApproving: false }));
  }
}, [closeModal]);
```

## 🎯 Status-Based Actions

The buttons are conditionally rendered based on vehicle status:

- **Pending/Review**: Show Approve, Request Update, Reject
- **Rejected**: Show Request Update
- **Accepted**: No action buttons (view only)

## 📱 Responsive Design

- **Desktop**: Individual modals for each action
- **Mobile**: Unified bottom sheet modal that adapts to the action type
- **Tablet**: Uses desktop modals with mobile-friendly sizing

## 🎨 Styling

All components use Tailwind CSS classes consistent with the project's design system:
- Primary colors: `primary-500`, `primary-600`
- Grey scale: `grey-50` to `grey-900`
- Status colors: `green-600` (approve), `red-600` (reject), `blue-600` (request update)

## 🚀 Getting Started

1. **Import the hooks** in your component
2. **Set up the modal states** using the main hook
3. **Pass action handlers** to your table components
4. **Render the modals** with proper state management
5. **Replace API calls** with your actual endpoints

The implementation is ready to use and will work immediately with the simulated API calls. Just replace the TODO comments with your actual API endpoints when ready. 