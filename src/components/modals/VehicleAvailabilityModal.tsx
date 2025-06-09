import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';

interface VehicleAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  vehicleInfo?: string;
}

// Sample vehicle availability data
const SAMPLE_VEHICLES = [
  { id: 'VEH-001', name: 'Toyota Camry 2021', availability: 'Available', color: 'White', seating: 5, pricePerDay: 'NGN 25,000' },
  { id: 'VEH-002', name: 'Honda Civic 2019', availability: 'Available', color: 'Black', seating: 5, pricePerDay: 'NGN 20,000' },
  { id: 'VEH-003', name: 'Mercedes-Benz C300', availability: 'Available', color: 'Silver', seating: 5, pricePerDay: 'NGN 45,000' },
  { id: 'VEH-004', name: 'BMW X5 2022', availability: 'Maintenance', color: 'Blue', seating: 7, pricePerDay: 'NGN 50,000' },
  { id: 'VEH-005', name: 'Lexus RX 350', availability: 'Reserved', color: 'Black', seating: 5, pricePerDay: 'NGN 40,000' },
];

const VehicleAvailabilityModal: React.FC<VehicleAvailabilityModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  vehicleInfo = 'Requested Vehicle'
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await assignVehicle({ bookingId, vehicleId: selectedVehicle });
      console.log('Assigning vehicle:', { bookingId, vehicleId: selectedVehicle });
      
      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setSelectedVehicle('');
      }, 1000);
    } catch (error) {
      console.error('Error assigning vehicle:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vehicle Availability" size="lg">
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Booking Information</h3>
          <p className="text-sm text-gray-600">Booking ID: <span className="font-medium">{bookingId}</span></p>
          <p className="text-sm text-gray-600">Requested Vehicle: <span className="font-medium">{vehicleInfo}</span></p>
        </div>
        
        <h3 className="font-medium text-lg">Available Vehicles</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {SAMPLE_VEHICLES.map((vehicle) => (
              <div 
                key={vehicle.id}
                className={`border ${selectedVehicle === vehicle.id ? 'border-primary-500 bg-primary-50' : 'border-grey-300'} 
                  rounded-lg p-4 cursor-pointer transition-colors ${vehicle.availability !== 'Available' ? 'opacity-60' : ''}`}
                onClick={() => vehicle.availability === 'Available' && setSelectedVehicle(vehicle.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{vehicle.name}</h4>
                    <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                      <span>Color: {vehicle.color}</span>
                      <span>• Seats: {vehicle.seating}</span>
                      <span>• {vehicle.pricePerDay}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      vehicle.availability === 'Available' ? 'bg-green-100 text-green-800' :
                      vehicle.availability === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.availability}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                onClose();
                setSelectedVehicle('');
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              isLoading={isSubmitting}
              disabled={!selectedVehicle}
            >
              Assign Vehicle
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default VehicleAvailabilityModal;