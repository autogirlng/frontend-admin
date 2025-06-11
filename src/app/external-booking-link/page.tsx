"use client";

import React, { useState } from 'react';
import { Share, MapPin, Clock, ChevronUp, ChevronDown } from 'lucide-react';

export default function ExternalBookingLinkPage() {
  const [expandedSections, setExpandedSections] = useState({
    prices: true,
    duration: true,
    itinerary: true,
    extras: true
  });

  const toggleSection = (section: 'prices' | 'duration' | 'itinerary' | 'extras') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dummy Data to match the image
  const bookingData = {
    bookingId: "BkK8901920",
    tripName: "Trip For Mamudu Jeffrey!",
    prices: {
      daily: "NGN 20,000/day",
      extraHours: "NGN 2,700/hr"
    },
    duration: {
      days: "2 days",
      start: "14th Aug 2024 | 10:30AM",
      stop: "15th Aug 2024 | 10:30AM"
    },
    itinerary: {
      pickupLocation: "25B, Adeola Odeku Street, Off Ahmadu Bello ...",
      dropoffLocation: "25B, Adeola Odeku Street, Off Ahmadu Bello ...",
      allowedAreas: ["Mainland", "Island"],
      outskirtLocations: ["Ajah", "Sango"]
    },
    extras: {
      details: "I plan to take a route through the Lekki-Epe Expressway, with a few stops along the way. The first stop will be at Lekki Conservation Centre for a short break and to walk the canopy, lasting around 45 minutes. Next, I'll stop at Nike Art Gallery in Lekki for a quick visit to explore some local art, with an estimated stop of about an hour. Finally, I'll stop in Victoria Island for lunch and a brief stroll by the waterfront before heading back. The total distance for the trip is approximately 40 kilometers, with no major detours expected.",
      purpose: "Business"
    },
    vehicle: "2025 Toyota Corolla",
    personalInfo: {
      name: "Mamudu Jeffrey",
      email: "jeffmamudu@gmail.com",
      phone: "09039032585"
    },
    costBreakdown: {
      totalCost: "NGN 95,000",
      extraHoursBilling: "Billed as you go",
      discount: "-NGN 19,000",
      finalTotal: "NGN 76,000"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">muvment</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{bookingData.tripName}</h1>
        <p className="text-gray-600 text-sm sm:text-base">Booking ID: {bookingData.bookingId}</p>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Trip Details Header */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Trip Details</h2>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <Share size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Prices Section */}
              <div className="border-b last:border-b-0">
                <button 
                  onClick={() => toggleSection('prices')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">Prices</span>
                  {expandedSections.prices ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {expandedSections.prices && (
                  <div className="pb-4 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Daily</div>
                        <div className="font-semibold text-gray-900">{bookingData.prices.daily}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Extra hours</div>
                        <div className="font-semibold text-gray-900">{bookingData.prices.extraHours}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Duration Section */}
              <div className="border-b last:border-b-0">
                <button 
                  onClick={() => toggleSection('duration')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">Duration</span>
                  {expandedSections.duration ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {expandedSections.duration && (
                  <div className="pb-4 px-4">
                    <div className="inline-block bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      {bookingData.duration.days}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">Start</span>
                        </div>
                        <span className="text-gray-900 font-medium text-sm sm:text-base">{bookingData.duration.start}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">Stop</span>
                        </div>
                        <span className="text-gray-900 font-medium text-sm sm:text-base">{bookingData.duration.stop}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Itinerary Section */}
              <div className="border-b last:border-b-0">
                <button 
                  onClick={() => toggleSection('itinerary')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">Itinerary</span>
                  {expandedSections.itinerary ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {expandedSections.itinerary && (
                  <div className="pb-4 px-4 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={16} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Pick-up</span>
                        <button className="ml-auto text-blue-600 text-sm hover:underline whitespace-nowrap">
                          View Location
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm ml-7 break-words">{bookingData.itinerary.pickupLocation}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={16} className="text-red-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Drop-off</span>
                        <button className="ml-auto text-blue-600 text-sm hover:underline whitespace-nowrap">
                          View Location
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm ml-7 break-words">{bookingData.itinerary.dropoffLocation}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Areas of use</h4>
                      <div className="space-y-2">
                        {bookingData.itinerary.allowedAreas.map((area, index) => (
                          <div key={index} className="text-gray-600 text-sm">{area}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Outskirt Locations</h4>
                      <div className="space-y-2">
                        {bookingData.itinerary.outskirtLocations.map((location, index) => (
                          <div key={index} className="text-gray-600 text-sm">{location}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Extras Section */}
              <div className="last:border-b-0">
                <button 
                  onClick={() => toggleSection('extras')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-900">Extras</span>
                  {expandedSections.extras ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {expandedSections.extras && (
                  <div className="pb-4 px-4">
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Extra Details</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {bookingData.extras.details}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Trip Purpose</h4>
                      <div className="text-gray-600 text-sm">{bookingData.extras.purpose}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle & Booking Info */}
          <div className="space-y-6">
            {/* Vehicle Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-24 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Car Image</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{bookingData.vehicle}</h3>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 text-sm flex-shrink-0">Name</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-sm truncate">{bookingData.personalInfo.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 text-sm flex-shrink-0">Email</span>
                  <span className="font-medium text-sm truncate">{bookingData.personalInfo.email}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 text-sm flex-shrink-0">Phone Number</span>
                  <span className="font-medium text-sm">{bookingData.personalInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Cost</span>
                  <span className="font-medium">{bookingData.costBreakdown.totalCost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Extra hours</span>
                  <span className="text-blue-600 text-sm">{bookingData.costBreakdown.extraHoursBilling}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Discount -20%</span>
                  <span className="font-medium">{bookingData.costBreakdown.discount}</span>
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{bookingData.costBreakdown.finalTotal}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="text-blue-600 text-sm hover:underline transition-colors">
                  Learn more about our free cancellation
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Save Booking
                </button>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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