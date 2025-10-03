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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
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
      className="p-6 bg-gradient-to-br from-[#0f172a]/95 via-[#1e1b4b]/95 to-[#0f172a]/95 
             backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-700/40"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-purple-300">
        <AlertTriangle className="text-cyan-400 drop-shadow-lg" />
        Reports ({reports.length})
      </h2>

      <div className="space-y-4">
        {reports.map((r) => (
          <motion.div
            key={r._id}
            onClick={() => navigate(`/admin/reports/${r._id}`)}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl 
                   bg-gradient-to-r from-[#1e1b4b]/80 to-[#0f172a]/80 
                   backdrop-blur-md shadow-md border border-purple-600/40 
                   cursor-pointer hover:shadow-purple-500/30 hover:border-cyan-400/50 
                   transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-200">
                {getTargetIcon(r.targetType)}
                <span className="font-medium text-white/90">
                  {r.targetType} → {renderTarget(r)}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm 
              ${
                r.status === "resolved"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                  : "bg-purple-500/20 text-purple-300 border border-purple-400/30"
              }`}
              >
                {r.status || "pending"}
              </span>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">
              {r.description || "No description provided"}
            </p>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
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
