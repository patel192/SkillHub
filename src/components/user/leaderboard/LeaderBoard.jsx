import React, { useState, useEffect } from "react";
import { Crown, Trophy, Award } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users");
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(
          `http://localhost:8000/achievement/${userId}`
        );
        if (res.data.success) setAchievements(res.data.achievement);
      } catch {
        setAchievements([]);
      }
    };
    if (activeTab === "achievements") fetchAchievements();
  }, [activeTab, userId]);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topScore = sortedUsers[0]?.points || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0F172A] min-h-screen text-white px-6 py-10"
    >
      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-10">
        {["leaderboard", "achievements"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2 rounded-xl font-bold uppercase tracking-wide
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_#22d3ee]"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab === "leaderboard" ? "🏆 Leaderboard" : "🎖 Achievements"}
          </motion.button>
        ))}
      </div>

      {/* Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-center text-cyan-400 mb-6 flex items-center justify-center gap-2">
            <Award className="text-purple-400 animate-bounce" /> Leaderboard
          </h2>

          {sortedUsers.map((user, index) => {
            const isCurrentUser = user._id === userId;
            const progress = Math.min((user.points / topScore) * 100, 100);

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-gray-900 p-4 rounded-xl flex items-center justify-between 
                  hover:shadow-[0_0_25px_#22d3ee] transition ${
                    isCurrentUser ? "border border-purple-500" : ""
                  }`}
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-cyan-400 w-8 text-center">
                    #{index + 1}
                  </span>
                  {index < 3 && (
                    <Crown
                      className={`${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                          ? "text-gray-300"
                          : "text-amber-600"
                      }`}
                    />
                  )}
                  <img
                    src={user.avatar || "/avatars/default.png"}
                    alt={user.fullname}
                    className="w-12 h-12 rounded-full border-2 border-cyan-400"
                  />
                  <span className="font-semibold">{user.fullname}</span>
                </div>

                {/* Right */}
                <div className="text-right w-40">
                  <span className="font-bold text-cyan-300 text-lg">
                    {user.points} pts
                  </span>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Achievements */}
      {activeTab === "achievements" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-purple-400 mb-8 flex items-center justify-center gap-2">
            <Trophy className="animate-spin text-cyan-400" /> Your Achievements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative p-5 rounded-xl bg-gray-800/70 backdrop-blur-lg shadow-lg 
                             flex flex-col items-center justify-center 
                             hover:scale-105 hover:shadow-[0_0_30px_#a855f7] border border-cyan-500 transition"
                >
                  <img
                    src={ach.icon}
                    alt={ach.name}
                    className="w-16 h-16 mb-3 animate-pulse"
                  />
                  <p className="font-semibold text-center text-cyan-200">
                    {ach.name}
                  </p>
                  <span className="text-xs text-purple-300">
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
        </div>
      )}
    </motion.div>
  );
};
