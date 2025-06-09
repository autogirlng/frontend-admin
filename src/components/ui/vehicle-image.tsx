import React from 'react';

interface VehicleImageProps {
  id: string | number;
  className?: string;
}

/**
 * A component to display vehicle images with fallback handling
 */
export const VehicleImage: React.FC<VehicleImageProps> = ({ id, className = "" }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-grey-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-grey-400 text-xs">Car Image</span>
      </div>
    );
  }

  return (
    <div className={`bg-grey-200 rounded-lg flex items-center justify-center ${className}`}>
      <img 
        src={`/images/vehicles/${id}.png`} 
        alt={`Vehicle ${id}`} 
        onError={handleError}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};