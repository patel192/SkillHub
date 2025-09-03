import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
export const Activities = () => {
    const [activities, setActivities] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/activities/${userId}`);
        setActivities(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching activities:", err);
      }
    };
    fetchActivities();
  }, [userId]);

  const getIcon = (action) => {
    switch (action) {
      case "ENROLLED":
        return <FaBookOpen className="text-blue-400" />;
      case "COMPLETED":
        return <FaCheckCircle className="text-green-400" />;
      case "CERTIFICATE":
        return <FaCertificate className="text-yellow-400" />;
      default:
        return <FaClock className="text-gray-400" />;
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
        Your Activity
      </motion.h1>

      {activities.length === 0 ? (
        <p className="text-gray-400">No activity found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <motion.li
              key={activity._id}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 bg-[#334155] p-4 rounded-xl shadow-lg"
            >
              <div className="mt-1">{getIcon(activity.action)}</div>
              <div className="flex-1">
                <p className="font-medium">{activity.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
