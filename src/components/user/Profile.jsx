import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTrophy,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MdTimeline } from "react-icons/md";

export const Profile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [userData, setUserData] = useState({
    name: "Muhammad Patel",
    email: "patelmuhammad192@gmail.com",
    bio: "Passionate Web Developer & Learner",
    github: "https://github.com/patelmuhammad",
    linkedin: "https://linkedin.com/in/patel-muhammad",
    twitter: "https://twitter.com/yourhandle",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patel",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("✅ Saved user data:", userData);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg max-w-full mx-auto transition-all h-full"
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
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <img
            src={userData.avatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-md"
          />

          <div className="w-full">
            {/* Redirect to Avatar Customizer */}
            <button
              onClick={() => navigate("/user/avatar")}
              className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              🎨 Customize Avatar
            </button>

            {/* Editable Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium">Bio</label>
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows="2"
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium">GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={userData.github}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={userData.linkedin}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium">Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={userData.twitter}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>
            </div>

            {/* Social Links Preview */}
            <div className="flex items-center gap-4 mt-6">
              <a href={userData.github} target="_blank" rel="noreferrer">
                <FaGithub className="text-2xl hover:text-black dark:hover:text-white transition" />
              </a>
              <a href={userData.linkedin} target="_blank" rel="noreferrer">
                <FaLinkedin className="text-2xl hover:text-blue-600 transition" />
              </a>
              <a href={userData.twitter} target="_blank" rel="noreferrer">
                <FaTwitter className="text-2xl hover:text-blue-400 transition" />
              </a>
            </div>

            {/* Edit / Save */}
            <div className="flex justify-end gap-4 mt-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  Edit Info
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Section */}
      {activeTab === "activity" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <h3 className="text-2xl font-semibold flex items-center gap-2 mb-6 text-indigo-600">
            <MdTimeline className="text-indigo-500 text-3xl" /> Recent Activity
          </h3>
          <p className="text-gray-500">No activity yet.</p>
        </div>
      )}

      {/* Achievements Section */}
      {activeTab === "achievements" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 w-full">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-yellow-600">
            <FaTrophy /> Achievements
          </h3>
          <p className="text-gray-500">No achievements unlocked yet.</p>
        </div>
      )}
    </motion.div>
  );
};
