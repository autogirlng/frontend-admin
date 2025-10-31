// app/dashboard/audit-trail/AuditDetailModal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { AuditLog } from "./types";
import Button from "@/components/generic/ui/Button";

interface AuditDetailModalProps {
  log: AuditLog;
  onClose: () => void;
}

// Helper to parse and format JSON strings
const JsonBlock = ({
  title,
  jsonString,
}: {
  title: string;
  jsonString: string | null;
}) => {
  if (!jsonString) {
    return null;
  }

  let parsedJson: object;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (e) {
    return (
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
        <pre className="p-4 bg-red-50 text-red-700 rounded-lg">
          Error parsing JSON: {jsonString}
        </pre>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <pre className="p-4 bg-gray-900 text-green-300 rounded-lg text-xs overflow-auto max-h-64">
        {JSON.stringify(parsedJson, null, 2)}
      </pre>
    </div>
  );
};

export function AuditDetailModal({ log, onClose }: AuditDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Audit Log Details
            </h3>
            <p className="text-sm text-gray-500">ID: {log.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
          {/* Show old value for CREATE or UPDATE */}
          {(log.action === "CREATE" || log.action === "UPDATE") && (
            <JsonBlock title="Old State" jsonString={log.oldValue} />
          )}
          {/* Show new value for UPDATE */}
          {log.action === "UPDATE" && (
            <JsonBlock title="New State" jsonString={log.newValue} />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
