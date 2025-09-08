import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Flag, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
export const Report = ({ targetType = "General", targetId = null }) => {
   const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetType || !targetId) {
      alert("Invalid report target");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/reports/add", {
        type,
        description,
        targetType,
        targetId,
        // reporter will be set in backend from auth middleware
      });
      setSuccess(true);
      setDescription("");
      setType("bug");
    } catch (err) {
      alert("Failed to submit report: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto p-8 rounded-2xl bg-[#1E293B]/70 backdrop-blur-md shadow-xl border border-white/10"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Flag className="text-red-400" /> Report an Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Report Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="bug">🐞 Bug</option>
            <option value="abuse">🚫 Abuse</option>
            <option value="inappropriate">⚠️ Inappropriate</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Describe the issue
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Please explain the issue in detail..."
            className="w-full p-3 rounded-xl bg-[#0f172a] border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500"
            maxLength={1000}
            required
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-red-500 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Submitting...
            </>
          ) : success ? (
            <>
              <CheckCircle className="text-green-400" /> Report Sent
            </>
          ) : (
            <>
              <AlertTriangle /> Submit Report
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
