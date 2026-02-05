"use client";

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Plus, Edit, Trash2, Settings, Calendar } from "lucide-react";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionMenu } from "@/components/generic/ui/ActionMenu";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import clsx from "clsx";

import {
  useGetServicePricing,
  useDeleteServicePricing,
  useGetServicePricingYears,
  useDeleteServicePricingYear,
} from "./useSpecialSales";

import { ServicePricingModal } from "./ServicePricingModal";
import { YearRangeModal } from "./YearRangeModal";
import { ServicePricing, ServicePricingYear } from "./types";
import CustomBack from "@/components/generic/CustomBack";

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    p,
  );

export default function SpecialSaleBookingSetUp() {
  const [activeTab, setActiveTab] = useState<"pricing" | "years">("pricing");

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<ServicePricing | null>(
    null,
  );
  const [isDeletePricingOpen, setIsDeletePricingOpen] = useState(false);

  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [selectedYearRange, setSelectedYearRange] =
    useState<ServicePricingYear | null>(null);
  const [isDeleteYearOpen, setIsDeleteYearOpen] = useState(false);

  const { data: pricings = [], isLoading: loadingPricing } =
    useGetServicePricing();
  const { data: years = [], isLoading: loadingYears } =
    useGetServicePricingYears();
  const deletePricingMutation = useDeleteServicePricing();
  const deleteYearMutation = useDeleteServicePricingYear();

  const handleEditPricing = (item: ServicePricing) => {
    setSelectedPricing(item);
    setIsPricingModalOpen(true);
  };

  const handleDeletePricing = (item: ServicePricing) => {
    setSelectedPricing(item);
    setIsDeletePricingOpen(true);
  };

  const handleEditYear = (item: ServicePricingYear) => {
    setSelectedYearRange(item);
    setIsYearModalOpen(true);
  };

  const handleDeleteYear = (item: ServicePricingYear) => {
    setSelectedYearRange(item);
    setIsDeleteYearOpen(true);
  };

  const pricingColumns: ColumnDefinition<ServicePricing>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Type", accessorKey: "vehicleTypeName" },
    {
      header: "Ride Type",
      accessorKey: "rideType",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.rideType === "EXECUTIVE" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
        >
          {item.rideType}
        </span>
      ),
    },
    {
      header: "Fees",
      accessorKey: "outskirtFee",
      cell: (item) => (
        <div className="text-xs text-gray-600">
          <div>Outskirt: {formatPrice(item.outskirtFee)}</div>
          <div>Extreme: {formatPrice(item.extremeFee)}</div>
        </div>
      ),
    },
    {
      header: "Pricing Items",
      accessorKey: "pricingItems",
      cell: (item) => (
        <div className="flex flex-wrap gap-1 max-w-md">
          {item.pricingItems.map((pi, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-50 rounded text-xs border border-gray-100"
            >
              {pi.bookingTypeName || "Item"}:{" "}
              <span className="font-semibold">{formatPrice(pi.price)}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <ActionMenu
          actions={[
            {
              label: "Edit",
              icon: Edit,
              onClick: () => handleEditPricing(item),
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleDeletePricing(item),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  const yearColumns: ColumnDefinition<ServicePricingYear>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Config Name", accessorKey: "servicePricingName" },
    {
      header: "Year Range",
      accessorKey: "minYear",
      cell: (item) => (
        <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
          {item.minYear} - {item.maxYear}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => (
        <ActionMenu
          actions={[
            { label: "Edit", icon: Edit, onClick: () => handleEditYear(item) },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleDeleteYear(item),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-2 max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Special Sales Booking
            </h1>
            <p className="text-gray-500">
              Manage executive ride pricing and vehicle year requirements.
            </p>
          </div>
          <Button
            onClick={() =>
              activeTab === "pricing"
                ? setIsPricingModalOpen(true)
                : setIsYearModalOpen(true)
            }
            className="w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New {activeTab === "pricing" ? "Pricing" : "Year Range"}
          </Button>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pricing")}
              className={clsx(
                "pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                activeTab === "pricing"
                  ? "border-[#0096FF] text-[#0096FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              <Settings className="w-4 h-4" /> Pricing Configurations
            </button>
            <button
              onClick={() => setActiveTab("years")}
              className={clsx(
                "pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                activeTab === "years"
                  ? "border-[#0096FF] text-[#0096FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              <Calendar className="w-4 h-4" /> Year Ranges
            </button>
          </nav>
        </div>

        {activeTab === "pricing" ? (
          loadingPricing ? (
            <CustomLoader />
          ) : (
            <CustomTable
              data={pricings}
              columns={pricingColumns}
              getUniqueRowId={(i) => i.id}
            />
          )
        ) : loadingYears ? (
          <CustomLoader />
        ) : (
          <CustomTable
            data={years}
            columns={yearColumns}
            getUniqueRowId={(i) => i.id}
          />
        )}
      </main>

      {(isPricingModalOpen || selectedPricing) && (
        <ServicePricingModal
          initialData={selectedPricing}
          onClose={() => {
            setIsPricingModalOpen(false);
            setSelectedPricing(null);
          }}
        />
      )}

      {isDeletePricingOpen && selectedPricing && (
        <ActionModal
          title="Delete Pricing"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{selectedPricing.name}</strong>?
            </>
          }
          actionLabel="Delete"
          variant="danger"
          onClose={() => setIsDeletePricingOpen(false)}
          onConfirm={() =>
            deletePricingMutation.mutate(selectedPricing.id, {
              onSuccess: () => setIsDeletePricingOpen(false),
            })
          }
          isLoading={deletePricingMutation.isPending}
        />
      )}

      {(isYearModalOpen || selectedYearRange) && (
        <YearRangeModal
          initialData={selectedYearRange}
          onClose={() => {
            setIsYearModalOpen(false);
            setSelectedYearRange(null);
          }}
        />
      )}

      {isDeleteYearOpen && selectedYearRange && (
        <ActionModal
          title="Delete Year Range"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{selectedYearRange.name}</strong>?
            </>
          }
          actionLabel="Delete"
          variant="danger"
          onClose={() => setIsDeleteYearOpen(false)}
          onConfirm={() =>
            deleteYearMutation.mutate(selectedYearRange.id, {
              onSuccess: () => setIsDeleteYearOpen(false),
            })
          }
          isLoading={deleteYearMutation.isPending}
        />
      )}
    </>
  );
}
