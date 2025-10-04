"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FullPageSpinner } from "@/components/shared/spinner";
import EmptyState from "@/components/EmptyState";
import { ImageAssets } from "@/utils/ImageAssets";
import DashboardSectionTitle from "@/components/shared/DashboardSectionTItle";
import Icons from "@/utils/Icon";
import { useHttp } from "@/utils/useHttp";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  driverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function DriverDetailsPage() {
  const params = useParams();
  const driverId = params.id as string;
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const http = useHttp();

  useEffect(() => {
    async function fetchDriver() {
      setLoading(true);
      setError(false);
      try {
        const data = await http.get<Driver>(`/drivers/findOne/${driverId}`);
        setDriver(data ?? null);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (driverId) fetchDriver();
  }, [driverId]);

  if (loading) return <FullPageSpinner />;

  if (error || !driver) {
    return (
      <DashboardLayout title="Driver" currentPage="Drivers">
        <div className="flex justify-center items-center h-full">
          <EmptyState
            image={ImageAssets.icons.errorState}
            title="Error Occurred"
            message="Error occurred while fetching Driver"
            buttonText="Go Back"
            buttonAction={() => window.history.back()}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Driver" currentPage="Drivers">
      <div className="space-y-10 2xl:space-y-[52px] py-8 2xl:py-11 ">
        <DashboardSectionTitle icon={Icons.ic_host} title="Driver Details" />
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-primary-50 flex items-center justify-center">
            {driver.driverImage ? (
              <img src={driver.driverImage} alt="Driver" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl text-primary-500 font-bold">
                {driver.firstName[0]}{driver.lastName[0]}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-2xl font-semibold text-gray-900">
              {driver.firstName} {driver.lastName}
            </div>
            <div className="text-gray-600 text-sm">Driver ID: {driver.id}</div>
            <div className="text-gray-700 text-base">Phone: {driver.phoneNumber}</div>
            <div className="text-gray-700 text-base">Email: {driver.email}</div>
            <div className="text-gray-500 text-sm">Joined: {new Date(driver.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 