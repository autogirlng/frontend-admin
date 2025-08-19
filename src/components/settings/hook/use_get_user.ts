// src/hooks/useGetUser.ts
import { useQuery } from '@tanstack/react-query';
import { Member } from '@/utils/types'; // Assuming Member type is defined here
import { toast } from 'react-toastify';
import apiClient from '@/api/APIClient';

interface GetUserQueryResult {
  user: Member | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Define your query key for clarity and invalidation later
export const USER_QUERY_KEY = (id: string) => ['adminUser', id];

// Modify fetchUserById to use apiClient
const fetchUserById = async (userId: string): Promise<Member> => {
  if (!userId) {
    throw new Error('User ID is required to fetch user data.');
  }

  try {
    // Use apiClient.get() for GET requests
    const response = await apiClient.get<Member>(`/user/admin/${userId}`);
    return response.data; // Axios puts the response data in the 'data' property
  } catch (error: any) {
    // Axios errors have a specific structure
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
    throw new Error(errorMessage);
  }
};

const useGetUser = (userId: string | undefined): GetUserQueryResult => {
  const { data, isLoading, isError, error } = useQuery<Member, Error>({
    queryKey: USER_QUERY_KEY(userId || ''), // Use a unique key for each user
    queryFn: () => fetchUserById(userId as string),
    enabled: !!userId, // Only run the query if userId is defined
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes (5 minutes)
   
  });

  return { user: data, isLoading, isError, error };
};

export default useGetUser;