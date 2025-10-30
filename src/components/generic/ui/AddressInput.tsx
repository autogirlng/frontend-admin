"use client";
import React, { useState, useEffect, useRef } from "react";
import TextInput from "./TextInput";
import { MapPinIcon } from "lucide-react";

type AddressInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "onChange"
> & {
  label: string;
  id: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (coords: { latitude: number; longitude: number }) => void;
};

// Define the shape of a Google Place prediction
type Prediction = {
  description: string;
  place_id: string;
};

declare global {
  interface Window {
    google: any;
    initGooglePlaces?: () => void;
  }
}

const AddressInput = ({
  label,
  id,
  error,
  value,
  onChange,
  onLocationSelect,
  ...props
}: AddressInputProps) => {
  // Update state to hold Prediction objects, not just strings
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We wrap the init logic in a function
    const initializeServices = () => {
      // Add a guard to prevent re-initialization if services are already set
      if (!autocompleteService.current && window.google) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        // We need a dummy element to initialize PlacesService
        const dummyMap = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyMap
        );
      }
    };

    // If script is already loaded (e.g., by another component), just init
    if (window.google) {
      initializeServices();
      return;
    }

    // --- Fix for Race Condition ---
    // Check if the callback is already defined (by another instance)
    const originalCallback = window.initGooglePlaces;
    window.initGooglePlaces = () => {
      // If there was an old callback, call it
      if (originalCallback) {
        originalCallback();
      }
      // Call our own initializer
      initializeServices();
    };
    // -----------------------------

    // Check if the script is already on the page
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlaces`;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // This check is key: only run if the service is ready
    if (!autocompleteService.current || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        { input: value, componentRestrictions: { country: "ng" } },
        (predictions: any[], status: string) => {
          if (status !== "OK" || !predictions) {
            setSuggestions([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
          }
          // Store the full prediction object (description + place_id)
          setSuggestions(
            predictions.map((p) => ({
              description: p.description,
              place_id: p.place_id,
            }))
          );
          setIsOpen(true);
          setIsLoading(false);
        }
      );
    }, 400);

    return () => clearTimeout(handler);
  }, [value]); // This effect correctly depends only on 'value'

  // ✅ Handle outside clicks (Unchanged)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Get lat/lng using the reliable place_id
  const handleSelect = (prediction: Prediction) => {
    onChange(prediction.description); // Set input text to the full address
    setIsOpen(false);
    setSuggestions([]);

    if (!placesService.current) {
      console.error("Google Places service not initialized.");
      return;
    }

    // Use getDetails with place_id for accurate lat/lng
    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry.location"], // Only request the data we need
      },
      (place: any, status: string) => {
        if (
          status === "OK" &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          const { lat, lng } = place.geometry.location;
          // Pass coordinates up to the parent (Step1)
          onLocationSelect?.({ latitude: lat(), longitude: lng() });
        } else {
          console.error("Failed to get place details:", status);
        }
      }
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <TextInput
        label={label}
        id={id}
        error={error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white shadow-lg z-10 border border-gray-200">
          <ul
            role="listbox"
            className="max-h-48 py-1 text-base overflow-y-auto focus:outline-none sm:text-sm"
          >
            {isLoading && (
              <li className="px-4 py-2 text-gray-500">Searching...</li>
            )}
            {!isLoading && suggestions.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
            {!isLoading &&
              // Map over the new Prediction[] state
              suggestions.map((prediction) => (
                <li
                  key={prediction.place_id} // Use place_id for a stable key
                  onClick={() => handleSelect(prediction)} // Pass the whole object
                  className="text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-4 hover:bg-indigo-50 flex items-start"
                >
                  <MapPinIcon className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0 mt-0.5" />
                  {/* Render the description */}
                  <span>{prediction.description}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
