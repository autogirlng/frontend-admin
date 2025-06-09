"use client";

import React, { useState } from "react";
import { Search, ArrowLeft, Plus, X, User, ChevronDown } from "lucide-react";
import DottedLines from "@/components/shared/DottedLines";
import EmptyState from "@/components/EmptyState";
import { getCountryCallingCode } from "react-phone-number-input";

interface Customer {
  customerId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  location: string;
  hostName: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Omit<Customer, "customerId">) => void;
}

interface SelectCustomerComponentProps {
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomer?: Customer | null;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "NG", // Default to Nigeria
    countryCode: "+234",
    host: "",
    address: "",
  });
  const [isHostDropdownOpen, setIsHostDropdownOpen] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    host: false,
    address: false,
  });

  const hosts = [
    "Olivia Adeyemi",
    "Ethan Okonkwo",
    "Sophia Balogun",
    "Liam Olatunji",
    "Emma Chukwu",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawNumber = e.target.value.replace(/\D/g, "");

    // Auto-remove leading 0 if present and limit to 10 digits
    let formattedNumber = rawNumber;
    if (rawNumber.startsWith("0") && rawNumber.length === 11) {
      formattedNumber = rawNumber.substring(1);
    } else {
      formattedNumber = rawNumber.slice(0, 10);
    }

    setTouchedFields((prev) => ({
      ...prev,
      phoneNumber: true,
    }));
    setFormData((prev) => ({
      ...prev,
      phoneNumber: formattedNumber,
    }));
  };

  const handleCountryChange = (value: string) => {
    const countryCode = `+${getCountryCallingCode(value as any)}`;
    setFormData((prev) => ({
      ...prev,
      country: value,
      countryCode,
      phoneNumber: "", // Clear phone number when country changes
    }));
  };

  const handleHostSelect = (host: string) => {
    setFormData((prev) => ({
      ...prev,
      host,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      host: true,
    }));
    setIsHostDropdownOpen(false);
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const getPhoneNumberPlaceholder = () => {
    return "Enter 10-digit phone number";
  };

  const getPhoneNumberHelper = (phoneNumber: string) => {
    if (phoneNumber.length === 0) {
      return "Enter your 10-digit phone number";
    }
    if (phoneNumber.length < 10) {
      return `${10 - phoneNumber.length} more digits needed`;
    }
    if (phoneNumber.length === 10) {
      return "Perfect! Your number is ready";
    }
    return "";
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const newCustomer = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
      location: "Lagos", // Default location
      hostName: formData.host,
      address: formData.address,
    };

    onAddCustomer(newCustomer);
    onClose();
    resetForm();
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      country: "NG",
      countryCode: "+234",
      host: "",
      address: "",
    });
    setTouchedFields({
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      host: false,
      address: false,
    });
  };

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phoneNumber.length === 10 &&
    formData.host &&
    formData.address;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Customer
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Add Image
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  required
                />
                {touchedFields.firstName && !formData.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    First name is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  required
                />
                {touchedFields.lastName && !formData.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    Last name is required
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <select
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  onBlur={() => handleBlur("phoneNumber")}
                  className="w-[130px] px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="NG">+234 (NG)</option>
                  <option value="US">+1 (US)</option>
                  <option value="GB">+44 (UK)</option>
                  <option value="GH">+233 (GH)</option>
                  <option value="KE">+254 (KE)</option>
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onBlur={() => handleBlur("phoneNumber")}
                  placeholder={getPhoneNumberPlaceholder()}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  required
                />
              </div>
              {touchedFields.phoneNumber && (
                <p
                  className={`text-xs mt-1 ${
                    formData.phoneNumber.length === 10
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {getPhoneNumberHelper(formData.phoneNumber)}
                </p>
              )}
              {touchedFields.phoneNumber &&
                formData.phoneNumber.length > 0 &&
                formData.phoneNumber.length < 10 && (
                  <p className="text-xs text-red-500 mt-1">
                    Phone number must be 10 digits
                  </p>
                )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                placeholder="Enter email address"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                required
              />
              {touchedFields.email && !formData.email && (
                <p className="text-xs text-red-500 mt-1">Email is required</p>
              )}
              {touchedFields.email &&
                formData.email &&
                !/^\S+@\S+\.\S+$/.test(formData.email) && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid email
                  </p>
                )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur("address")}
                placeholder="Enter customer's address"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                required
              />
              {touchedFields.address && !formData.address && (
                <p className="text-xs text-red-500 mt-1">Address is required</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex-1 px-4 py-2.5 rounded-full font-medium text-sm transition-colors ${
                isFormValid
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add New Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SelectCustomerComponent: React.FC<SelectCustomerComponentProps> = ({
  onCustomerSelect,
  selectedCustomer: propSelectedCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([
    {
      customerId: "12345678",
      customerName: "Olivia Adeyemi",
      email: "alexander.adeyemi@gmail.com",
      phoneNumber: "+234 802 345 6789",
      location: "Lagos",
      hostName: "Olivia Adeyemi",
    },
    {
      customerId: "12345679",
      customerName: "Ethan Okonkwo",
      email: "benjamin.balogun@email.com",
      phoneNumber: "+234 813 456 7890",
      location: "Abuja",
      hostName: "Ethan Okonkwo",
    },
    {
      customerId: "12345680",
      customerName: "Sophia Balogun",
      email: "charlotte.chukwuma@email.com",
      phoneNumber: "+234 814 567 8901",
      location: "Enugu",
      hostName: "Sophia Balogun",
    },
    {
      customerId: "12345681",
      customerName: "Liam Olatunji",
      email: "daniel.daramola@email.com",
      phoneNumber: "+234 815 678 9012",
      location: "Ibadan",
      hostName: "Liam Olatunji",
    },
    {
      customerId: "12345682",
      customerName: "Emma Chukwu",
      email: "edward.eze@email.com",
      phoneNumber: "+234 816 789 0123",
      location: "Awka",
      hostName: "Emma Chukwu",
    },
    {
      customerId: "12345683",
      customerName: "Noah Ogunleye",
      email: "fiona.fadeyi@email.com",
      phoneNumber: "+234 817 890 1234",
      location: "Abeokuta",
      hostName: "Noah Ogunleye",
    },
    {
      customerId: "12345684",
      customerName: "Ava Adebayo",
      email: "george.gbadamosi@email.com",
      phoneNumber: "+234 818 901 2345",
      location: "Ilorin",
      hostName: "Ava Adebayo",
    },
    {
      customerId: "12345685",
      customerName: "Mason Eze",
      email: "hannah.hassan@email.com",
      phoneNumber: "+234 819 012 3456",
      location: "Kaduna",
      hostName: "Mason Eze",
    },
    {
      customerId: "12345686",
      customerName: "Isabella Abiodun",
      email: "isaac.iroko@email.com",
      phoneNumber: "+234 810 123 4567",
      location: "Jos",
      hostName: "Isabella Abiodun",
    },
  ]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerSelection = (customerKey: string) => {
    setSelectedCustomer((prev) => (prev === customerKey ? null : customerKey));
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleAddNewCustomer = () => {
    setIsModalOpen(true);
  };

  const handleAddCustomer = (newCustomerData: Omit<Customer, "customerId">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      customerId: `1234${customers.length + 5687}`, // Generate a simple ID
    };

    setCustomers((prev) => [...prev, newCustomer]);
    console.log("New customer added:", newCustomer);
  };

  const handleSaveDraft = () => {
    console.log("Save draft clicked");
  };

  const handleNext = () => {
    if (selectedCustomer) {
      const customerIndex = selectedCustomer.split("-")[1];
      const customer = filteredCustomers[parseInt(customerIndex)];
      onCustomerSelect(customer);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title and Search */}
          <div className="py-6 border-none border-[#F7F9FC]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Select Customer
              </h1>
              <button
                onClick={handleAddNewCustomer}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Customer
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98A2B3] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by host name, host ID and business name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="mb-4 text-sm text-gray-600">
              {filteredCustomers.length} Customers Found
            </div>
          )}

          {/* Table Container */}
          {filteredCustomers.length > 0 ? (
            <div className="flex-1 overflow-hidden flex flex-col border-none">
              {/* Table Header (fixed) */}
              <div className="bg-[#F7F9FC] border-b border-[#ccc]">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Customer ID
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Customer Name
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Phone Number
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Location
                      </th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                        Host Name
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Scrollable Table Body */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-[#ccc]">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={`${customer.customerId}-${index}`}
                        className={`hover:bg-[#ccc] cursor-pointer transition-colors ${
                          selectedCustomer === `${customer.customerId}-${index}`
                            ? "bg-primary-50"
                            : ""
                        }`}
                        onClick={() =>
                          handleCustomerSelection(
                            `${customer.customerId}-${index}`
                          )
                        }
                      >
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {customer.customerId}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                          {customer.customerName}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {customer.email}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {customer.phoneNumber}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {customer.location}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {customer.hostName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No Customers Found"
              image="/images/not-found.png"
            />
          )}
        </div>

        <DottedLines />
        {/* Fixed Footer */}
        <div className="mt-6 py-4 border-none border-[#ccc] sticky bottom-0">
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 rounded-full text-[#333] hover:bg-gray-50 transition-colors font-medium"
            >
              Save Draft
            </button>
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-full font-medium ${
                selectedCustomer
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-secondary-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!selectedCustomer}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  );
};

export default SelectCustomerComponent;
