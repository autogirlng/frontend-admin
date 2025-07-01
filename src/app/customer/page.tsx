"use client";
import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/components/shared/icons";
import Button from "@/components/shared/button";
import { AddNewCustomerModal } from "@/components/bookings/modals/new-customer/AddNewCustomerModal";
import { Spinner } from "@/components/shared/spinner";
import { useHttp } from "@/utils/useHttp";
import Image from "next/image";
import { User, Customers } from "@/types";
import { ApiRoutes } from "@/utils/ApiRoutes";
import ActivityCard from "@/components/shared/activityCard";
import { CustomerDetailsModal } from "@/components/bookings/modals/CustomerDetailsModal";
import { MoreVertical } from "lucide-react";
import CustomerOnboardingDistribution from "@/components/customer/CustomerOnboardingDistribution";
import { useRouter } from "next/navigation";

// Add CustomerData type for metrics
interface CustomerData {
  totalCustomers: number;
  activeCustomers: number;
  recentActiveCustomers: number;
  customersWithCompletedBookings: number;
  totalCustomerSpending: number;
  selfOnboardedCustomers: number;
  adminOnboardedCustomers: number;
}

function CustomerStats({ metrics, isLoading }: { metrics: CustomerData | null; isLoading: boolean }) {
  return (
    <div className="flex gap-1.5 overflow-auto mb-6">
      <ActivityCard
        title="Total Customers"
        value={metrics ? `${metrics.totalCustomers}` : "-"}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Active Customers"
        value={metrics ? `${metrics.activeCustomers}` : "-"}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Recently Active"
        value={metrics ? `${metrics.recentActiveCustomers}` : "-"}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
      <ActivityCard
        title="Completed Bookings"
        value={metrics ? `${metrics.customersWithCompletedBookings}` : "-"}
        isLoading={isLoading}
        className="min-w-[180px] w-full"
      />
    </div>
  );
}

