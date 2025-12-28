import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
// Import the hook you provided
import { useUpdateHostUser } from "@/lib/hooks/host-management/useUpdateHostUser";

interface EditHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostData: any; // Replace 'any' with your actual Host type if available
}

export const EditHostModal = ({ isOpen, onClose, hostData }: EditHostModalProps) => {
  const { mutate: updateHost, isPending } = useUpdateHostUser();

  // Helper to split full name safely
  const splitName = (fullName: string) => {
    const parts = (fullName || "").trim().split(" ");
    const first = parts[0] || "";
    const last = parts.slice(1).join(" ") || "";
    return { first, last };
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    active: true,
  });

  // Populate form when modal opens or hostData changes
  useEffect(() => {
    if (isOpen && hostData) {
      const { first, last } = splitName(hostData.fullName);
      setFormData({
        firstName: first,
        lastName: last,
        email: hostData.email || "",
        phoneNumber: hostData.phoneNumber || "",
        active: hostData.active ?? true,
      });
    }
  }, [isOpen, hostData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateHost(
      {
        userId: hostData.id,
        payload: {
          id: hostData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          active: formData.active,
          // userType and departmentName are optional in your interface
          // userType: "HOST", 
        },
      },
      {
        onSuccess: () => {
          onClose(); // Close modal only on success
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Edit User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <TextInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />

          {/* Active Status Toggle */}
          <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <input
              type="checkbox"
              id="activeStatus"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="activeStatus" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              User is Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};