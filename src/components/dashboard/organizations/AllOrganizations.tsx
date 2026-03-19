"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Organization } from "./types";
import TextInput from "@/components/generic/ui/TextInput";
import {
  Search,
  Download,
  View,
  ShoppingCart,
  FileText,
  CreditCard,
  Users,
  AlertCircle,
  Copy,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Button from "@/components/generic/ui/Button";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import CustomBack from "@/components/generic/CustomBack";
import CustomLoader from "@/components/generic/CustomLoader";
import { OrganizationDetailModal } from "./OrganizationDetailModal";
import { KycHistoryModal } from "./KycHistoryModal";
import { MembersModal } from "./MembersModal";
import { useGetOrganizations } from "@/lib/hooks/organizations/useOrganizations";

const PAGE_SIZE = 10;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getKycStatusClasses = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const handleCopyRcNumber = (rcNumber: string) => {
  navigator.clipboard.writeText(rcNumber);
  toast.success("RC number copied!");
};

export default function AllOrganizations() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [modal, setModal] = useState<
    "detail" | "kyc" | "members" | null
  >(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { data: orgData, isLoading } = useGetOrganizations(currentPage, PAGE_SIZE);
  const organizations = orgData?.content ?? [];
  const totalPages = orgData?.totalPages ?? 0;

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const filteredOrgs = useMemo(() => {
    if (!searchTerm.trim()) return organizations;
    const term = searchTerm.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(term) ||
        org.rcNumber.toLowerCase().includes(term) ||
        org.industry.toLowerCase().includes(term) ||
        org.creatorEmail.toLowerCase().includes(term)
    );
  }, [searchTerm, organizations]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const openModal = (
    type: "detail" | "kyc" | "members",
    org: Organization
  ) => {
    setSelectedOrg(org);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedOrg(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast.loading("Preparing export...", { id: "export-orgs" });
    try {
      // TODO: Replace with real XLSX export via API
      const { default: XLSX } = await import("xlsx");
      const exportData = filteredOrgs.map((org) => ({
        Name: org.name,
        "RC Number": org.rcNumber,
        Industry: org.industry,
        "KYC Status": org.kycStatus.replace(/_/g, " "),
        "Creator Email": org.creatorEmail,
        "Created At": formatDate(org.createdAt),
        Status: org.active ? "Active" : "Inactive",
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      ws["!cols"] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Organizations");
      const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      XLSX.writeFile(wb, `Organizations_${dateStr}.xlsx`);
      toast.success("Export Complete!", { id: "export-orgs" });
    } catch {
      toast.error("Export failed.", { id: "export-orgs" });
    } finally {
      setIsExporting(false);
    }
  };

  const getOrgActions = (org: Organization): ActionMenuItem[] => [
    {
      label: "Organization Details",
      icon: View,
      onClick: () => openModal("detail", org),
    },
    {
      label: "Booking Details",
      icon: ShoppingCart,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/bookings`
        ),
    },
    {
      label: "KYC History",
      icon: FileText,
      onClick: () => openModal("kyc", org),
    },
    {
      label: "Transactions",
      icon: CreditCard,
      onClick: () =>
        router.push(
          `/dashboard/organizations/${org.organizationId}/transactions`
        ),
    },
    {
      label: "Members",
      icon: Users,
      onClick: () => openModal("members", org),
    },
  ];

  const columns: ColumnDefinition<Organization>[] = [
    {
      header: "RC Number",
      accessorKey: "rcNumber",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-gray-700">
            {item.rcNumber || "N/A"}
          </span>
          {item.rcNumber && (
            <button
              onClick={() => handleCopyRcNumber(item.rcNumber)}
              className="text-gray-400 hover:text-[#0096FF] transition-colors p-1 rounded hover:bg-blue-50"
              title="Copy RC Number"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-gray-500">{item.creatorEmail}</div>
        </div>
      ),
    },
    { header: "Industry", accessorKey: "industry" },
    {
      header: "KYC Status",
      accessorKey: "kycStatus",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getKycStatusClasses(
            item.kycStatus
          )}`}
        >
          {item.kycStatus.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (item) => <span>{formatDate(item.createdAt)}</span>,
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "organizationId",
      cell: (item) => <ActionMenu actions={getOrgActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              All Organizations
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage all organizations on the platform.
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="primary"
            size="smd"
            disabled={isExporting || filteredOrgs.length === 0}
            className="w-full sm:w-auto min-w-35 whitespace-nowrap"
          >
            {isExporting ? (
              <span>Exporting...</span>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Export Organizations
              </>
            )}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Organizations"
            id="search-all-orgs"
            hideLabel
            type="text"
            placeholder="Search by name, RC number, industry, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <CustomLoader size="sm" showText={false} />
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-500">
            <AlertCircle className="h-8 w-8" />
            <p>No organizations found.</p>
          </div>
        ) : (
          <CustomTable
            data={filteredOrgs}
            columns={columns}
            getUniqueRowId={(item) => item.organizationId}
          />
        )}

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Modals */}
      {modal === "detail" && selectedOrg && (
        <OrganizationDetailModal
          organizationId={selectedOrg.organizationId}
          onClose={closeModal}
        />
      )}
      {modal === "kyc" && selectedOrg && (
        <KycHistoryModal
          organizationId={selectedOrg.organizationId}
          organizationName={selectedOrg.name}
          onClose={closeModal}
        />
      )}
      {modal === "members" && selectedOrg && (
        <MembersModal
          organizationId={selectedOrg.organizationId}
          organizationName={selectedOrg.name}
          onClose={closeModal}
        />
      )}
    </>
  );
}
