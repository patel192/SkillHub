import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Trash2,
  AlertTriangle,
  Mail,
  User,
  FileText,
  Tag,
  Clock,
  Info,
  ExternalLink,
} from "lucide-react";

export const ReportsDetail = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data.report);
      } catch (err) {
        console.error("❌ Failed to fetch report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, token]);

  const handleResolve = async () => {
    try {
      await axios.patch(
        `/reports/${id}`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport((prev) => ({ ...prev, status: "resolved" }));
      alert("✅ Report marked as resolved");
    } catch (err) {
      console.error("❌ Failed to update report:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Report deleted");
      navigate("/admin/reports");
    } catch (err) {
      console.error("❌ Failed to delete report:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-400 text-lg mt-20">
        ⏳ Loading report...
      </p>
    );

  if (!report)
    return (
      <p className="text-center text-red-500 text-lg mt-20">
        ⚠️ Report not found
      </p>
    );

  const renderTarget = () => {
    if (!report.targetId) return "Unknown";

    let label = "";
    let link = "";

    switch (report.targetType) {
      case "User":
        label = report.targetId.fullname || "Unknown User";
        link = `/admin/users/${report.targetId._id}`;
        break;
      case "Course":
        label = report.targetId.title || "Unknown Course";
        link = `/courses/${report.targetId._id}`;
        break;
      case "Post":
        label = `Post ID: ${report.targetId._id}`;
        link = `/posts/${report.targetId._id}`;
        break;
      default:
        label = "Unknown Target";
    }

    return link ? (
      <Link
        to={link}
        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm sm:text-base break-all"
      >
        {label} <ExternalLink size={14} />
      </Link>
    ) : (
      label
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] min-h-screen text-white"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-300 mb-4 sm:mb-6 hover:text-cyan-400 transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Back to Reports
      </button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1b1b2a]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-600/50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-purple-700/30 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <AlertTriangle className="text-cyan-400 w-5 h-5 sm:w-7 sm:h-7 drop-shadow-lg" />
            <h2 className="text-xl sm:text-2xl font-bold">Report Details</h2>
          </div>
          <span
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-md self-start sm:self-auto ${
              report.status === "resolved"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-400/30"
            }`}
          >
            {report.status}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-8">
          {/* Reporter & Type */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <div className="flex-1 bg-[#0f172a]/50 p-4 sm:p-5 rounded-xl border border-purple-600/40">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="font-semibold text-white text-sm sm:text-base">
                  Reporter
                </span>
              </div>
              <p className="text-base sm:text-lg font-medium">
                {report.reporter?.fullname || "Anonymous"}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mt-1 break-all">
                <Mail className="w-4 h-4 text-cyan-400" />
                {report.reporter?.email || "N/A"}
              </div>
            </div>

            <div className="flex-1 bg-[#0f172a]/50 p-4 sm:p-5 rounded-xl border border-purple-600/40">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="font-semibold text-white text-sm sm:text-base">
                  Report Type
                </span>
              </div>
              <span className="inline-block px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {report.type}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#0f172a]/50 p-4 sm:p-5 rounded-xl border border-purple-600/40">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="font-semibold text-white text-sm sm:text-base">
                Description
              </span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Target & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-[#0f172a]/50 p-4 sm:p-5 rounded-xl border border-purple-600/40">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="font-semibold text-white text-sm sm:text-base">
                  Target
                </span>
              </div>
              <p className="text-white text-sm sm:text-lg font-medium break-all">
                {renderTarget()}
              </p>
            </div>

            <div className="bg-[#0f172a]/50 p-4 sm:p-5 rounded-xl border border-purple-600/40 space-y-2">
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm flex-wrap">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">Created:</span>
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm flex-wrap">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">Last Updated:</span>
                <span>{new Date(report.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-purple-700/30 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
          {report.status !== "resolved" && (
            <motion.button
              onClick={handleResolve}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00FFFF" }}
              className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-lg transition text-sm sm:text-base"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Mark as Resolved
            </motion.button>
          )}
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #FF0080" }}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-lg transition text-sm sm:text-base"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /> Delete Report
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