const CustomerPage = () => {
  const [selectedCustomerID, setSelectedCustomerID] = useState<string>("");
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [loadingCustomersData, setLoadingCustomerData] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddNewCustomerModalOpen, setIsAddNewCustomerModalOpen] = useState<boolean>(false);
  const http = useHttp();
  const baseURL = `/user/all?limit=10&page=1&userRole=CUSTOMER&search=${searchTerm}`;
  const [customerMetrics, setCustomerMetrics] = useState<CustomerData | null>(null);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any>(null);
  const actionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const router = useRouter();

  const closeAddNewCustomerModal = () => {
    setIsAddNewCustomerModalOpen(false);
    fetchCustomers(baseURL); // Refresh after adding
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const fetchCustomers = async (url: string) => {
    setLoadingCustomerData(true);
    try {
      const customers = await http.get<Customers>(url);
      if (customers) {
        setFilteredCustomers(customers.data);
      }
    } catch (err) {
      setFilteredCustomers([]);
    }
    setLoadingCustomerData(false);
  };

  // Fetch customer metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const dashboard = await http.get<any>(ApiRoutes.getDashboard);
        // Defensive: dashboard.customer may be undefined
        if (dashboard && dashboard.customer) {
          setCustomerMetrics(dashboard.customer);
        }
      } catch (err) {
        setCustomerMetrics(null);
      }
    };
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCustomers(baseURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openActionIndex !== null &&
        actionRefs.current[openActionIndex] &&
        !actionRefs.current[openActionIndex]?.contains(event.target as Node)
      ) {
        setOpenActionIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionIndex]);

  return (
    <DashboardLayout title="Customer" currentPage="Customer">
      <div className="space-y-5 2xl:space-y-[52px] py-8 2xl:py-11">
        <div className="flex justify-between items-center flex-col md:flex-row ">
          <DashboardSectionTitle icon={Icons.ic_activity} title="Customer Metrics" />
          <Button
            color="primary"
            className="flex gap-2 justify-center text-sm w-sm text-nowrap items-center"
            onClick={() => setIsAddNewCustomerModalOpen(true)}
          >
            {Icons.ic_add}
            Add New Customer
          </Button>
        </div>
        <CustomerStats metrics={customerMetrics} isLoading={customerMetrics === null} />
        <CustomerOnboardingDistribution
          selfOnboardedCustomers={customerMetrics?.selfOnboardedCustomers ?? 0}
          adminOnboardedCustomers={customerMetrics?.adminOnboardedCustomers ?? 0}
          isLoading={customerMetrics === null}
        />
        <div className="w-full bg-white">
          <div className="p-4">
            <h1 className="text-4xl font-bold mb-6">Customers</h1>
            <div className="flex justify-between mb-6 flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-3xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="h-5 w-5 text-gray-400 flex items-center">{Icons.ic_search}</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by customer, customer ID"
                  className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button
                color="primary"
                className="px-4 py-2 text-sm text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md transition-all duration-200 min-w-[150px] lg:w-auto"
                onClick={() => setIsAddNewCustomerModalOpen(true)}
              >
                + Add New Customer
              </Button>
            </div>
            <div className="flex justify-end mb-4">
              <a
                href="/customer/view-all"
                className="text-[#667185] hover:text-blue-700 text-sm font-semibold"
              >
                View All
              </a>
            </div>
            {loadingCustomersData ? (
              <div className="flex flex-row items-center justify-center mt-4 ">
                <Spinner />
              </div>
            ) : filteredCustomers.length !== 0 ? (
              <div className="overflow-x-auto rounded-t-lg border border-[#D0D5DD]">
                <table className="min-w-full divide-y divide-[#D0D5DD]">
                  <thead>
                    <tr className="bg-[#F7F9FC]">
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Customer ID</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">First Name</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Last Name</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Email</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Phone Number</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Date Added</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#D0D5DD]">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={`cursor-pointer ${customer.id === selectedCustomerID ? "bg-[#edf8ff]" : ""} hover:bg-[#edf8ff]`}
                        onClick={() => setSelectedCustomerID(customer.id)}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-[#344054]">{customer.id}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">{customer.firstName}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">{customer.lastName}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">{customer.email}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">{customer.phoneNumber}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">{customer.createdAt.split("T")[0]}</td>
                        <td className="px-4 py-4 text-sm text-[#344054]">
                          <div className="relative" ref={el => { actionRefs.current[index] = el; }}>
                            <button
                              className="text-gray-400 hover:text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-gray-100 rounded-full p-2"
                              onClick={() => setOpenActionIndex(openActionIndex === index ? null : index)}
                              aria-expanded={openActionIndex === index}
                              aria-controls={`action-dropdown-${index}`}>
                              <MoreVertical size={18} />
                            </button>
                            {openActionIndex === index && (
                              <div
                                id={`action-dropdown-${index}`}
                                className="absolute z-10 mt-2 w-40 bg-white rounded-lg shadow-lg border border-[#dbdfe5] overflow-hidden"
                                style={{ top: "calc(100% + 5px)", right: 0 }}
                              >
                                <div className="p-3">
                                  <div className="flex flex-col items-start">
                                    <span
                                      className="my-2 w-full cursor-pointer py-2 rounded hover:text-blue-600 text-sm text-start text-gray-700 transition-colors"
                                      onClick={() => {
                                        router.push(`/customer/${customer.id}`);
                                        setOpenActionIndex(null);
                                      }}
                                    >
                                      View Details
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {filteredCustomers.length === 0 && !loadingCustomersData && (
              <div className="flex text-center flex-col justify-center items-center py-8 text-gray-500 w-full">
                <Image src="/icons/empty_search.png" alt="Empty Search" width={200} height={200} />
                <h3 className="text-[#667185]">No Results for "{searchTerm}"</h3>
                <Button
                  color="primary"
                  className="px-4 mt-3 py-2 text-sm text-white bg-[#0673ff] text-center rounded-2xl hover:shadow-md transition-all duration-200 min-w-[150px] lg:w-auto"
                  onClick={() => setIsAddNewCustomerModalOpen(true)}
                >
                  + Add New Customer
                </Button>
              </div>
            )}
          </div>
        </div>
        <AddNewCustomerModal isOpen={isAddNewCustomerModalOpen} closeModal={closeAddNewCustomerModal} />
        <CustomerDetailsModal
          isOpen={isCustomerDetailsModalOpen}
          onClose={() => setIsCustomerDetailsModalOpen(false)}
          title="Customer Details"
          customer={selectedCustomerDetails || {
            name: "",
            phone: "",
            email: "",
            memberSince: "",
            bookingHistory: [],
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerPage; 