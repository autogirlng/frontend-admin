"use client";

import React, { useState, useEffect } from "react";
import { ActionModal } from "@/components/generic/ui/ActionModal";
import TextInput from "@/components/generic/ui/TextInput";
import Select, { Option } from "@/components/generic/ui/Select";
import { X, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
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

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
  );

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message || "Cloudinary upload failed");
  }

  const data = await response.json();
  return data.secure_url;
}

export function YearRangeModal({ initialData, onClose }: YearRangeModalProps) {
  const [name, setName] = useState("");
  const [servicePricingId, setServicePricingId] = useState("");
  const [minYear, setMinYear] = useState<string>("2010");
  const [maxYear, setMaxYear] = useState<string>("2025");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const createMutation = useCreateServicePricingYear();
  const updateMutation = useUpdateServicePricingYear();
  const { data: pricings = [] } = useGetServicePricing();

  const isEditMode = !!initialData;
  const isPending =
    createMutation.isPending || updateMutation.isPending || isUploading;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setServicePricingId(initialData.servicePricingId);
      setMinYear(String(initialData.minYear));
      setMaxYear(String(initialData.maxYear));

      if (initialData.imageUrl) {
        setImageUrl(initialData.imageUrl);
      }
    } else {
      setName("");
      setServicePricingId("");
      setMinYear("2010");
      setMaxYear("2025");
      setImageUrl("");
      setImageFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max 5MB.");
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadToCloudinary(imageFile);
        } catch (error: any) {
          toast.error("Failed to upload image: " + error.message);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const payload: ServicePricingYearPayload = {
        name,
        servicePricingId,
        minYear: Number(minYear),
        maxYear: Number(maxYear),
        imageUrl: finalImageUrl || undefined,
      };

      if (isEditMode && initialData) {
        updateMutation.mutate(
          { id: initialData.id, payload },
          { onSuccess: onClose },
        );
      } else {
        createMutation.mutate(payload, { onSuccess: onClose });
      }
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const pricingOptions: Option[] = pricings.map((p) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <ActionModal
      title={isEditMode ? "Edit Year Range" : "New Year Range"}
      message="Define pricing configuration and upload a representative image."
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
          placeholder="e.g. Executive Sedan Year"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image (Optional)
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              {imageFile ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-200">
                  <FileText className="mx-auto h-12 w-12 text-[#0096FF]" />
                  <p className="text-sm text-gray-600 mt-2">{imageFile.name}</p>
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                  >
                    Remove File
                  </button>
                </div>
              ) : imageUrl ? (
                <div className="relative group animate-in fade-in zoom-in duration-200">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-contain rounded-lg border border-gray-200 shadow-sm mb-2"
                  />
                  <div className="flex justify-center gap-2 items-center">
                    <p className="text-xs text-gray-500">Current Image</p>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 mt-2">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#0096FF] hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, SVG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}
