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
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/reports/${id}`);
        setReport(res.data.report);
      } catch (err) {
        console.error("❌ Failed to fetch report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleResolve = async () => {
    try {
      await axios.patch(`http://localhost:8000/reports/${id}`, {
        status: "resolved",
      });
      setReport((prev) => ({ ...prev, status: "resolved" }));
      alert("✅ Report marked as resolved");
    } catch (err) {
      console.error("❌ Failed to update report:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`http://localhost:8000/report/${id}`);
      alert("🗑️ Report deleted");
      navigate("/admin/reports");
    } catch (err) {
      console.error("❌ Failed to delete report:", err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-400">⏳ Loading report...</p>;

  if (!report)
    return <p className="text-center text-red-500">⚠️ Report not found</p>;

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
        link = "";
    }

    return link ? (
      <Link
        to={link}
        className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 dark:text-violet-400"
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
      transition={{ duration: 0.4 }}
      className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-violet-600"
      >
        <ArrowLeft className="mr-2" /> Back to Reports
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 w-7 h-7" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Report Details
            </h2>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              report.status === "resolved"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
            }`}
          >
            {report.status}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Reporter */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-violet-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Reporter
                </span>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {report.reporter?.fullname || "Anonymous"}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Mail className="w-4 h-4" /> {report.reporter?.email || "N/A"}
              </div>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-violet-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Report Type
                </span>
              </div>
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {report.type}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-violet-500" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Description
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Target & Meta */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-violet-500" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Target
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                {renderTarget()}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Created:</span>
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 text-violet-500" />
                <span className="font-medium">Last Updated:</span>
                <span>{new Date(report.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-end">
          {report.status !== "resolved" && (
            <button
              onClick={handleResolve}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              <CheckCircle /> Mark as Resolved
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            <Trash2 /> Delete Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};
