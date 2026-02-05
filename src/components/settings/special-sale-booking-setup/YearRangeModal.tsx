"use client";

import React, { useState, useEffect } from "react";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import {
  useCreateServicePricingYear,
  useUpdateServicePricingYear,
  useGetServicePricing,
} from "./useSpecialSales";
import { ServicePricingYear, ServicePricingYearPayload } from "./types";

interface YearRangeModalProps {
  initialData?: ServicePricingYear | null;
  onClose: () => void;
}

export function YearRangeModal({ initialData, onClose }: YearRangeModalProps) {
  const [name, setName] = useState("");
  const [servicePricingId, setServicePricingId] = useState("");
  const [minYear, setMinYear] = useState<string>("2010");
  const [maxYear, setMaxYear] = useState<string>("2025");

  const createMutation = useCreateServicePricingYear();
  const updateMutation = useUpdateServicePricingYear();
  const { data: pricings = [] } = useGetServicePricing();

  const isEditMode = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setServicePricingId(initialData.servicePricingId);
      setMinYear(String(initialData.minYear));
      setMaxYear(String(initialData.maxYear));
    }
  }, [initialData]);

  const handleSubmit = () => {
    const payload: ServicePricingYearPayload = {
      name,
      servicePricingId,
      minYear: Number(minYear),
      maxYear: Number(maxYear),
    };

    if (isEditMode && initialData) {
      updateMutation.mutate(
        { id: initialData.id, payload },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  const pricingOptions: Option[] = pricings.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <ActionModal
      title={isEditMode ? "Edit Year Range" : "New Year Range"}
      message="Define which vehicle years apply to a specific pricing configuration."
      actionLabel={isEditMode ? "Update" : "Create"}
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={isPending}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        <TextInput
          id="range-name"
          label="Range Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Modern SUV Range"
        />

        <Select
          label="Service Pricing Config"
          options={pricingOptions}
          selected={pricingOptions.find((p) => p.id === servicePricingId)}
          onChange={(opt) => setServicePricingId(opt.id)}
          placeholder="Select Pricing Configuration"
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            id="min-year"
            label="Min Year"
            type="number"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
          />
          <TextInput
            id="max-year"
            label="Max Year"
            type="number"
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
          />
        </div>
      </div>
    </ActionModal>
  );
}
