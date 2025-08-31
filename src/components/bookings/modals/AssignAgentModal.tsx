import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import { ModalHeader } from "./ModalHeader";
import { UserPlus } from "lucide-react";
import { useHttp } from "@/utils/useHttp";
import { toast } from "react-toastify";

interface AssignAgentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tripId: string;
}

export const AssignAgentModal: React.FC<AssignAgentModalProps> = ({ isOpen, setIsOpen, tripId }) => {
  const http = useHttp();
  const [csAgents, setCsAgents] = useState<any[]>([]);
  const [opsAgents, setOpsAgents] = useState<any[]>([]);
  const [selectedCs, setSelectedCs] = useState<any>(null);
  const [selectedOps, setSelectedOps] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        http.get(`/admin/find-admins?role=CUSTOMER_SUPPORT&limit=100`),
        http.get(`/admin/find-admins?role=OPERATION_MANAGER&limit=100`)
      ])
        .then(([csRes, opsRes]: any[]) => {
          setCsAgents(csRes?.data || []);
          setOpsAgents(opsRes?.data || []);
        })
        .catch(() => {
          setCsAgents([]);
          setOpsAgents([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleAssign = async () => {
    setAssigning(true);
    setError(null);
    try {
      await http.put(`/admin/trips/assign-agents/${tripId}`, {
        csAgentId: selectedCs?.id || null,
        opsAgentId: selectedOps?.id || null,
      });
      setIsOpen(false);
      toast.success("Agents assigned successfully!");
    } catch (e: any) {
      setError(e?.message || "Failed to assign agents");
    }
    setAssigning(false);
  };

  const closeModal = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <ModalLayout>
      <ModalHeader
        LucideIcon={UserPlus}
        iconColor="#2563eb"
        iconBackgroundColor="#e0e7ff"
        headerText="Assign Agent"
        modalContent="Assign a CS or Ops agent to this trip."
      />

      <div className="p-4">
        <label className="block mb-2 text-sm font-medium">CS Agent</label>
        <select
          className="w-full mb-4 p-2 border rounded-xl"
          value={selectedCs?.id || ""}
          onChange={e => setSelectedCs(csAgents.find(a => a.id === e.target.value))}
          disabled={loading}
        >
          <option value="">Select CS Agent</option>
          {csAgents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.firstName} {agent.lastName} ({agent.email})</option>
          ))}
        </select>

        <label className="block mb-2 text-sm font-medium">Ops Agent</label>
        <select
          className="w-full mb-4 p-2 border rounded-xl"
          value={selectedOps?.id || ""}
          onChange={e => setSelectedOps(opsAgents.find(a => a.id === e.target.value))}
          disabled={loading}
        >
          <option value="">Select Ops Agent</option>
          {opsAgents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.firstName} {agent.lastName} ({agent.email})</option>
          ))}
        </select>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {loading && <div className="text-gray-500 text-sm mb-2">Loading agents...</div>}
        <div className="flex gap-3">
          <button
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-colors border-[#ccc] border"
            onClick={closeModal}
            type="button"
            disabled={assigning}
          >
            Cancel
          </button>
          <button
            className="w-full bg-[blue] text-white py-2 rounded-xl hover:bg-blue-700 transition-colors"
            onClick={handleAssign}
            disabled={assigning || (!selectedCs && !selectedOps)}
          >
            {assigning ? "Assigning..." : "Assign Agent"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default AssignAgentModal;
