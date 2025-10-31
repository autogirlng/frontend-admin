// app/dashboard/audit-trail/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";
import {
  AlertCircle,
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  History,
  Monitor,
  User,
  Globe,
} from "lucide-react";

// Types
import { AuditLog, PaginatedResponse, UserAgent } from "./types";

// Hooks
import { useGetAuditTrail } from "./useAuditTrail";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";

// Reusable Components
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import TextInput from "@/components/generic/ui/TextInput";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import Button from "@/components/generic/ui/Button";
import { AuditDetailModal } from "./AuditDetailModal";
import clsx from "clsx";

// --- Helper: Get icon based on action ---
const getActionIcon = (action: string) => {
  switch (action) {
    case "CREATE":
      return <PlusCircle className="h-5 w-5 text-green-500" />;
    case "UPDATE":
      return <Edit2 className="h-5 w-5 text-blue-500" />;
    case "DELETE":
      return <Trash2 className="h-5 w-5 text-red-500" />;
    default:
      return <History className="h-5 w-5 text-gray-500" />;
  }
};

// --- Helper: Parse User Agent ---
const parseUserAgent = (uaString: string): UserAgent | null => {
  try {
    return JSON.parse(uaString) as UserAgent;
  } catch (e) {
    return null;
  }
};

export default function AuditTrailPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- API Hooks ---
  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetAuditTrail(currentPage, debouncedSearchTerm);

  // --- Derived Data ---
  const logs = paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages || 0;

  // --- Render ---
  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-lg text-gray-600 mt-1">
            Track all changes and actions across the platform.
          </p>
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Audit Trail"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by module, action, entity name, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* --- Loading/Error/Empty States --- */}
        {isLoading && !paginatedData && <CustomLoader />}
        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">Failed to load audit trail.</span>
          </div>
        )}
        {!isLoading && !isError && logs.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No audit logs found.</p>
          </div>
        )}

        {/* --- Audit Trail List --- */}
        {!isError && (logs.length > 0 || isLoading) && (
          <div
            className={clsx("space-y-4", isPlaceholderData ? "opacity-50" : "")}
          >
            {logs.map((log) => {
              const userAgent = parseUserAgent(log.userAgent);
              const actorId = log.createdById || log.updatedById;
              return (
                <div
                  key={log.id}
                  className="bg-white border border-gray-200 shadow-sm rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    {/* Action */}
                    <div className="flex items-center gap-3">
                      {getActionIcon(log.action)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {log.action}:{" "}
                          <span className="font-medium">{log.entityName}</span>
                        </h3>
                        <p className="text-sm text-gray-500">
                          {log.description} (Module: {log.module})
                        </p>
                      </div>
                    </div>
                    {/* Date */}
                    <div className="text-sm text-gray-500 text-left sm:text-right">
                      {format(
                        new Date(log.createdAt),
                        "MMM d, yyyy 'at' h:mm:ss a"
                      )}
                    </div>
                  </div>

                  <hr className="my-3" />

                  {/* Context */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">Actor ID: </span>
                        <span className="font-medium text-gray-700">
                          {actorId || "System"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">IP Address: </span>
                        <span className="font-medium text-gray-700">
                          {log.ipAddress}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">User Agent: </span>
                        {userAgent ? (
                          <span className="font-medium text-gray-700">
                            {userAgent.Browser} on {userAgent.OS}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-700">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Button */}
                  {(log.oldValue || log.newValue) && (
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="secondary"
                        className="w-auto px-3 py-1.5 text-xs"
                        onClick={() => setSelectedLog(log)}
                      >
                        View Changes
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- Pagination --- */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {/* --- Modals --- */}
      {selectedLog && (
        <AuditDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </>
  );
}
