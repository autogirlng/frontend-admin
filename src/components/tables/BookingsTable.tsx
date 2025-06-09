import React from 'react';
import { useModal } from '../../context/ModalContext';

// Define types for our booking data
interface Booking {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  vehicle: string;
  amount: number;
}

// Sample data
const sampleBookings: Booking[] = [
  {
    id: '1',
    bookingId: 'BK12345',
    customerName: 'Mamudu Jeffrey',
    customerEmail: 'jeffmamudu@gmail.com',
    customerPhone: '09039032585',
    date: '2023-10-15',
    status: 'confirmed',
    vehicle: '2025 Toyota Corolla',
    amount: 76000
  },
  {
    id: '2',
    bookingId: 'BK12346',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '08012345678',
    date: '2023-10-17',
    status: 'pending',
    vehicle: '2024 Honda Civic',
    amount: 65000
  },
  {
    id: '3',
    bookingId: 'BK12347',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '07098765432',
    date: '2023-10-20',
    status: 'completed',
    vehicle: '2023 Mercedes Benz',
    amount: 125000
  }
];

// Define our action types
const tableActions = [
  { label: "Flag Abuse", action: "flag", icon: "🚩" },
  { label: "Request Info", action: "request-info", icon: "ℹ️" },
  { label: "View Details", action: "view-details", icon: "👁️" },
  { label: "Cancel Booking", action: "cancel", icon: "❌" }
];

const BookingsTable: React.FC = () => {
  const { openModal } = useModal();

  const handleAction = (action: string, booking: Booking) => {
    // Type assertion to match the expected modal types
    const modalType = action as 'flag' | 'request-info' | 'view-details' | 'cancel';
    
    const customerDetails = {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail
    };
    
    openModal(modalType, booking.id, customerDetails);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-grey-100">
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Booking ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Vehicle</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-grey-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sampleBookings.map((booking) => (
            <tr key={booking.id} className="border-b border-grey-200 hover:bg-grey-50">
              <td className="px-4 py-4 text-sm text-grey-800">{booking.bookingId}</td>
              <td className="px-4 py-4 text-sm text-grey-800">{booking.customerName}</td>
              <td className="px-4 py-4 text-sm text-grey-800">{booking.date}</td>
              <td className="px-4 py-4 text-sm text-grey-800">{booking.vehicle}</td>
              <td className="px-4 py-4 text-sm text-grey-800">NGN {booking.amount.toLocaleString()}</td>
              <td className="px-4 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-success-50 text-success-600' :
                  booking.status === 'pending' ? 'bg-warning-75 text-warning-700' :
                  booking.status === 'completed' ? 'bg-primary-100 text-primary-700' :
                  'bg-error-50 text-error-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">
                <div className="flex items-center space-x-2">
                  {tableActions.map((action) => (
                    <button
                      key={action.action}
                      onClick={() => handleAction(action.action, booking)}
                      className="p-1.5 hover:bg-grey-100 rounded-full transition-colors"
                      aria-label={action.label}
                      title={action.label}
                    >
                      <span>{action.icon}</span>
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;