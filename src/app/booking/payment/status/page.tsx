"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any | null>(null);
  
  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setStatus('failed');
        return;
      }
      
      try {
        // Call the verify payment API
        const response = await fetch(`/api/payment/verify?reference=${reference}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setStatus('success');
          setPaymentDetails(data);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
      }
    }
    
    verifyPayment();
  }, [reference]);
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again or contact customer support.
            </p>
            <div className="space-y-3">
              <Link 
                href={`/booking/payment?bookingId=${reference?.split('-')[1] || ''}`}
                className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <Link 
                href="/"
                className="inline-block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md w-full">
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful</h2>
          <p className="text-gray-600 mb-6">
            Your payment has been successfully processed. Your booking is now confirmed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">{reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Successful</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link 
              href={`/booking/details?id=${paymentDetails?.bookingId || ''}`}
              className="inline-block w-full py-3 px-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              View Booking Details
            </Link>
            <Link 
              href="/dashboard"
              className="inline-block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}