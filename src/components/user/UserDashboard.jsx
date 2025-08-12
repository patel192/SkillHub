import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  FaBook,
  FaCertificate,
  FaChartLine,
  FaClock,
  FaPlayCircle,
  FaUserGraduate,
  FaTasks,
  FaBell,
} from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
export const UserDashboard = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [userData, setUserData] = useState({
    name: "Muhammad",
    courses: 4,
    challenges: 12,
    certificates: 2,
    totalMinutes: 385,
    recentActivity: [
      { type: "quiz", detail: "Completed: JavaScript Quiz 2" },
      { type: "certificate", detail: "Earned Certificate: HTML Basics" },
      { type: "video", detail: "Watched: React Components - Part 1" },
    ],
    recommendations: [
      { title: "React Hooks Mastery", image: "/assets/react-course.jpg" },
      { title: "Node.js Crash Course", image: "/assets/node-course.jpg" },
    ],
    leaderboardRank: 5,
  });

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((prev) => prev + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const StatCard = ({ icon: Icon, title, value }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#334155] p-5 rounded-2xl shadow-lg flex items-center gap-4"
    >
      <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <h2 className="text-lg font-semibold text-white">{value}</h2>
      </div>
    </motion.div>
  );
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
      {/* Welcome Header */}
      <motion.div
        className="col-span-full text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
      >
        Welcome back, {userData.name}
      </motion.div>

      {/* Stat Cards */}
      <StatCard
        icon={FaBook}
        title="Courses Enrolled"
        value={userData.courses}
      />
      <StatCard
        icon={FaTasks}
        title="Challenges Completed"
        value={userData.challenges}
      />
      <StatCard
        icon={FaCertificate}
        title="Certificates Earned"
        value={userData.certificates}
      />
      <StatCard
        icon={FaClock}
        title="Total Learning Time"
        value={`${Math.floor(userData.totalMinutes / 60)}h ${
          userData.totalMinutes % 60
        }m`}
      />

      {/* Resume Section */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
      >
        <div className="flex items-center gap-4">
          <FaPlayCircle size={30} className="text-green-400" />
          <div>
            <p className="text-sm text-gray-400">Continue Course</p>
            <h2 className="font-semibold">JavaScript Basics - Functions</h2>
          </div>
        </div>
        <button className="mt-4 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition">
          Resume
        </button>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
      >
        <div className="font-semibold mb-3 text-lg">Recommended for You</div>
        <div className="grid grid-cols-1 gap-3">
          {userData.recommendations.map((course, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#475569] p-3 rounded-xl"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">{course.title}</span>
                <AiOutlineArrowRight size={20} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
      >
        <div className="flex items-center gap-2 font-semibold text-lg mb-3">
          <FaBell /> Notifications
        </div>
        <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
          <li>New Course: React Native Launched!</li>
          <li>Challenge Week starts Monday!</li>
          <li>Server maintenance on Saturday</li>
        </ul>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg col-span-1"
      >
        <div className="font-semibold mb-3 text-lg">Recent Activity</div>
        <ul className="text-sm space-y-2">
          {userData.recentActivity.map((activity, index) => (
            <li key={index} className="text-gray-300">
              • {activity.detail}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-[#334155] p-5 rounded-2xl shadow-lg flex items-center justify-between col-span-1"
      >
        <div>
          <p className="text-gray-400 text-sm">Your Rank</p>
          <h2 className="text-2xl font-semibold text-white">
            #{userData.leaderboardRank}
          </h2>
        </div>
        <MdLeaderboard size={40} className="text-yellow-400" />
      </motion.div>
    </div>
  );
};
