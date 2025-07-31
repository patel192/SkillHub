import React, { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaTrophy,
  FaCheckCircle,
  FaCode,
  FaGraduationCap,
  FaBookOpen,
  FaMedal,
  FaBookReader,
  FaCertificate,
  FaUsers,
  FaAward,
  FaRocket 
} from "react-icons/fa";
import { motion } from "framer-motion";
import { MdTimeline } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // default view
  const [userData, setUserData] = useState({
    name: "Muhammad Patel",
    email: "patelmuhammad192@gmail.com",
    bio: "Passionate Web Developer & Learner",
    github: "https://github.com/patelmuhammad",
    linkedin: "https://linkedin.com/in/patel-muhammad",
    twitter: "https://twitter.com/yourhandle",
  });

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSave = () => {
    setEditMode(false);
    console.log("Saved:", userData);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-8 rounded-2xl shadow-lg max-w-full mx-auto  transition-all h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Section Toggle */}
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
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=patel"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-500 shadow-md"
          />
          <div className="w-full">
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                disabled={!editMode}
                rows="2"
                className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* GitHub Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium">GitHub</label>
              <input
                type="url"
                name="github"
                value={userData.github}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full p-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
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

            {/* Edit/Save */}
            <div className="flex justify-end gap-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md transition"
                >
                  Edit Info
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition"
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
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="text-green-500 text-xl">
                <FaCode />
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Solved{" "}
                  <span className="font-semibold text-indigo-600">
                    5 Challenges
                  </span>{" "}
                  on <span className="font-semibold">JavaScript</span>.
                </p>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-purple-500 text-xl">
                <FaBookOpen />
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Watched{" "}
                  <span className="font-semibold text-indigo-600">
                    "React Hooks Deep Dive"
                  </span>{" "}
                  course.
                </p>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-yellow-500 text-xl">
                <FaGraduationCap />
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Earned Certificate in{" "}
                  <span className="font-semibold text-indigo-600">
                    Frontend Web Development
                  </span>
                  .
                </p>
                <span className="text-xs text-gray-400">3 days ago</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-pink-500 text-xl">
                <FaTrophy />
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Ranked{" "}
                  <span className="font-semibold text-green-600">#2</span> in
                  the monthly leaderboard.
                </p>
                <span className="text-xs text-gray-400">5 days ago</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-blue-500 text-xl">
                <IoMdCheckmarkCircleOutline />
              </span>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Completed the{" "}
                  <span className="font-semibold text-indigo-600">
                    Git & GitHub Mastery
                  </span>{" "}
                  track.
                </p>
                <span className="text-xs text-gray-400">1 week ago</span>
              </div>
            </li>
          </ul>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 justify-self-center w-full">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-yellow-600">
            <FaTrophy /> Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-yellow-300 to-yellow-500 text-white rounded-xl text-center shadow-md"
            >
              <FaMedal size={28} className="mx-auto mb-2" />
              <p className="font-bold">100+ Challenges Solved</p>
              <p className="text-xs opacity-80">
                JavaScript, React, Algorithms
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-xl text-center shadow-md"
            >
              <FaBookReader size={28} className="mx-auto mb-2" />
              <p className="font-bold">5 Courses Completed</p>
              <p className="text-xs opacity-80">Frontend Dev, Hooks, Git</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl text-center shadow-md"
            >
              <FaCertificate size={28} className="mx-auto mb-2" />
              <p className="font-bold">3 Certifications Earned</p>
              <p className="text-xs opacity-80">IIT Bombay, FreeCodeCamp</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl text-center shadow-md"
            >
              <FaUsers size={28} className="mx-auto mb-2" />
              <p className="font-bold">Top 10% in Leaderboard</p>
              <p className="text-xs opacity-80">Ranked 8th this month</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-xl text-center shadow-md"
            >
              <FaAward size={28} className="mx-auto mb-2" />
              <p className="font-bold">7-Day Streak</p>
              <p className="text-xs opacity-80">Consistent activity</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl text-center shadow-md"
            >
              <FaRocket size={28} className="mx-auto mb-2" />
              <p className="font-bold">Level 5 Achiever</p>
              <p className="text-xs opacity-80">Progressed in Skill Tree</p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
