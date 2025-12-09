import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle, User, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../utils/Spinner";

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data?.reports || []);
      } catch (err) {
        console.error("❌ Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10 text-lg">
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
        return <User className="text-blue-400" size={18} />;
      case "Course":
        return <BookOpen className="text-green-400" size={18} />;
      case "Post":
        return <MessageSquare className="text-purple-400" size={18} />;
      default:
        return <AlertTriangle className="text-red-400" size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 sm:p-10 min-h-screen bg-gradient-to-br 
                 from-[#0f172a] via-[#1e1b4b] to-[#0f172a] 
                 text-white rounded-2xl"
    >
      {/* Page Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold mb-10 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-purple-400 to-cyan-400 
                     drop-shadow-lg">
        Reports Overview
      </h2>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r, index) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/admin/reports/${r._id}`)}
            className="cursor-pointer p-5 rounded-2xl border border-purple-700/40
                       bg-white/5 backdrop-blur-lg shadow-lg hover:shadow-purple-500/40
                       transition-all"
          >
            {/* Target Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-200">
                {getTargetIcon(r.targetType)}
                <span className="font-medium text-white">
                  {r.targetType} → {renderTarget(r)}
                </span>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full border font-semibold
                  ${
                    r.status === "resolved"
                      ? "bg-green-500/20 text-green-300 border-green-400/20"
                      : "bg-purple-500/20 text-purple-300 border-purple-400/30"
                  }`}
              >
                {r.status || "pending"}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-gray-400 text-sm line-clamp-3">
              {r.description || "No description provided"}
            </p>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
              <span className="text-purple-300">
                Reporter: {r.reporter?.fullname || "Anonymous"}
              </span>
              <span className="text-cyan-400">
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
