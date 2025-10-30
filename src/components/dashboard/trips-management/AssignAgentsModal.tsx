"use client";

import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import Select, { Option } from "@/components/generic/ui/Select";
import TextInput from "@/components/generic/ui/TextInput";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { useGetAdmins } from "@/lib/hooks/admin/useAdmins";
import { useAssignAgents } from "@/lib/hooks/trips-management/useTrips";
import { Trip, AdminUser } from "./types";

interface AssignAgentsModalProps {
  trip: Trip;
  onClose: () => void;
}

export function AssignAgentsModal({ trip, onClose }: AssignAgentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customerAgent, setCustomerAgent] = useState<Option | null>(null);
  const [operationsAgent, setOperationsAgent] = useState<Option | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: paginatedAdmins, isLoading: isSearching } =
    useGetAdmins(debouncedSearchTerm);
  const assignAgentsMutation = useAssignAgents();

  const adminOptions: Option[] = useMemo(() => {
    return (
      paginatedAdmins?.content.map((admin: AdminUser) => ({
        id: admin.id,
        name: `${admin.firstName} ${admin.lastName}`,
      })) || []
    );
  }, [paginatedAdmins]);

  // ✅ Pre-populate state with existing agents
  useEffect(() => {
    // Only run if admin options have loaded
    if (adminOptions.length > 0) {
      if (trip.customerAgentName) {
        const currentCustomerAgent = adminOptions.find(
          (opt) => opt.name === trip.customerAgentName
        );
        if (currentCustomerAgent) {
          setCustomerAgent(currentCustomerAgent);
        }
      }
      if (trip.operationsAgentName) {
        const currentOpsAgent = adminOptions.find(
          (opt) => opt.name === trip.operationsAgentName
        );
        if (currentOpsAgent) {
          setOperationsAgent(currentOpsAgent);
        }
      }
    }
    // Run this effect when the admin options load
  }, [adminOptions, trip.customerAgentName, trip.operationsAgentName]);

  const handleSubmit = () => {
    // ✅ Change validation: at least one must be selected
    if (!customerAgent && !operationsAgent) {
      toast.error("Please select at least one agent to assign.");
      return;
    }

    assignAgentsMutation.mutate(
      {
        tripId: trip.id,
        // ✅ Send the ID if selected, or null if not
        payload: {
          customerAgentId: customerAgent?.id || null,
          operationsAgentId: operationsAgent?.id || null,
        },
      },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <ActionModal
      title="Assign Agents"
      // ✅ Updated message
      message={`Assign agents to trip ${trip.bookingId}. You can assign one or both.`}
      actionLabel="Assign Agents"
      onClose={onClose}
      onConfirm={handleSubmit}
      isLoading={assignAgentsMutation.isPending}
      variant="primary"
    >
      <div className="space-y-4 mt-4">
        <TextInput
          label="Search Agents"
          id="agent-search"
          placeholder="Type to search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // ✅ Fixed typo
        />
        <Select
          label="Customer Agent"
          options={adminOptions}
          selected={customerAgent}
          onChange={setCustomerAgent}
          placeholder={isSearching ? "Searching..." : "Select customer agent"}
        />
        <Select
          label="Operations Agent"
          options={adminOptions}
          selected={operationsAgent}
          onChange={setOperationsAgent}
          placeholder={isSearching ? "Searching..." : "Select operations agent"}
        />
      </div>
    </ActionModal>
  );
}
