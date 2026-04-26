import axios from "axios";
import { logout } from "../redux/features/auth/authSlice";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/features/ui/uiSlice";
import { toast } from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "https://skillhub-backend-gs3t.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//
// REQUEST
//

apiClient.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());

    const state = store.getState();
    const token = state.auth.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  },
);

//
// RESPONSE
//

apiClient.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },

  (error) => {
    store.dispatch(stopLoading());

    if (error.response?.status === 401) {
      console.log("Session expired — logging out");

      store.dispatch(logout());

      localStorage.removeItem("persist:root");

      window.location.href = "/login";
    }
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);

    return Promise.reject(error);
  },
);

export default apiClient;
