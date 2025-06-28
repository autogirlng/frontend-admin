"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/shared/spinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User } from "@/types";
import { useHttp } from "@/utils/useHttp";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const http = useHttp();
  const [customer, setCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get<{ data: User }>(`/user/admin/${id}`);
        setCustomer(res?.data ?? null);
      } catch (err: any) {
        setError("Failed to fetch customer details");
      }
      setLoading(false);
    }
    if (id) fetchCustomer();
  }, [id]);

  return (
    <DashboardLayout title="Customer Details" currentPage="Customer Details">
      <div className="max-w-2xl mx-auto py-10">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : customer ? (
          <div className="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-sm text-gray-900">{customer.firstName} {customer.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-sm text-gray-900">{customer.createdAt ? customer.createdAt.split("T")[0] : "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-sm text-gray-900">{customer.phoneNumber}</p>
              </div>
              {/* Add more fields as needed */}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">Customer not found.</div>
        )}
      </div>
    </DashboardLayout>
  );
} 