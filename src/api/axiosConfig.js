import axios from "axios";
import { toast } from "react-hot-toast";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: "https://skillhub-backend-gs3t.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
    
    // Handle other errors
    if (response?.status === 403) {
      toast.error("You don't have permission to do this.");
    }
    
    if (response?.status === 500) {
      toast.error("Server error. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;