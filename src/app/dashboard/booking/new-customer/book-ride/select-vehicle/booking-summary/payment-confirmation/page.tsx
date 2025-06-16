'use client'
import React, { Suspense, } from 'react';

import { BookingSummaryPaymentLayout } from '@/components/bookings/booking-summary-payment/BookingSummaryPaymentLayout';
import { FullPageSpinner } from '@/components/shared/spinner';
const BookingSummaryPayment = () => {



    return (
        <Suspense fallback={<FullPageSpinner />}>
            <BookingSummaryPaymentLayout />
        </Suspense>
    )
}

export default BookingSummaryPayment