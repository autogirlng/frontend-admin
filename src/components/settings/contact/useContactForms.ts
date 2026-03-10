"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { ContactFormEntry, PaginatedContactResponse } from "./types";

export const CONTACT_FORMS_KEY = "contactForms";
export const CONTACT_FORM_DETAIL_KEY = "contactFormDetail";

export function useGetContactForms(
  page: number,
  size: number = 10,
  search?: string,
) {
  return useQuery<PaginatedContactResponse>({
    queryKey: [CONTACT_FORMS_KEY, page, size, search],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(size));
      if (search?.trim()) params.append("search", search.trim());
      return apiClient.get<PaginatedContactResponse>(
        `/contact-form?${params.toString()}`,
      );
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useGetContactFormDetail(id: string | null) {
  return useQuery<ContactFormEntry>({
    queryKey: [CONTACT_FORM_DETAIL_KEY, id],
    queryFn: () =>
      apiClient.get<ContactFormEntry>(`/contact-form/${id}`),
    enabled: !!id,
  });
}

export function useMarkContactFormRead() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (id: string) =>
      apiClient.put(`/contact-form/${id}`, { isRead: true }),
    onSuccess: () => {
      toast.success("Marked as read.");
      queryClient.invalidateQueries({ queryKey: [CONTACT_FORMS_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_FORM_DETAIL_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read.");
    },
  });
}

export function useDeleteContactForm() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (id: string) => apiClient.delete(`/contact-form/${id}`),
    onSuccess: () => {
      toast.success("Contact form deleted successfully.");
      queryClient.invalidateQueries({ queryKey: [CONTACT_FORMS_KEY] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete contact form.");
    },
  });
}
