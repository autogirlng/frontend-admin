"use client";

import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { format } from "date-fns";
import {
  useGetDriverApplicationDetails,
  useUpdateDriverApplicationStatus,
} from "./useDriverApplications";

interface ApplicationDetailModalProps {
  applicationId: string;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  applicationId,
  onClose,
}) => {
  const { data: app, isLoading } =
    useGetDriverApplicationDetails(applicationId);
  const { mutate: updateStatus, isPending } =
    useUpdateDriverApplicationStatus();

  const handleStatusChange = (
    newStatus: "APPROVED" | "REJECTED" | "REVIEWED",
  ) => {
    updateStatus({ applicationId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-lg">
          <CustomLoader />
        </div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full sm:max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Application Details
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-semibold">
              ID: {app.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="flex justify-center">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                app.status === "APPROVED"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : app.status === "REJECTED"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : app.status === "REVIEWED"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
              }`}
            >
              {app.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Full Name
                </p>
                <p className="text-gray-900 font-medium">{app.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Email Address
                </p>
                <p className="text-gray-900">{app.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Phone Numbers
                </p>
                <p className="text-gray-900">{app.primaryPhoneNumber}</p>
                {app.alternativePhoneNumber && (
                  <p className="text-gray-500 text-sm">
                    {app.alternativePhoneNumber} (Alt)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Experience
                </p>
                <p className="text-gray-900 font-medium">
                  {app.yearsOfExperience} Years
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Applied On
                </p>
                <p className="text-gray-900">
                  {format(new Date(app.createdAt), "MMM d, yyyy • h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
          <p className="text-xs text-gray-500 font-medium text-center mb-1">
            Update Application Status
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="secondary"
              onClick={() => handleStatusChange("REVIEWED")}
              disabled={
                isPending ||
                app.status === "REVIEWED" ||
                app.status === "APPROVED" ||
                app.status === "REJECTED"
              }
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" /> Reviewed
            </Button>

            <Button
              variant="danger"
              onClick={() => handleStatusChange("REJECTED")}
              disabled={isPending || app.status === "REJECTED"}
              className="text-xs"
            >
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>

            <Button
              variant="primary"
              onClick={() => handleStatusChange("APPROVED")}
              disabled={isPending || app.status === "APPROVED"}
              className="text-xs"
            >
              <CheckCircle className="w-3 h-3 mr-1" /> Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
