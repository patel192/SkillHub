import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch reports from backend
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

  // Helper to display target
  const renderTarget = (r) => {
    if (!r.targetId) return "Unknown";
    if (r.targetType === "User") return r.targetId.fullname || "Unknown User";
    if (r.targetType === "Course") return r.targetId.title || "Unknown Course";
    if (r.targetType === "Post") return `Post ID: ${r.targetId._id}`;
    return "Unknown Target";
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

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-3">Reporter</th>
              <th className="p-3">Target</th>
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr
                key={r._id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Reporter */}
                <td className="p-3">{r.reporter?.fullname || "Anonymous"}</td>

                {/* Target */}
                <td className="p-3">
                  {r.targetType} → {renderTarget(r)}
                </td>

                {/* Type */}
                <td className="p-3 capitalize">{r.type}</td>

                {/* Description */}
                <td className="p-3">{r.description}</td>

                {/* Date */}
                <td className="p-3">
                  {new Date(r.createdAt).toLocaleString()}
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      r.status === "resolved"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {r.status || "pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
