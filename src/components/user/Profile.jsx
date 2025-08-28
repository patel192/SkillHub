import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// ✅ Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "My_Images"); // 🔑 your upload preset
  data.append("cloud_name", "dfaou6haj"); // 🔑 your cloud name

  const res = await fetch("https://api.cloudinary.com/v1_1/dfaou6haj/image/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();
  return result.secure_url; // ✅ only URL needed for backend
};

export const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const userId = localStorage.getItem("userId");

  // ✅ Fetch user data
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

  // ✅ Save changes with Cloudinary upload if avatar selected
  const handleSave = async () => {
    try {
      let avatarUrl = userData.avatar;

      if (avatarFile) {
        avatarUrl = await uploadToCloudinary(avatarFile);
      }

      const updates = { ...userData, avatar: avatarUrl };

      const res = await axios.put(
        `http://localhost:8000/user/${userId}`,
        updates
      );

      setUserData(res.data.user);
      setEditMode(false);
      setAvatarFile(null);
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
      src={userData.avatar}
      alt="Profile"
      className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-md object-cover"
    />

    <div className="w-full">
      {/* ✅ Avatar Upload Input */}
      {editMode && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload New Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
        </div>
      )}

      {/* Editable Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={userData.fullname || ""}
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
            value={userData.email || ""}
            onChange={handleChange}
            disabled={!editMode}
            className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={userData.bio || ""}
            onChange={handleChange}
            disabled={!editMode}
            rows="2"
            className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border"
          />
        </div>
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
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
      <li>✔️ Logged in yesterday</li>
      <li>📌 Updated profile last week</li>
      <li>🏆 Joined “React Developers” community</li>
      {/* TODO: Replace with actual user activity fetched from backend */}
    </ul>
  </div>
)}

{/* Achievements Section */}
{activeTab === "achievements" && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">Achievements</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-purple-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        🏅 <span className="font-medium">First Login</span>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Logged in for the very first time!
        </p>
      </div>
      <div className="bg-purple-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        🎯 <span className="font-medium">Profile Complete</span>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Filled out all profile information.
        </p>
      </div>
      <div className="bg-purple-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        🌟 <span className="font-medium">Active Member</span>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Logged in 7 days in a row.
        </p>
      </div>
      {/* TODO: Load more achievements dynamically */}
    </div>
  </div>
)}

    </motion.div>
  );
};
