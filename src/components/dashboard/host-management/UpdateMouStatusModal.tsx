"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import { useUpdateMOUStatus } from "@/lib/hooks/host-management/useHostMou";
import { MOUData } from "./types";

interface UpdateMouStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  mou: MOUData;
}

export default function UpdateMouStatusModal({
  isOpen,
  onClose,
  mou,
}: UpdateMouStatusModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateMOUStatus();
  
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen && mou) {
      setStatus(mou.status === "APPROVED" || mou.status === "REJECTED" ? mou.status : "APPROVED");
      setReason(mou.reason || "");
    }
  }, [isOpen, mou]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(
      {
        mouId: mou.id,
        payload: {
          status,
          reason,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Update MOU Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "APPROVED" | "REJECTED")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              required
            >
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              rows={4}
              placeholder="Provide a reason for approval or rejection..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
