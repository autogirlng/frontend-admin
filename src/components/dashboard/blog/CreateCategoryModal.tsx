"use client";

import React, { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";
import TextInput from "@/components/generic/ui/TextInput";
import Button from "@/components/generic/ui/Button";
import CustomLoader from "@/components/generic/CustomLoader";
import { useGetMyProfile } from "@/lib/hooks/profile/useProfile";
import {
  useCreateBlogCategory,
  useUpdateBlogCategory,
} from "@/lib/hooks/blog/useBlog";
import { BlogCategory } from "@/components/dashboard/blog/types";

interface CreateCategoryModalProps {
  onClose: () => void;
  category?: BlogCategory | null;
}

export function CreateCategoryModal({
  onClose,
  category,
}: CreateCategoryModalProps) {
  const isEditing = !!category;
  const { data: myProfile, isPending } = useGetMyProfile();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { mutate: createCategory, isPending: creatingBlogCategory } =
    useCreateBlogCategory();
  const { mutate: updateCategory, isPending: updatingBlogCategory } =
    useUpdateBlogCategory(category?.id || "");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const authorName =
    category?.authorName ||
    `${myProfile?.firstName || ""} ${myProfile?.lastName || ""}`.trim();
  const authorEmail = category?.authorEmail || myProfile?.email || "";
  const authorPhoneNumber =
    category?.authorPhoneNumber || myProfile?.phoneNumber || "";

  const handleSubmit = () => {
    const payload = {
      name,
      description,
      authorName,
      authorEmail,
      authorPhoneNumber,
    };

    if (isEditing) {
      updateCategory(payload, { onSuccess: onClose });
      return;
    }

    createCategory(payload, { onSuccess: onClose });
  };

  if (isPending) {
    return <CustomLoader />;
  }

  const isSaving = creatingBlogCategory || updatingBlogCategory;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              {isEditing ? "Edit Post Category" : "New Post Category"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            disabled={isSaving}
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
                  value={authorName}
                  disabled={true}
                />
              </div>

              <div>
                <TextInput
                  label="Author Email"
                  id="email"
                  name="email"
                  value={authorEmail}
                  disabled={true}
                />
              </div>

              <div>
                <TextInput
                  type="tel"
                  name="authorPhoneNumber"
                  label="Author Phone Number"
                  id="authorPhoneNumber"
                  value={authorPhoneNumber}
                  disabled={true}
                />
              </div>
            </form>
          </div>
        </div>

        <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-none"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSaving}
              disabled={!name || !description}
              className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
            >
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
