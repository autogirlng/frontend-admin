"use client";

import React, { useEffect, useState } from 'react';
import { MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import ActionComponent from './ActionComponent';
import { useModal } from "@/context/ModalContext";
import ModalManager from '../modals/ModalManager';
import { bookingService, Booking, BookingFilters } from '../../services/bookingService';
import { toast } from 'react-toastify';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface BookingsTableProps {
  filters?: BookingFilters;
}

const BookingsTable = ({ filters = {} }: BookingsTableProps) => {
  const { openModal } = useModal();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalData, setModalData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState<BookingFilters>({
    limit: 10,
    page: 1,
    status: 'APPROVED',
    search: ''
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookings(localFilters);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [localFilters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setLocalFilters((prev: BookingFilters) => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleStatusChange = (status: string) => {
    setLocalFilters((prev: BookingFilters) => ({
      ...prev,
      status: status as BookingFilters['status'],
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setLocalFilters((prev: BookingFilters) => ({
      ...prev,
      page
    }));
  };

  const handleActionSelect = (action: string, booking: Booking) => {
    const customerDetails = {
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
    };

    switch (action) {
      case 'view-details':
        openModal('view-details', booking.bookingId, customerDetails);
        break;
      case 'flag':
        openModal('flag', booking.bookingId, customerDetails);
        break;
      case 'request-info':
        openModal('request-info', booking.bookingId, customerDetails);
        break;
      case 'cancel':
        openModal('cancel', booking.bookingId, customerDetails);
        break;
      case 'approve':
        openModal('approve', booking.bookingId, customerDetails);
        break;
      case 'assign-driver':
        openModal('assign-driver', booking.bookingId, customerDetails, booking.vehicle);
        break;
      case 'contact':
        openModal('contact', booking.bookingId, customerDetails);
        break;
      case 'vehicle-availability':
        openModal('vehicle-availability', booking.bookingId, customerDetails, booking.vehicle);
        break;
      case 'download-receipt':
        openModal('download-receipt', booking.bookingId, customerDetails);
        break;
      case 'mark-corrected':
        openModal('mark-corrected', booking.bookingId, customerDetails);
        break;
      case 'add-notes':
        openModal('add-notes', booking.bookingId, customerDetails);
        break;
      case 'reject':
        openModal('reject', booking.bookingId, customerDetails);
        break;
      case 'view-cancellation':
        openModal('view-cancellation', booking.bookingId, customerDetails);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'bookingId',
      header: 'ID',
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Name',
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
    },
    {
      accessorKey: 'bookingType',
      header: 'Booking Type',
      cell: info => {
        const value = info.getValue() as string;
        return value ? value.replace('_', ' ').toLowerCase() : '-';
      }
    },
    {
      accessorKey: 'hostName',
      header: 'Host Name',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const value = info.getValue() as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
            {value}
          </span>
        );
      }
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => {
        const value = info.getValue() as number;
        return value ? `$${value}` : '-';
      }
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: info => {
        const value = info.getValue() as string;
        return formatDate(value);
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <ActionComponent
            booking={row.original}
            onActionSelect={(action) => handleActionSelect(action, row.original)}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ModalManager />
      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="ml-4">
              <select
                value={localFilters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {((localFilters.page || 1) - 1) * (localFilters.limit || 10) + 1} to {Math.min((localFilters.page || 1) * (localFilters.limit || 10), bookings.length)} of {bookings.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange((localFilters.page || 1) - 1)}
                    disabled={(localFilters.page || 1) === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange((localFilters.page || 1) + 1)}
                    disabled={bookings.length < (localFilters.limit || 10)}
                    className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsTable;
