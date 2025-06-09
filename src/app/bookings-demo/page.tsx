'use client';

import React from 'react';
import { ModalProvider } from '../../context/ModalContext';
import BookingsTable from '../../components/tables/BookingsTable';
import ModalManager from '../../components/modals/ModalManager';

export default function BookingsDemoPage() {
  return (
    <ModalProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-h3 font-semibold text-grey-900 mb-6">Bookings Management</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-grey-200 p-6">
          <h2 className="text-xl font-semibold text-grey-800 mb-4">Active Bookings</h2>
          <BookingsTable />
        </div>
        
        {/* This component will render all our modals */}
        <ModalManager />
      </div>
    </ModalProvider>
  );
}