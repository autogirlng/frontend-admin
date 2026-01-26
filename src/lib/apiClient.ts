import { ConsolidatedInvoicePayload } from "@/components/dashboard/bookings-management/consolidated-types";
import { getSession } from "next-auth/react";

class ApiError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.name = "ApiError";
    this.response = response;
  }
}

async function getHeaders(requireAuth: boolean = true) {
  const session = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth && session?.user?.accessToken) {
    headers["Authorization"] = `Bearer ${session.user.accessToken}`;
  }

  return headers;
}

async function handleResponse(response: Response) {
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    if (!response.ok) {
      throw new ApiError("API request failed with no content", response);
    }
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.message || "API request failed", response);
  }
  return data.data;
}

export const apiClient = {
  get: async <T>(endpoint: string, requireAuth: boolean = true): Promise<T> => {
    const headers = await getHeaders(requireAuth);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "GET",
        headers,
      }
    );
    return handleResponse(response);
  },

  post: async <T>(
    endpoint: string,
    body: any,
    requireAuth: boolean = true
  ): Promise<T> => {
    const headers = await getHeaders(requireAuth);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );
    return handleResponse(response);
  },

  put: async <T>(endpoint: string, body: any): Promise<T> => {
    const headers = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      }
    );
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, body: any): Promise<T> => {
    const headers = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      }
    );
    return handleResponse(response);
  },

  delete: async <T>(endpoint: string): Promise<T | null> => {
    const headers = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "DELETE",
        headers,
      }
    );
    return handleResponse(response);
  },

  patchFormData: async <T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> => {
    const session = await getSession();
    const headers: Record<string, string> = {}; // No 'Content-Type'

    if (session?.user?.accessToken) {
      headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "PATCH", // Use PATCH method
        headers,
        body: formData,
      }
    );
    return handleResponse(response);
  },

  postFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const session = await getSession();
    const headers: Record<string, string> = {}; // No 'Content-Type'

    if (session?.user?.accessToken) {
      headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers, // Let the browser set the 'Content-Type' for FormData
        body: formData,
      }
    );
    return handleResponse(response);
  },

  postAndDownloadFile: async (
    endpoint: string,
    body: any,
    defaultFilename: string
  ): Promise<void> => {
    const authHeaders = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      // Try to parse error from JSON, fallback to status text
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Not a JSON error
      }
      throw new Error(
        errorData?.message || response.statusText || "Failed to download file"
      );
    }

    const blob = await response.blob();

    // Try to get filename from 'Content-Disposition' header
    let filename = defaultFilename;
    const disposition = response.headers.get("content-disposition");
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }

    // Create a temporary link to trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  getAndDownloadFile: async (
    endpoint: string,
    defaultFilename: string
  ): Promise<void> => {
    const headers = await getHeaders(); // Get auth headers

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "GET",
        headers, // No body or Content-Type needed for GET
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Not a JSON error
      }
      throw new Error(
        errorData?.message || response.statusText || "Failed to download file"
      );
    }

    const blob = await response.blob();

    // Try to get filename from 'Content-Disposition' header
    let filename = defaultFilename;
    const disposition = response.headers.get("content-disposition");
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }

    // Create a temporary link to trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Add these two methods to your existing apiClient object

  getFileAsBlob: async (endpoint: string): Promise<Blob> => {
    const headers = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      let errorMsg = "Failed to load file";
      try {
        const err = await response.json();
        errorMsg = err.message || errorMsg;
      } catch { }
      throw new Error(errorMsg);
    }

    return await response.blob();
  },

  postFileAsBlob: async (endpoint: string, body: any = {}): Promise<Blob> => {
    const headers = await getHeaders();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      let errorMsg = "Failed to load file";
      try {
        const err = await response.json();
        errorMsg = err.message || errorMsg;
      } catch { }
      throw new Error(errorMsg);
    }

    return await response.blob();
  },

  getConsolidatedInvoices: async <T>(endpoint: string, requireAuth: boolean = true): Promise<T> => {
    const headers = await getHeaders(requireAuth);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "GET",
        headers,
      }
    );
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      if (!response.ok) {
        throw new ApiError("API request failed with no content", response);
      }
      return null as unknown as T;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.message || "API request failed", response);
    }
    return data;
  },
};