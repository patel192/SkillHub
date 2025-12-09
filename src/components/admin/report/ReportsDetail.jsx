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
        console.error("Failed to fetch report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleResolve = async () => {
    try {
      await axios.patch(
        `/reports/${id}`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport((prev) => ({ ...prev, status: "resolved" }));
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this report permanently?")) return;

    try {
      await axios.delete(`/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/admin/reports");
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-red-500 text-xl mt-20">
        Report not found
      </div>
    );
  }

  const renderTarget = () => {
    if (!report.targetId) return "Unknown";

    let label = "";
    let link = "";

    switch (report.targetType) {
      case "User":
        label = report.targetId.fullname;
        link = `/admin/users/${report.targetId._id}`;
        break;
      case "Course":
        label = report.targetId.title;
        link = `/courses/${report.targetId._id}`;
        break;
      case "Post":
        label = `Post ID: ${report.targetId._id}`;
        link = `/posts/${report.targetId._id}`;
        break;
    }

    return (
      <Link
        to={link}
        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition"
      >
        {label} <ExternalLink size={14} />
      </Link>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 sm:p-10 min-h-screen bg-gradient-to-br 
                 from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white"
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition mb-6"
      >
        <ArrowLeft size={18} /> Back to Reports
      </button>

      {/* MAIN WRAPPER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-purple-700/30 
                   shadow-2xl rounded-2xl p-6 sm:p-8 space-y-8"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-cyan-400" size={26} />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-purple-400 to-cyan-400">
              Report Details
            </h1>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium border 
            ${
              report.status === "resolved"
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : "bg-purple-500/20 text-purple-300 border-purple-400/30"
            }`}
          >
            {report.status}
          </span>
        </div>

        {/* GRID SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* REPORTER */}
          <div className="bg-white/5 border border-purple-700/30 p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <User size={20} className="text-cyan-400" />
              <h3 className="font-semibold text-lg">Reporter</h3>
            </div>

            <p className="text-white text-lg">{report.reporter?.fullname}</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
              <Mail size={16} className="text-cyan-400" />
              {report.reporter?.email}
            </div>
          </div>

          {/* REPORT TYPE */}
          <div className="bg-white/5 border border-purple-700/30 p-5 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-cyan-400" />
              <h3 className="font-semibold text-lg">Report Type</h3>
            </div>

            <span className="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300">
              {report.type}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white/5 border border-purple-700/30 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="text-cyan-400" size={20} />
            <h3 className="font-semibold text-lg">Description</h3>
          </div>

          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* TARGET + META */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TARGET */}
          <div className="bg-white/5 border border-purple-700/30 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-cyan-400" size={20} />
              <h3 className="font-semibold text-lg">Target</h3>
            </div>
            <p className="text-white text-lg">{renderTarget()}</p>
          </div>

          {/* METADATA */}
          <div className="bg-white/5 border border-purple-700/30 p-6 rounded-xl shadow-lg space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock size={16} className="text-cyan-400" /> Created:
              <span className="text-cyan-300 ml-1">
                {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock size={16} className="text-cyan-400" /> Updated:
              <span className="text-cyan-300 ml-1">
                {new Date(report.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          {report.status !== "resolved" && (
            <motion.button
              onClick={handleResolve}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-5 py-2 
                         bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-lg"
            >
              <CheckCircle size={18} /> Mark as Resolved
            </motion.button>
          )}

          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 px-5 py-2 
                       bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg"
          >
            <Trash2 size={18} /> Delete Report
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
