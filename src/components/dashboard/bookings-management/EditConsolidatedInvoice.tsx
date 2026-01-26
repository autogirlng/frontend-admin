"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Check, AlertCircle, FileText, Layers } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateConsolidatedInvoice, useGetConsolidatedInvoiceById, useEditConsolidatedInvoice } from "./useConsolidatedInvoices";
import { useGetFinanceBookings } from "@/lib/hooks/finance/useFinanceBookings";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Booking } from "../finance/bookings/types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { formatPrice } from "@/lib/utils/price-format";

interface EditConsolidatedModalProps {
    onClose: () => void;
    consolidatedInvoiceId?: string;
    customerName?: string;
}

export function EditConsolidatedModal({
    onClose,
    consolidatedInvoiceId,
    customerName
}: EditConsolidatedModalProps) {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(
        new Set()
    );
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const createMutation = useCreateConsolidatedInvoice();
    const editMutation = useEditConsolidatedInvoice(consolidatedInvoiceId || "");

    // --- Data Fetching ---
    const { data: bookingData, isLoading } = useGetFinanceBookings({
        page: 0,
        bookingStatus: null,
        startDate: null,
        endDate: null,
        searchTerm: debouncedSearchTerm,
        paymentMethod: null,
    });

    const bookings = bookingData?.content || [];

    const { data: consolidatedInvoiceData } = useGetConsolidatedInvoiceById(consolidatedInvoiceId || "");
    useEffect(() => {
        if (consolidatedInvoiceData) {
            const initialSet = new Set<string>(consolidatedInvoiceData.invoiceNumbers);
            setSelectedInvoices(initialSet);
        }
        setSearchTerm(customerName || "");
    }, [consolidatedInvoiceData]);



    // --- Handlers ---
    const handleToggle = (invoiceNumber: string) => {
        if (!invoiceNumber) return;
        setSelectedInvoices((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(invoiceNumber)) {
                newSet.delete(invoiceNumber);
            } else {
                newSet.add(invoiceNumber);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        if (selectedInvoices.size === 0) {
            toast.error("Please select at least one booking invoice.");
            return;
        }
        editMutation.mutate(
            { bookingInvoiceNumbers: Array.from(selectedInvoices) },
            { onSuccess: onClose }
        );
    };

    return (
        // 1. Full Screen Overlay with Backdrop
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
            {/* 2. Responsive Modal Container */}
            <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                {/* --- Header (Fixed) --- */}
                <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                            <Layers className="h-5 w-5 text-blue-600" />
                            Edit Consolidated Invoice
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Select and remove invoices to group together.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                        disabled={createMutation.isPending}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>


                {/* --- Scrollable Body --- */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
                    {/* Sticky Search Bar within body */}
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <TextInput
                                label="Search"
                                id="search-bookings"
                                hideLabel
                                placeholder="Search invoice #, customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full !pl-9 !py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 transition-all text-sm rounded-lg"
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                    </div>



                    {/* List Content */}
                    <div className="p-4 space-y-2 flex-1">
                        <div className="font-bold text-xs  mb-2">
                            INVOICES: <span className="text-gray-600">{consolidatedInvoiceData?.invoiceNumbers.map((invoiceNumber: string) => invoiceNumber).join(', ')}</span>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <CustomLoader />
                                <span className="text-xs mt-3">Loading invoices...</span>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                                <AlertCircle className="h-10 w-10 mb-2 text-gray-300" />
                                <p className="font-medium">No bookings found</p>
                                <p className="text-xs">Try changing your search term.</p>
                            </div>
                        ) : (
                            bookings.map((booking: Booking) => {
                                if (!booking.invoiceNumber) return null;
                                const isSelected = selectedInvoices.has(booking.invoiceNumber);

                                return (
                                    <div
                                        key={booking.bookingId}
                                        onClick={() => handleToggle(booking.invoiceNumber!)}
                                        className={`
                      relative group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none
                      ${isSelected
                                                ? "bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500 z-10"
                                                : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                                            }
                    `}
                                    >
                                        {/* Left Info */}
                                        <div className="flex items-start gap-3 overflow-hidden">
                                            <div
                                                className={`
                         flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors
                         ${isSelected
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-gray-100 text-gray-500"
                                                    }
                      `}
                                            >
                                                <FileText className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={`text-sm font-bold font-mono truncate ${isSelected ? "text-blue-900" : "text-gray-900"
                                                            }`}
                                                    >
                                                        {booking.invoiceNumber}
                                                    </p>
                                                    <span
                                                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${booking.bookingStatus === "CONFIRMED"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {booking.bookingStatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {booking.customerName}
                                                </p>
                                                <p className="text-[10px] text-gray-400 truncate">
                                                    {booking.vehicleName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Info (Price & Checkbox) */}
                                        <div className="flex flex-col items-end gap-1 pl-2 flex-shrink-0">
                                            <span className="text-sm font-bold text-gray-900">
                                                {formatPrice(booking.totalPrice)}
                                            </span>

                                            {/* Checkbox Visual */}
                                            <div
                                                className={`
                        w-5 h-5 rounded-full border flex items-center justify-center transition-all mt-1
                        ${isSelected
                                                        ? "bg-blue-500 border-blue-500 scale-110"
                                                        : "bg-white border-gray-300 group-hover:border-blue-400"
                                                    }
                      `}
                                            >
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-white stroke-[3]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* --- Footer (Fixed) --- */}
                <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 hidden sm:flex">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                            {selectedInvoices.size}
                        </div>
                        <span>invoices selected</span>
                    </div>

                    <div className="flex w-full sm:w-auto gap-3">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 sm:flex-none"
                            disabled={createMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            isLoading={editMutation.isPending}
                            disabled={selectedInvoices.size === 0}
                            className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
                        >
                            Edit ({selectedInvoices.size})
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
