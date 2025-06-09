"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BookingPaymentProps {
  // Add props if needed
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "/icons/credit-card.svg", // You'll need to add these icons
    description: "Pay securely with your credit or debit card"
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "/icons/bank-transfer.svg",
    description: "Make a direct transfer to our bank account"
  },
  {
    id: "ussd",
    name: "USSD",
    icon: "/icons/ussd.svg",
    description: "Pay using USSD code from your bank"
  }
];

export default function BookingPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  
  // Get the booking ID from the URL query parameters
  const bookingId = searchParams.get('bookingId');
  
  useEffect(() => {
    // Fetch booking details if bookingId is available
    if (bookingId) {
      // For demo purposes, using mock data
      // In production, you would fetch from your API
      setBookingDetails({
        id: bookingId,
        customerName: "Mamudu Jeffrey",
        carModel: "2025 Toyota Corolla",
        amount: 76000,
        customerEmail: "jeffmamudu@gmail.com"
      });
    } else {
      setError("No booking ID provided");
    }
  }, [bookingId]);
  
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };
  
  const handleProcessPayment = async () => {
    if (!bookingDetails) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the payment processing API
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingDetails.id,
          amount: bookingDetails.amount,
          paymentMethod: selectedMethod,
          customerEmail: bookingDetails.customerEmail
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment');
      }
      
      // Handle successful payment initialization
      if (data.paymentLink) {
        // Redirect to the payment gateway URL
        window.location.href = data.paymentLink;
      } else {
        // Store the payment reference and redirect to a success page
        localStorage.setItem('paymentReference', data.reference);
        router.push(`/booking/payment/status?reference=${data.reference}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing payment');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/"
              className="inline-block py-3 px-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">omuvment</Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Booking ID: <span className="font-semibold">{bookingDetails.id}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {/* If you don't have actual icons, you can use a placeholder */}
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          {method.id.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded-full border ${
                          selectedMethod === method.id 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedMethod === method.id && (
                            <div className="flex items-center justify-center h-full">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleProcessPayment}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Car Model:</span>
                  <span className="font-medium">{bookingDetails.carModel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{bookingDetails.customerName}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">NGN {bookingDetails.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                <p>By proceeding with the payment, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                href={`/booking/details?id=${bookingId}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Return to booking details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}