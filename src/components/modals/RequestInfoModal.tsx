import React, { useState } from "react";
import Modal from "../shared/Modal";
import Button from "../shared/button";

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  customerEmail: string;
}

const REQUEST_OPTIONS = [
  "Additional Info 1",
  "Additional Info 2",
  "Additional Info 3",
  "Additional Info 4",
  "Additional Info 5",
];

const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  customerEmail,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOptions.length === 0) {
      alert("Please select at least one option");
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API call
      // await requestAdditionalInfo({ bookingId, requestedInfo: selectedOptions, customerEmail });
      console.log("Requesting additional info:", {
        bookingId,
        requestedInfo: selectedOptions,
        customerEmail,
      });

      // Close modal on success
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        // Reset form
        setSelectedOptions([]);
      }, 1000);
    } catch (error) {
      console.error("Error requesting additional info:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Additional Information"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-grey-600 text-base">
          This would send an email to the customer requesting what you select
          below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <fieldset>
              <legend className="sr-only">Information to request</legend>
              {REQUEST_OPTIONS.map((option) => (
                <label key={option} className="custom-checkbox block mb-3">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    aria-label={option}
                  />
                  <span className="text-grey-800">{option}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                setSelectedOptions([]);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button variant="filled" type="submit" isLoading={isSubmitting}>
              Request Information
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RequestInfoModal;
