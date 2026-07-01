"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/generic/ui/Button";
import TextInput from "@/components/generic/ui/TextInput";
import { useCreateRoute, useUpdateRoute } from "@/lib/hooks/settings/useRoutePermissions";
import { RoutePermission, RoutePermissionPayload } from "./types";

interface RouteFormModalProps {
  onClose: () => void;
  initialData: RoutePermission | null;
}

export default function RouteFormModal({
  onClose,
  initialData,
}: RouteFormModalProps) {
  const isEditing = !!initialData;

  const [routePath, setRoutePath] = useState(initialData?.routePath ?? "");
  const [routeName, setRouteName] = useState(initialData?.routeName ?? "");
  const [iconName, setIconName] = useState(initialData?.iconName ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [isActive, setIsActive] = useState(
    initialData ? (initialData.isActive ?? initialData.active ?? true) : true,
  );
  const [requiresAnyPermission, setRequiresAnyPermission] = useState(
    initialData?.requiresAnyPermission ?? false,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const isPending = createRoute.isPending || updateRoute.isPending;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!routePath.trim()) newErrors.routePath = "Route path is required.";
    else if (!routePath.startsWith("/"))
      newErrors.routePath = "Path must start with /.";
    if (!routeName.trim()) newErrors.routeName = "Route name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: RoutePermissionPayload = {
      routePath: routePath.trim(),
      routeName: routeName.trim(),
      iconName: iconName.trim() || undefined,
      description: description.trim() || undefined,
      isActive,
      requiresAnyPermission,
    };

    if (isEditing) {
      updateRoute.mutate(
        { id: initialData.id, payload },
        { onSuccess: onClose },
      );
    } else {
      createRoute.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Route" : "Add New Route"}
          </h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <TextInput
            id="routePath"
            label="Route Path"
            placeholder="/dashboard/finance"
            value={routePath}
            onChange={(e) => setRoutePath(e.target.value)}
            error={errors.routePath}
          />

          <TextInput
            id="routeName"
            label="Route Name"
            placeholder="Finance"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            error={errors.routeName}
          />

          <TextInput
            id="iconName"
            label="Icon Name"
            placeholder="CirclePoundSterling (lucide-react icon name)"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Brief description of this route..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0096FF] focus:border-transparent resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-medium text-gray-800">Active</p>
                <p className="text-xs text-gray-400">
                  Inactive routes are hidden from all users.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  isActive ? "bg-[#0096FF]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm font-medium text-gray-800 mb-2">
                Access Logic
              </p>
              <p className="text-xs text-gray-400 mb-3">
                When both roles and departments are set, does the user need to
                satisfy both (AND) or just one (OR)?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRequiresAnyPermission(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    !requiresAnyPermission
                      ? "bg-[#0096FF] text-white border-[#0096FF]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Require ALL (AND)
                </button>
                <button
                  type="button"
                  onClick={() => setRequiresAnyPermission(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    requiresAnyPermission
                      ? "bg-[#0096FF] text-white border-[#0096FF]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Require ANY (OR)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Button
            variant="secondary"
            size="sm"
            className="w-auto px-5"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-auto px-5"
            onClick={handleSubmit}
            isLoading={isPending}
          >
            {isEditing ? "Save Changes" : "Create Route"}
          </Button>
        </div>
      </div>
    </div>
  );
}
