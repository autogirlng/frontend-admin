"use client";

import React from "react";
import { X, Layers } from "lucide-react";
import Button from "@/components/generic/ui/Button";

import {
  BLOG_CONTENT_TYPE,
  useApproveBlogContent,
} from "@/lib/hooks/blog/useBlog";

interface UpdateBlogStatusModalModalProps {
  onClose: () => void;
  id: string;
  contentType: BLOG_CONTENT_TYPE;
}

export function UpdateBlogStatusModal({
  onClose,
  id,
  contentType,
}: UpdateBlogStatusModalModalProps) {
  const { mutate, isPending: approvingContent } = useApproveBlogContent();

  const approve = () => {
    mutate({
      contentType,
      id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* --- Header (Fixed) --- */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600" />
              Approve Blog Post
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Approve blog post to view it content
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            // disabled={createMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- Footer (Fixed) --- */}
        <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex w-full sm:w-auto gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={approve}
              isLoading={approvingContent}
              className="flex-1 sm:flex-none shadow-md shadow-blue-500/20"
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
