import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const ReportModal = ({ targetType, targetId, onClose }) => {
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/report", {
        reporter: localStorage.getItem("userId"), // ✅ required
        type,
        description,
        targetType, // ✅ dynamic target
        targetId,   // ✅ dynamic id
      });

      toast.success("✅ Report submitted successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Report failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to submit report. Try again."
      );
    }
  };

  // Pick a readable title
  const getTitle = () => {
    switch (targetType) {
      case "User":
        return "Report User";
      case "Course":
        return "Report Course";
      case "Post":
        return "Report Post";
      case "Comment":
        return "Report Comment";
      default:
        return "Report Issue";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">{getTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Report Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="bug">🐞 Bug</option>
              <option value="abuse">🚨 Abuse</option>
              <option value="inappropriate">⚠️ Inappropriate</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
              rows={4}
              maxLength={1000}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
