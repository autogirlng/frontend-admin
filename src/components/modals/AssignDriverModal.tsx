import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/button';
import { bookingService } from '../../services/bookingService';
import { toast } from 'react-toastify';

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: string;
}

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  vehicleInfo?: string;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  vehicleInfo
}) => {
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const response = await bookingService.getAvailableDrivers();
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to fetch available drivers');
      } finally {
        setLoadingDrivers(false);
      }
    };

    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    setIsLoading(true);
    try {
      await bookingService.assignDriver(bookingId, selectedDriver);
      toast.success('Driver assigned successfully');
      onClose();
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phone.includes(searchQuery)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Driver"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {vehicleInfo && (
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">
                Vehicle Information
              </label>
              <input
                type="text"
                value={vehicleInfo}
                disabled
                className="w-full px-4 py-2 border border-grey-200 rounded-lg bg-grey-50 text-grey-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">
              Search Drivers
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone number..."
              className="w-full px-4 py-2 border border-grey-200 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {loadingDrivers ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDriver === driver.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-grey-200 hover:border-primary-500 hover:bg-grey-50'
                    }`}
                    onClick={() => setSelectedDriver(driver.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-grey-900">{driver.name}</h3>
                        <p className="text-sm text-grey-500">{driver.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs px-2 py-1 rounded-full bg-success-50 text-success-600">
                          {driver.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDrivers.length === 0 && (
                  <div className="text-center py-4 text-grey-500">
                    No drivers found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!selectedDriver}
          >
            Assign Driver
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignDriverModal;