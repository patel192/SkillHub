import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaBook, FaCertificate, FaCheckCircle, FaBell } from "react-icons/fa";
export const Notifications = ({token}) => {
    const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notifications/${userId}`,{
          headers:{Authorization:`Bearer ${token}`}
        });
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [userId]);

  const getIcon = (type) => {
    switch (type) {
      case "COURSE_ENROLLMENT":
        return <FaBook className="text-blue-400" />;
      case "CERTIFICATE_AWARDED":
        return <FaCertificate className="text-yellow-400" />;
      case "LESSON_COMPLETED":
        return <FaCheckCircle className="text-green-400" />;
      default:
        return <FaBell className="text-gray-400" />;
    }
  };
  return (
   <div className="p-6 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Notifications
      </motion.h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <motion.li
              key={n._id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-start gap-4 p-4 rounded-xl shadow-lg ${
                n.read ? "bg-[#334155]" : "bg-[#475569] border-l-4 border-blue-400"
              }`}
            >
              <div className="mt-1">{getIcon(n.type)}</div>
              <div className="flex-1">
                <p className="font-medium">{n.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
