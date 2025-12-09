import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Flag, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export const Report = ({ targetType = "General", targetId = null }) => {
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!targetId) {
      alert("Invalid report target");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(
        "/report",
        {
          type,
          description,
          targetType,
          targetId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setDescription("");
      setType("bug");
    } catch (err) {
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto p-8 rounded-2xl bg-[#0f1117] border border-white/10 shadow-lg text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Flag size={22} className="text-red-400" />
        <h2 className="text-2xl font-semibold">Report an Issue</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Report Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#1a1d26] border border-white/10 focus:border-indigo-400 focus:ring focus:ring-indigo-500/20 text-gray-200"
          >
            <option value="bug">🐞 Bug</option>
            <option value="abuse">🚫 Abuse</option>
            <option value="inappropriate">⚠️ Inappropriate</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Describe the Issue
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Explain the issue in detail..."
            className="w-full p-3 rounded-xl bg-[#1a1d26] border border-white/10 text-gray-200 focus:border-indigo-400 focus:ring focus:ring-indigo-500/20"
            required
          />
        </div>

        {/* Buttons */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-blue-600 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Sending...
            </>
          ) : success ? (
            <>
              <CheckCircle className="text-green-400" /> Report Sent
            </>
          ) : (
            <>
              <AlertTriangle className="text-yellow-400" /> Submit Report
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
