import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Player } from "@lottiefiles/react-lottie-player";
import { AlertTriangle, Edit3, Save, Award, User, Activity } from "lucide-react";

const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "My_Images");
  data.append("cloud_name", "dfaou6haj");

  const upload = await fetch(
    "https://api.cloudinary.com/v1_1/dfaou6haj/image/upload",
    { method: "POST", body: data }
  );
  const res = await upload.json();
  return res.secure_url;
};

export const Profile = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      let avatarUrl = userData.avatar;
      if (avatarFile) avatarUrl = await uploadToCloudinary(avatarFile);

      const updates = { ...userData, avatar: avatarUrl };
      const res = await axios.put(`/user/${userId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data.user);
      setEditMode(false);
      setAvatarFile(null);
      toast.success("Profile updated ✨");
    } catch (err) {
      toast.error("Failed to update profile ❌");
    }
  };

  if (!userData) {
    return (
      <div className="text-white flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen p-6 gap-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white"
    >
      {/* -------------------- LEFT SIDEBAR -------------------- */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="
          w-full md:w-72 p-6 
          bg-[#161b22]/70 backdrop-blur-xl 
          border border-purple-600/40 
          rounded-2xl shadow-xl space-y-6
        "
      >
        <div className="flex flex-col items-center">
          
          {/* Avatar with glow ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br 
              from-purple-500 to-cyan-400 blur-xl opacity-40"></div>

            <img
              src={userData.avatar}
              className="w-28 h-28 rounded-full border-4 
                border-purple-500 shadow-xl object-cover relative z-10"
            />
          </div>

          <h2 className="text-xl font-semibold mt-4">{userData.fullname}</h2>
          <p className="text-gray-400 text-sm">{userData.email}</p>

          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r 
            from-purple-500 to-cyan-500 shadow-lg flex items-center gap-2
            hover:opacity-90 transition"
          >
            {editMode ? <Save size={18} /> : <Edit3 size={18} />}
            {editMode ? "Save Profile" : "Edit Profile"}
          </button>

          {editMode && (
            <input
              type="file"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="mt-3 text-sm text-gray-300"
            />
          )}
        </div>

        {/* Left Tabs */}
        <div className="space-y-2 pt-4 border-t border-purple-600/30">
          {[
            { id: "profile", icon: <User size={18} />, label: "Profile Info" },
            { id: "activity", icon: <Activity size={18} />, label: "Activity" },
            { id: "achievements", icon: <Award size={18} />, label: "Achievements" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left transition
                ${activeTab === t.id
                  ? "bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-l-4 border-cyan-400"
                  : "hover:bg-white/5"
                }
              `}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* -------------------- RIGHT CONTENT PANEL -------------------- */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="
          flex-1 bg-[#161b22]/60 backdrop-blur-xl 
          border border-purple-600/40 rounded-2xl p-6 shadow-xl
        "
      >
        {/* PROFILE INFO */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Profile Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {["fullname", "email", "bio"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-purple-300">
                    {field === "fullname"
                      ? "Full Name"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>

                  {field !== "bio" ? (
                    <input
                      disabled={!editMode}
                      name={field}
                      value={userData[field] || ""}
                      onChange={handleChange}
                      className="
                        w-full mt-1 px-3 py-2 rounded-md bg-[#1b1f29] 
                        border border-purple-600/40 text-white
                      "
                    />
                  ) : (
                    <textarea
                      disabled={!editMode}
                      name="bio"
                      rows="3"
                      value={userData.bio || ""}
                      onChange={handleChange}
                      className="
                        w-full mt-1 px-3 py-2 rounded-md bg-[#1b1f29] 
                        border border-purple-600/40 text-white
                      "
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === "activity" && (
          <div className="text-gray-300 text-lg">
            Activity analytics coming soon ⏳✨
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>

            {userData.achievements?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.achievements.map((ach) => (
                  <motion.div
                    key={ach._id}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-xl bg-[#1a1d26] border border-purple-500/30"
                  >
                    <Player autoplay loop src={ach.icon} />
                    <p className="font-bold text-cyan-400">{ach.name}</p>
                    <p className="text-gray-400 text-sm">
                      Points Required: {ach.pointsRequired}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No achievements yet.</p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
