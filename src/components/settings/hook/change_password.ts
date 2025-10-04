import apiClient from "@/api/APIClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"; // Using react-toastify as in your provided code

// Define the payload type for the change password API
interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

// Function to make the actual API call
const changePasswordApi = async (payload: ChangePasswordPayload) => {
  const response = await apiClient.put("/user/changePassword", payload); // Using PATCH as per common practice for partial updates, or POST if it's a dedicated endpoint
  return response.data;
};

const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data: any) => {
      // Assuming your API returns a message field on success
      toast.success(data.message || "Password changed successfully!");
      // Optionally invalidate any relevant queries, e.g., user profile data
      // queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: any) => {
      // Handle API error messages. 'error' might be an AxiosError
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password.";
      toast.error(errorMessage);
    },
  });
};

export default useChangePassword;
