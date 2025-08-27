import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";
import { MdTimeline } from "react-icons/md";
import axios from "axios";

export const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);

  const userId = localStorage.getItem("userId");

  // ✅ Fetch user data from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/user/${userId}`);
        setUserData(res.data.data);
        console.log(res);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  //  Update avatar if coming from AvatarCustomization
  useEffect(() => {
    if (location.state?.selectedAvatar) {
      setUserData((prev) => ({
        ...prev,
        avatar: location.state.selectedAvatar,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //  Save changes to backend
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/user/${userId}`,
        userData
      );
      setUserData(res.data.user);
      setEditMode(false);
      console.log("✅ User updated:", res.data.user);
    } catch (err) {
      console.error("❌ Error saving user:", err);
    }
  };

  if (!userData) {
    return <p className="text-center text-gray-500">⏳ Loading profile...</p>;
  }

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
            src={
              userData.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
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
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={userData.fullname}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
                />
              </div>

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
              {userData.github && (
                <a href={userData.github} target="_blank" rel="noreferrer">
                  <FaGithub className="text-2xl hover:text-black dark:hover:text-white transition" />
                </a>
              )}
              {userData.linkedin && (
                <a href={userData.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin className="text-2xl hover:text-blue-600 transition" />
                </a>
              )}
              {userData.twitter && (
                <a href={userData.twitter} target="_blank" rel="noreferrer">
                  <FaTwitter className="text-2xl hover:text-blue-400 transition" />
                </a>
              )}
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
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 w-full">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-6 text-yellow-600">
            <FaTrophy className="text-yellow-500 animate-pulse" /> Achievements
          </h3>

          {!userData.achievements || userData.achievements.length === 0 ? (
            <p className="text-gray-500 text-center">
              No achievements unlocked yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userData.achievements.map((ach, idx) => (
                <motion.div
                  key={ach._id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.07, rotate: 1 }}
                  className="p-5 rounded-xl shadow-lg bg-gradient-to-tr from-gray-100 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 border border-yellow-500 flex flex-col items-center justify-center"
                >
                  {/* Achievement Icon with animation */}
                  <motion.img
                    src={ach.icon}
                    alt={ach.title}
                    className="w-20 h-20 mb-3 drop-shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Title */}
                  <h4 className="text-lg font-bold text-yellow-600 text-center">
                    {ach.title}
                  </h4>

                  {/* Description */}
                  {ach.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
                      {ach.description}
                    </p>
                  )}

                  {/* Points Required */}
                  <span className="mt-3 inline-block px-3 py-1 text-xs rounded-full bg-yellow-500 text-white shadow-md">
                    {ach.pointsRequired} pts
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
