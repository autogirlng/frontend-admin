import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications

import { useHttp } from "@/utils/useHttp";
import { LocalRoute } from "@/utils/LocalRoutes"; // Assuming LocalRoute is defined and has the base URL

type SendLoginDetailsPayload = {
  hostId: string; // The ID from the URL: 683f244249f044756a4ca590
};

export const useSendLoginDetails = () => {
  const queryClient = useQueryClient();
  const { post } = useHttp(); // Assuming useHttp provides a 'post' method

  const sendLoginDetailsRequest = async (payload: SendLoginDetailsPayload) => {
    const url = `/admin/host/send-login-details/${payload.hostId}`;

    const response = await post(url, {});
    return response;
  };

  return useMutation({
    mutationFn: sendLoginDetailsRequest,
    onSuccess: (data, variables) => {
      // 'data' is the response from the API, 'variables' are the payload you passed to mutate
      toast.success(
        `Login details sent to host ${variables.hostId} successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["hosts"] });
      queryClient.invalidateQueries({ queryKey: ["host", variables.hostId] }); // Invalidate specific host details
    },
    onError: (error: any, variables) => {
      console.error(
        `Failed to send login details for host ${variables.hostId}:`,
        error
      );

      toast.error(
        error.message ||
          `Failed to send login details for host ${variables.hostId}.`
      );
    },
  });
};
