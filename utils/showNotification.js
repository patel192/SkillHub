// src/utils/showNotification.js
import toast from "react-hot-toast";

/**
 * Show notification with a unified API
 * @param {string} msg - The message to show
 * @param {"success" | "error" | "info"} type - Type of the notification
 */
export const showNotification = (msg, type = "success") => {
  switch (type) {
    case "error":
      toast.error(msg, {
        duration: 4000,
        style: { background: "#ef4444", color: "white" },
      });
      break;

    case "info":
      toast(msg, {
        duration: 4000,
        style: { background: "#3b82f6", color: "white" },
      });
      break;

    default: // success
      toast.success(msg, {
        duration: 4000,
        style: { background: "#10b981", color: "white" },
      });
  }
};
