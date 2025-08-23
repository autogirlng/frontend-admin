import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
   console.log('token',token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createCustomer = async (data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  email: string;
  userRole: string;
  isBusiness: boolean;
  businessLogo: string;
  businessName: string;
  businessAddress: string;
  businessPhoneNumber: string;
  businessEmail: string;
  onBoardedBy: string;
  mouDocument: string;
}) => {
  return apiClient.post('/auth/createUser', data);
};

export default apiClient;
