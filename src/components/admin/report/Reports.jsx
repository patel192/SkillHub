import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle, User, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:8000/reports");
        setReports(res.data?.reports || []);
      } catch (err) {
        console.error("❌ Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">⏳ Loading reports...</p>;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No reports submitted yet.
      </div>
    );
  }

  const renderTarget = (r) => {
    if (!r.targetId) return "Unknown";
    if (r.targetType === "User") return r.targetId.fullname || "Unknown User";
    if (r.targetType === "Course") return r.targetId.title || "Unknown Course";
    if (r.targetType === "Post") return `Post ID: ${r.targetId._id}`;
    return "Unknown Target";
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case "User":
        return <User className="text-blue-500" size={18} />;
      case "Course":
        return <BookOpen className="text-green-500" size={18} />;
      case "Post":
        return <MessageSquare className="text-purple-500" size={18} />;
      default:
        return <AlertTriangle className="text-red-500" size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <AlertTriangle className="text-red-500" />
        Reports ({reports.length})
      </h2>

      <div className="space-y-4">
        {reports.map((r, idx) => (
          <motion.div
            key={r._id}
            onClick={() => navigate(`/admin/reports/${r._id}`)}
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTargetIcon(r.targetType)}
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {r.targetType} → {renderTarget(r)}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  r.status === "resolved"
                    ? "bg-green-200 text-green-700"
                    : "bg-yellow-200 text-yellow-700"
                }`}
              >
                {r.status || "pending"}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {r.description || "No description provided"}
            </p>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Reporter: {r.reporter?.fullname || "Anonymous"}
              </span>
              <span>{new Date(r.createdAt).toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
