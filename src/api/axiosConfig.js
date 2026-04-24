import axios from "axios";
import {logout} from "../redux/features/auth/authSlice";
import {store} from "../redux/store";
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
    if (error.response?.status === 401) {

      console.log("Session expired — logging out");

      store.dispatch(logout());

      localStorage.removeItem("persist:root");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;