"use client";

import React, { useState } from "react";
import Button from "./Button";
import { X, AlertTriangle } from "lucide-react";

interface ActionModalProps {
  title: string;
  message: React.ReactNode;
  actionLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  variant?: "primary" | "danger";
  children?: React.ReactNode; // For adding custom content, like a <select>
}

/**
 * A generic modal for confirming an action.
 */
export function ActionModal({
  title,
  message,
  actionLabel,
  onClose,
  onConfirm,
  isLoading,
  variant = "primary",
  children,
}: ActionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
              variant === "danger" ? "bg-red-100" : "bg-indigo-100"
            }`}
          >
            <AlertTriangle
              className={`h-6 w-6 ${
                variant === "danger" ? "text-red-600" : "text-indigo-600"
              }`}
              aria-hidden="true"
            />
          </div>
          <div className="mt-0 flex-1">
            <h3
              className="text-xl font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>

        {/* Custom Content (e.g., a select dropdown) */}
        {children && <div className="mt-4">{children}</div>}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
