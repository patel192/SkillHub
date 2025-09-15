import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";
import { Player } from "@lottiefiles/react-lottie-player"; // ✅ Lottie Player

// ✅ Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "My_Images");
  data.append("cloud_name", "dfaou6haj");

  const res = await fetch("https://api.cloudinary.com/v1_1/dfaou6haj/image/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  return result.secure_url;
};

export const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/user/${userId}`);
        setUserData(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let avatarUrl = userData.avatar;
      if (avatarFile) avatarUrl = await uploadToCloudinary(avatarFile);

      const updates = { ...userData, avatar: avatarUrl };
      const res = await axios.put(`http://localhost:8000/user/${userId}`, updates);

      setUserData(res.data.user);
      setEditMode(false);
      setAvatarFile(null);
      toast.success("Profile updated successfully ✅");
    } catch (err) {
      console.error("❌ Error saving user:", err);
      toast.error("Failed to update profile ❌");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/report", {
        reporter: userId,
        type: reportType,
        description: reportMessage,
        targetType: "User",
        targetId: userData._id,
      });

      toast.success("Report submitted successfully ✅");
      setReportType("");
      setReportMessage("");
      setIsReportOpen(false);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      toast.error("Failed to submit report ❌");
    }
  };

  if (!userData) {
    return <p className="text-center text-gray-500">⏳ Loading profile...</p>;
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-8 rounded-2xl shadow-lg max-w-full mx-auto text-white transition-all h-full border border-purple-600/40"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tabs */}
      <div className="flex justify-end mb-6 gap-4">
        {["profile", "activity", "achievements"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_15px_#8b5cf6]"
                : "bg-[#1b1b2a] hover:bg-[#2a2a3b] text-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={userData.avatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-[0_0_20px_#22d3ee] object-cover"
          />
          <div className="w-full">
            {editMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-cyan-300">Upload New Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-purple-500 file:to-cyan-500 file:text-white hover:file:opacity-90"
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-400">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={userData.fullname || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-[#1b1b2a] border border-purple-500/40 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-[#1b1b2a] border border-purple-500/40 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-400">Bio</label>
                <textarea
                  name="bio"
                  value={userData.bio || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows="2"
                  className="w-full p-2 mt-1 rounded-md bg-[#1b1b2a] border border-purple-500/40 focus:border-cyan-400 focus:ring focus:ring-cyan-400/30 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white px-4 py-2 rounded-md shadow-[0_0_15px_#22d3ee]"
                >
                  Edit Info
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:opacity-90 text-white px-4 py-2 rounded-md shadow-[0_0_15px_#22d3ee]"
                >
                  Save Changes
                </button>
              )}

              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                <AlertTriangle size={18} />
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {userData.achievements && userData.achievements.length > 0 ? (
            userData.achievements.map((ach, idx) => (
              <motion.div
                key={ach._id}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#1b1b2a] to-[#2a2a3b] shadow-[0_0_15px_#8b5cf6] flex flex-col items-center justify-center border border-purple-600 text-white"
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px #22d3ee" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="w-28 h-28 mb-3">
                  {ach.icon ? (
                    <Player
                      src={ach.icon}
                      autoplay
                      loop
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Icon
                    </div>
                  )}
                </div>
                <span className="font-bold text-lg text-cyan-400">{ach.name}</span>
                <span className="text-gray-400 text-sm mt-1">
                  Points: {ach.pointsRequired}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center mt-4">
              No achievements unlocked yet 🕒
            </p>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <motion.div
          className="text-gray-400 text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Activity feed is coming soon 📜
        </motion.div>
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-[#1b1b2a] to-[#2a2a3b] p-6 rounded-xl shadow-lg w-full max-w-md relative text-white border border-purple-600/50"
          >
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Report User</h2>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-purple-400">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                  className="w-full p-2 rounded-md border border-purple-600/40 bg-[#1b1b2a] text-white"
                >
                  <option value="">-- Select an issue --</option>
                  <option value="abuse">🚨 Abusive Behavior</option>
                  <option value="inappropriate">⚠️ Inappropriate</option>
                  <option value="bug">🐞 Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-purple-400">Details</label>
                <textarea
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  required
                  rows="3"
                  className="w-full p-2 rounded-md border border-purple-600/40 bg-[#1b1b2a] text-white"
                  placeholder="Describe the issue..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 rounded-lg shadow hover:scale-105 transition"
              >
                Submit Report
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
