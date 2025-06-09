"use client";
import React, { useState, useEffect } from 'react';
import { Share, MapPin, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { VehicleImage } from '../ui/vehicle-image';

export default function MuvmentBookingPage() {
  // State to prevent continuous image loading requests
  const [vehicleId, setVehicleId] = useState<number>(2);

  // Set a random vehicle ID on component mount to avoid always fetching the same images
  useEffect(() => {
    // This is just to prevent continuous network requests for the same image
    const randomVehicleId = Math.floor(Math.random() * 5) + 1; 
    setVehicleId(randomVehicleId);
  }, []);

  const [expandedSections, setExpandedSections] = useState({
    prices: true,
    duration: true,
    itinerary: true,
    extras: true
  });

  type SectionKey = 'prices' | 'duration' | 'itinerary' | 'extras';
  const toggleSection = (section: SectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-grey-100 border-b mt-12 w-[90%] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <img 
        src="/images/logo/nav_logo.png" 
        alt="Muvment Logo" 
        className="w-13 h-6 object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-grey-900 mb-2">Trip For Mamudu Jeffrey!</h1>
        <p className="text-grey-600">Booking ID: BkK8901920</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Trip Details Header */}
            <div className="bg-white rounded-lg shadow-sm border-grey-100 border">
              <div className="flex items-center justify-between p-4 border-grey-100 border-b">
                <h2 className="text-lg font-semibold text-grey-900">Trip Details</h2>
                <button className="flex items-center gap-2 text-grey-600 hover:text-grey-800">
                  <Share size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Prices Section */}
              <div className="border-grey-100 border-b">
                <button 
                  onClick={() => toggleSection('prices')}
                  className="w-full flex items-center justify-between p-4 hover:bg-grey-50"
                >
                  <span className="font-medium text-grey-900">Prices</span>
                  {expandedSections.prices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.prices && (
                  <div className="pb-4 px-4">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-sm text-grey-600 mb-1">Daily</div>
                        <div className="font-semibold">NGN 20,000/day</div>
                      </div>
                      <div>
                        <div className="text-sm text-grey-600 mb-1">Extra hours</div>
                        <div className="font-semibold">NGN 2,700/hr</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Duration Section */}
              <div className="border-grey-100 border-b">
                <button 
                  onClick={() => toggleSection('duration')}
                  className="w-full flex items-center justify-between p-4 hover:bg-grey-50"
                >
                  <span className="font-medium text-grey-900">Duration</span>
                  {expandedSections.duration ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.duration && (
                  <div className="pb-4 px-4">
                    <div className="inline-block bg-grey-900 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      2 days
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                          <span className="text-grey-700">Start</span>
                        </div>
                        <span className="text-grey-900 font-medium">14th Aug 2024 | 10:30AM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                          <span className="text-grey-700">Stop</span>
                        </div>
                        <span className="text-grey-900 font-medium">15th Aug 2024 | 10:30AM</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Itinerary Section */}
              <div className="border-grey-100 border-b">
                <button 
                  onClick={() => toggleSection('itinerary')}
                  className="w-full flex items-center justify-between p-4 hover:bg-grey-50"
                >
                  <span className="font-medium text-grey-900">Itinerary</span>
                  {expandedSections.itinerary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.itinerary && (
                  <div className="pb-4 px-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={16} className="text-success-500" />
                        <span className="font-medium text-grey-900">Pick-up</span>
                        <button className="ml-auto text-primary-500 text-sm hover:underline">
                          View Location
                        </button>
                      </div>
                      <p className="text-grey-600 text-sm ml-7">25B, Adeola Odeku Street, Off Ahmadu Bello ...</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={16} className="text-error-500" />
                        <span className="font-medium text-grey-900">Drop-off</span>
                        <button className="ml-auto text-primary-500 text-sm hover:underline">
                          View Location
                        </button>
                      </div>
                      <p className="text-grey-600 text-sm ml-7">25B, Adeola Odeku Street, Off Ahmadu Bello ...</p>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-grey-900 mb-3">Areas of use</h4>
                      <div className="space-y-2">
                        <div className="text-grey-600 text-sm">Mainland</div>
                        <div className="text-grey-600 text-sm">Island</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-grey-900 mb-3">Outskirt Locations</h4>
                      <div className="space-y-2">
                        <div className="text-grey-600 text-sm">Ajah</div>
                        <div className="text-grey-600 text-sm">Sango</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Extras Section */}
              <div>
                <button 
                  onClick={() => toggleSection('extras')}
                  className="w-full flex items-center justify-between p-4 hover:bg-grey-50"
                >
                  <span className="font-medium text-grey-900">Extras</span>
                  {expandedSections.extras ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSections.extras && (
                  <div className="pb-4 px-4">
                    <div className="mb-4">
                      <h4 className="font-medium text-grey-900 mb-3">Extra Details</h4>
                      <p className="text-grey-600 text-sm leading-relaxed">
                        I plan to take a route through the Lekki-Epe Expressway, with a few stops along the way. The first stop will be at Lekki Conservation Centre for a short break and to walk the canopy, lasting around 45 minutes. Next, I'll stop at Nike Art Gallery in Lekki for a quick visit to explore some local art, with an estimated stop of about an hour. Finally, I'll stop in Victoria Island for lunch and a brief stroll by the waterfront before heading back. The total distance for the trip is approximately 40 kilometers, with no major detours expected.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-grey-900 mb-3">Trip Purpose</h4>
                      <div className="text-grey-600 text-sm">Business</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle & Booking Info */}
          <div className="space-y-6">
            {/* Vehicle Card */}
            <div className="bg-white rounded-lg shadow-sm border-grey-100 border p-6 text-center">
              {/* Use the new VehicleImage component with error handling */}
              <VehicleImage id={vehicleId} className="w-24 h-16 mx-auto mb-4" />
              <h3 className="font-semibold text-grey-900">2025 Toyota Corolla</h3>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border-grey-100 border p-6">
              <h3 className="font-semibold text-grey-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Name</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-warning-400 rounded-full"></div>
                    <span className="font-medium">Mamudu Jeffrey</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Email</span>
                  <span className="font-medium">jeffmamudu@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Phone Number</span>
                  <span className="font-medium">09039032585</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border-grey-100 border p-6">
              <h3 className="font-semibold text-grey-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Total Cost</span>
                  <span className="font-medium">NGN 95,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Extra hours</span>
                  <span className="text-primary-500 text-sm">Billed as you go</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-grey-600">Discount -20%</span>
                  <span className="font-medium">-NGN 19,000</span>
                </div>
                <hr className="my-3 border-grey-100" />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>NGN 76,000</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="text-primary-500 text-sm hover:underline">
                  Learn more about our free cancellation
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-white border border-grey-300 text-grey-700 py-3 px-4 rounded-3xl font-medium hover:bg-grey-50 transition-colors">
                  Save Booking
                </button>
                <button className="w-full bg-primary-500 text-white py-3 px-4 rounded-3xl font-medium hover:bg-primary-600 transition-colors">
                  Proceed to payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}