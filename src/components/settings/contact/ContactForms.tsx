"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  useGetContactForms,
  useGetContactFormDetail,
  useDeleteContactForm,
  useMarkContactFormRead,
} from "./useContactForms";
import { useContactExport, ExportFormat } from "./useContactExport";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { ContactFormEntry } from "./types";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { ActionMenu, ActionMenuItem } from "@/components/generic/ui/ActionMenu";
import { ColumnDefinition, CustomTable } from "@/components/generic/ui/Table";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import CustomLoader from "@/components/generic/CustomLoader";
import CustomBack from "@/components/generic/CustomBack";
import { PaginationControls } from "@/components/generic/ui/PaginationControls";
import {
  AlertCircle,
  Eye,
  Trash2,
  Mail,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Search,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

function ExportDropdown({
  onExport,
  isExporting,
  disabled,
}: {
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="secondary"
        size="smd"
        className="w-full sm:w-auto min-w-35 whitespace-nowrap"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled || isExporting}
      >
        {isExporting ? (
          <span>Exporting...</span>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
            onClick={() => {
              setOpen(false);
              onExport("xlsx");
            }}
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            Export as Excel
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
            onClick={() => {
              setOpen(false);
              onExport("csv");
            }}
          >
            <FileText className="h-4 w-4 text-blue-600" />
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}

function ContactDetailModal({
  contactId,
  onClose,
}: {
  contactId: string;
  onClose: () => void;
}) {
  const { data: contact, isLoading } = useGetContactFormDetail(contactId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-10">
            <CustomLoader />
          </div>
        ) : !contact ? (
          <div className="p-10 text-center text-gray-500">
            Contact not found.
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="w-6 h-6 text-[#0096FF]" />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </p>
                <span
                  className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full ${
                    contact.isRead
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {contact.isRead ? "Read" : "Unread"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">
                  {contact.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">
                  {contact.phoneNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-gray-900">
                  {contact.location || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Submitted:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(contact.createdAt), "MMM dd, yyyy • h:mm a")}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Message
                </p>
              </div>
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactFormsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState<"view" | "delete" | null>(null);
  const [selectedContact, setSelectedContact] =
    useState<ContactFormEntry | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { mutate: deleteContact, isPending: isDeleting } =
    useDeleteContactForm();
  const { mutate: markAsRead } = useMarkContactFormRead();

  const { handleExport, isExporting } = useContactExport({
    search: debouncedSearch,
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const {
    data: paginatedData,
    isLoading,
    isError,
    isPlaceholderData,
  } = useGetContactForms(currentPage, 10, debouncedSearch);

  const contacts = paginatedData?.content ?? [];
  const totalPages = paginatedData?.totalPages ?? 0;

  const openModal = (
    type: "view" | "delete",
    contact: ContactFormEntry,
  ) => {
    setSelectedContact(contact);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedContact(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedContact) return;
    deleteContact(selectedContact.id, { onSuccess: closeModal });
  };

  const getActions = (contact: ContactFormEntry): ActionMenuItem[] => [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => openModal("view", contact),
    },
    ...(!contact.isRead
      ? [
          {
            label: "Mark as Read",
            icon: CheckCircle,
            onClick: () => markAsRead(contact.id),
          },
        ]
      : []),
    {
      label: "Delete",
      icon: Trash2,
      onClick: () => openModal("delete", contact),
      danger: true,
    },
  ];

  const columns: ColumnDefinition<ContactFormEntry>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (item) => (
        <div className="flex items-center gap-2">
          {!item.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          )}
          <span>
            {item.firstName} {item.lastName}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phoneNumber",
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (item) => item.location || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: (item) => (
        <span
          className="block max-w-50 truncate"
          title={item.message}
        >
          {item.message}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "isRead",
      cell: (item) => (
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            item.isRead
              ? "bg-gray-100 text-gray-600"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.isRead ? "Read" : "Unread"}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (item) => {
        try {
          return format(new Date(item.createdAt), "MMM dd, yyyy");
        } catch {
          return item.createdAt ?? "—";
        }
      },
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => <ActionMenu actions={getActions(item)} />,
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <CustomBack />
      <main className="py-3 max-w-8xl mx-auto">
        <div ref={topRef} />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Form Submissions
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              View and manage messages from the contact form.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <ExportDropdown
              onExport={handleExport}
              isExporting={isExporting}
              disabled={isLoading || !contacts.length}
            />
          </div>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            label="Search Contacts"
            id="search"
            hideLabel
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            style={{ paddingLeft: 35 }}
          />
        </div>

        {isLoading && !paginatedData && <CustomLoader />}

        {isError && (
          <div className="flex flex-col items-center gap-2 p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-8 w-8" />
            <span className="font-semibold">
              Failed to load contact submissions.
            </span>
          </div>
        )}

        {!isLoading && !isError && contacts.length === 0 && (
          <div className="flex justify-center p-10 text-gray-500">
            <p>No contact form submissions found.</p>
          </div>
        )}

        {!isError && (contacts.length > 0 || isLoading) && (
          <div
            className={`${
              isPlaceholderData ? "opacity-50" : ""
            } transition-opacity`}
          >
            <CustomTable
              data={contacts}
              columns={columns}
              getUniqueRowId={(item) => item.id}
            />
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      </main>

      {modal === "view" && selectedContact && (
        <ContactDetailModal
          contactId={selectedContact.id}
          onClose={closeModal}
        />
      )}

      {modal === "delete" && selectedContact && (
        <ActionModal
          title="Delete Submission"
          message={
            <>
              Are you sure you want to delete the submission from{" "}
              <strong className="text-gray-900">
                {selectedContact.firstName} {selectedContact.lastName}
              </strong>
              ? This action cannot be undone.
            </>
          }
          actionLabel="Yes, Delete"
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </>
  );
}
