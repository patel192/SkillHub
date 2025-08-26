import React, { useState, useEffect } from "react";
import { Award, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
export const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard"); // "leaderboard" | "achievements"

  // ✅ Fetch all users with points
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users");
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Fetch achievements of all users (optional)
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // Example: fetch achievements for one logged-in user
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await axios.get(`http://localhost:8000/achievement/${userId}`);
        const data = await res.json();
        if (data.success) {
          setAchievements(data.achievement);
        }
      } catch (err) {
        console.error("❌ Error fetching achievements:", err);
        setAchievements([]);
      }
    };

    if (activeTab === "achievements") {
      fetchAchievements();
    }
  }, [activeTab]);

  // Sort users by points
  const sortedUsers = Array.isArray(users)
    ? [...users].sort((a, b) => b.points - a.points)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="bg-[#0F172A] min-h-screen text-white px-6 py-8 rounded-xl">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTab === "leaderboard" ? "bg-cyan-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTab === "achievements" ? "bg-cyan-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </button>
        </div>

        {/* Leaderboard Section */}
        {activeTab === "leaderboard" && (
          <>
            <div className="flex justify-center items-center mb-6">
              <Award size={35} className="text-yellow-400 animate-bounce" />
              <h2 className="text-4xl font-extrabold text-center w-1/2 text-cyan-400 tracking-wide">
                Leaderboard Rankings
              </h2>
            </div>

            <div className="space-y-4">
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 70 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition">
                      {/* Left side */}
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-cyan-400 w-10 text-center">
                          #{index + 1}
                        </span>
                        <img
                          src={user.avatar || "/avatars/default.png"}
                          alt={user.fullname}
                          className="w-10 h-10 rounded-full border-2 border-cyan-500"
                        />
                        <span className="text-lg font-semibold">{user.fullname}</span>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-400">
                          {user.points} pts
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">No leaderboard data yet.</p>
              )}
            </div>
          </>
        )}

        {/* Achievements Section */}
        {activeTab === "achievements" && (
          <>
            <div className="flex justify-center items-center mb-6">
              <Trophy size={35} className="text-yellow-400 animate-spin" />
              <h2 className="text-4xl font-extrabold text-center w-1/2 text-purple-400 tracking-wide">
                Your Achievements
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {achievements.length > 0 ? (
                achievements.map((ach, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:scale-105 transition"
                  >
                    <img
                      src={ach.icon}
                      alt={ach.name}
                      className="w-16 h-16 mb-2 animate-pulse"
                    />
                    <p className="text-sm font-semibold text-white text-center">
                      {ach.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {ach.pointsRequired} pts
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No achievements unlocked yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
