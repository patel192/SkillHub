import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, Flag } from "lucide-react";

export const ReportModal = ({ targetType, targetId, onClose }) => {
  const [type, setType] = useState("bug");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/report",
        {
          reporter: userId,
          type,
          description,
          targetType,
          targetId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Report submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Report error:", error);
      toast.error("Failed to submit report.");
    }
  };

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="relative w-full max-w-md bg-[#0f1117] border border-white/10 rounded-2xl p-6 shadow-xl text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <Flag className="text-red-400" size={22} />
          <h2 className="text-xl font-semibold">{getTitle()}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Report Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="
                w-full p-3 rounded-xl bg-[#1a1d26] border border-white/10 
                text-gray-200 focus:border-indigo-400 focus:ring 
                focus:ring-indigo-500/20 transition
              "
              required
            >
              <option value="bug">🐞 Bug</option>
              <option value="abuse">🚨 Abuse</option>
              <option value="inappropriate">⚠️ Inappropriate</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="
                w-full p-3 rounded-xl bg-[#1a1d26] border border-white/10 
                text-gray-200 focus:border-indigo-400 focus:ring 
                focus:ring-indigo-500/20 transition
              "
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-xl bg-[#1a1d26] border border-white/10 
                hover:border-gray-400 transition
              "
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="
                px-5 py-2 rounded-xl font-medium 
                bg-gradient-to-r from-red-500 to-pink-600 
                hover:opacity-90 transition
              "
            >
              Submit Report
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
