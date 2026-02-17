"use client";

import React, { useState } from "react";
import { X, Search, Check, AlertCircle, FileText, Layers } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCreateConsolidatedInvoice } from "../bookings-management/useConsolidatedInvoices";
import { useGetFinanceBookings } from "@/lib/hooks/finance/useFinanceBookings";
import { useDebounce } from "@/lib/hooks/set-up/company-bank-account/useDebounce";
import { Booking } from "../finance/bookings/types";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { formatPrice } from "@/lib/utils/price-format";
import { useGetMyProfile } from "@/lib/hooks/profile/useProfile";
import { useCreateBlogCategory } from "@/lib/hooks/blog/useBlog";

interface CreateConsolidatedModalProps {
  onClose: () => void;
}

export function CreateCategoryModal({ onClose }: CreateConsolidatedModalProps) {
  const { data: myProfile, isPending } = useGetMyProfile();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { mutate, isPending: creatingBlogCategory } = useCreateBlogCategory();

  const handleSubmit = () => {
    mutate({
      name,
      description,
      authorName: `${myProfile?.firstName} ${myProfile?.lastName}`,
      authorEmail: myProfile?.email || "",
      authorPhoneNumber: myProfile?.phoneNumber || "",
    });
  };

  if (isPending) {
    return <CustomLoader />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              New Post Category
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            // disabled={createMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
          <div className="p-4 space-y-2 flex-1">
            <form className="space-y-3">
              <div>
                <TextInput
                  label="Category Name"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <TextInput
                  label="Category Description"
                  id="description"
                  name="description"
                  placeholder="Short summary of the category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <TextInput
                  label="Author Name"
                  id="authorName"
                  name="authorName"
                  value={myProfile?.firstName + " " + myProfile?.lastName || ""}
                  disabled={true}
                />
              </div>

              <div>
                <TextInput
                  label="Author Email"
                  id="email"
                  name="email"
                  value={myProfile?.email || ""}
                  disabled={true}
                />
              </div>

              <div>
                <TextInput
                  type="tel"
                  name="authorPhoneNumber"
                  label="Author Phone Number"
                  id="authorPhoneNumber"
                  value={myProfile?.phoneNumber}
                  disabled={true}
                />
              </div>
            </form>
          </div>
        </div>

        {/* --- Footer (Fixed) --- */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-none"
              // disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={creatingBlogCategory}
              disabled={!name || !description}
              className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
