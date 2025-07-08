"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useHttp } from "@/utils/useHttp";
import { Spinner } from "@/components/shared/spinner";
import { CustomerDetailsModal } from "@/components/bookings/modals/CustomerDetailsModal";
import { User, Customers } from "@/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRouter } from "next/navigation";

type CustomerWithStatus = User & { isActive?: boolean | null };

const CustomerViewAllTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Customers | null>(null);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<any>(null);
  const actionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openActionIndex, setOpenActionIndex] = useState<number | null>(null);
  const http = useHttp();
  const router = useRouter();

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await http.get<Customers>(`/user/all?limit=10&page=${page}&userRole=CUSTOMER&search=${searchTerm}`);
      if (res) setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, page]);

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

  const customers: CustomerWithStatus[] = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const limit = data?.limit || 10;
  const maxPage = Math.max(1, Math.ceil(totalCount / limit));

  function renderCustomerRow(customer: CustomerWithStatus, index: number): React.ReactNode {
    let statusBadge: React.ReactNode = <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning-75 text-warning-700">Unknown</span>;
    if (typeof customer.isActive === 'boolean') {
      statusBadge = customer.isActive
        ? <span className="px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-600">Active</span>
        : <span className="px-3 py-1 rounded-full text-xs font-medium bg-grey-200 text-grey-700">Inactive</span>;
    }
    return (
      <tr key={customer.id} className={`border-b border-[#D0D5DD] hover:bg-gray-50 ${index === customers.length - 1 ? "border-b-0" : ""}`}>
        <td className="px-4 py-4 text-sm font-medium text-[#344054]">{customer.id}</td>
        <td className="px-4 py-4 text-sm text-[#344054]">{customer.firstName}</td>
        <td className="px-4 py-4 text-sm text-[#344054]">{customer.lastName}</td>
        <td className="px-4 py-4 text-sm text-[#344054]">{customer.email}</td>
        <td className="px-4 py-4 text-sm text-[#344054]">{customer.phoneNumber}</td>
        <td className="px-4 py-4 text-sm">{statusBadge}</td>
        <td className="px-4 py-4 text-sm text-[#344054]">{customer.createdAt ? customer.createdAt.split("T")[0] : '-'}</td>
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
    );
  }

  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  return (
    <DashboardLayout title="All Customers" currentPage="Customer View All">
      <div className="w-full bg-white">
        <div className="p-4">
          <h1 className="text-4xl font-bold mb-6">Customers</h1>
          <div className="flex justify-between mb-6 flex-wrap">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by customer, customer ID"
                className="pl-10 pr-4 py-2 w-full rounded-md border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-[#D0D5DD]" style={{ height: "60px" }}>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500"><Spinner /></td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-red-600">{error}</td>
                  </tr>
                ) : customers.length > 0 ? (
                  customers.map(renderCustomerRow)
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No customers found for the current search/filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="flex items-center px-4 py-2 border rounded text-sm text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <span className="mr-2"><ChevronLeft size={16} /></span> Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {maxPage}</span>
            <button
              className="flex items-center px-4 py-2 border rounded text-sm text-gray-700 disabled:opacity-50"
              onClick={() => setPage((p) => (page < maxPage ? p + 1 : p))}
              disabled={page >= maxPage}
            >
              Next <span className="ml-2"><ChevronRight size={16} /></span>
            </button>
          </div>
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
      </div>
    </DashboardLayout>
  );
};

export default CustomerViewAllTable; 