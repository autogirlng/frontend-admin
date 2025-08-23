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
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
