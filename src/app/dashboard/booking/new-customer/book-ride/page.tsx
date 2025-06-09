'use client'
import { Suspense } from "react";
import { FullPageSpinner } from "@/components/shared/spinner";
import { BookRideLayout } from "@/components/bookings/book-ride/BookRideLayout";

const BookRide = () => {




    return (
        <Suspense fallback={<FullPageSpinner />}>
            <BookRideLayout />
        </Suspense>
    )

}

export default BookRide