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
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // ✅ NEW: State to track if an item was selected
  const [hasSelected, setHasSelected] = useState(false);

  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeServices = () => {
      if (!autocompleteService.current && window.google) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        const dummyMap = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyMap
        );
      }
    };

    if (window.google) {
      initializeServices();
      return;
    }

    const originalCallback = window.initGooglePlaces;
    window.initGooglePlaces = () => {
      if (originalCallback) {
        originalCallback();
      }
      initializeServices();
    };

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
    // ✅ FIX: Add 'hasSelected' to the condition
    // Don't fetch if a selection was just made
    if (!autocompleteService.current || value.length < 3 || hasSelected) {
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
  }, [value, hasSelected]); // ✅ Add 'hasSelected' to dependency array

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

  const handleSelect = (prediction: Prediction) => {
    onChange(prediction.description); // Set input text
    setIsOpen(false);
    setSuggestions([]);
    setHasSelected(true); // ✅ Set the flag to true

    if (!placesService.current) {
      console.error("Google Places service not initialized.");
      return;
    }

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["geometry.location"],
      },
      (place: any, status: string) => {
        if (
          status === "OK" &&
          place &&
          place.geometry &&
          place.geometry.location
        ) {
          const { lat, lng } = place.geometry.location;
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
        // ✅ FIX: When the user types, reset the flag
        onChange={(e) => {
          onChange(e.target.value);
          setHasSelected(false);
        }}
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
              suggestions.map((prediction) => (
                <li
                  key={prediction.place_id}
                  onClick={() => handleSelect(prediction)}
                  className="text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-4 hover:bg-indigo-50 flex items-start"
                >
                  <MapPinIcon className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0 mt-0.5" />
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
