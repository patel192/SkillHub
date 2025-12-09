import React, { useState, useEffect } from "react";
import { Crown, Award, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaderboard");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch users
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      } catch {
        setUsers([]);
      }
    })();
  }, []);

  // Fetch achievements
  useEffect(() => {
    if (activeTab !== "achievements" || !userId) return;
    (async () => {
      try {
        const res = await axios.get(`/achievement/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setAchievements(res.data.achievement);
      } catch {
        setAchievements([]);
      }
    })();
  }, [activeTab]);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topScore = sortedUsers[0]?.points || 1;

  return (
    <div className="min-h-screen p-6 text-white bg-[#05070b]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Leaderboard & Achievements</h1>
        <p className="text-gray-400 text-sm mt-1">
          Compare your progress with others & track achievements.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { key: "leaderboard", label: "Leaderboard" },
          { key: "achievements", label: "Achievements" },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.03 }}
            className={`px-5 py-2 rounded-xl border text-sm transition ${
              activeTab === tab.key
                ? "bg-[#1a1d26] border-white/20"
                : "bg-[#0f1117] border-white/10 hover:border-white/20"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Leaderboard Panel */}
      {activeTab === "leaderboard" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#11141b] border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Award size={20} className="text-indigo-400" /> Leaderboard
          </h2>

          {sortedUsers.map((u, idx) => {
            const isMe = u._id === userId;
            const progress = (u.points / topScore) * 100;

            return (
              <motion.div
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`flex items-center justify-between bg-[#0f1117] border border-white/10 rounded-xl p-4 ${
                  isMe ? "border-indigo-400" : ""
                }`}
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg w-8 text-indigo-300">
                    #{idx + 1}
                  </span>

                  {idx < 3 && (
                    <Crown
                      size={20}
                      className={
                        idx === 0
                          ? "text-yellow-400"
                          : idx === 1
                          ? "text-gray-300"
                          : "text-amber-600"
                      }
                    />
                  )}

                  <img
                    src={u.avatar || "/avatars/default.png"}
                    className="w-12 h-12 rounded-full border border-indigo-400"
                  />

                  <span className="font-medium">{u.fullname}</span>
                </div>

                {/* Right */}
                <div className="w-40 text-right">
                  <span className="font-semibold text-indigo-300">
                    {u.points} pts
                  </span>
                  <div className="h-2 w-full bg-[#1b1d26] rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-indigo-400 to-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Achievements Panel */}
      {activeTab === "achievements" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#11141b] border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-indigo-400" /> Achievements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {achievements.length ? (
              achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[#0f1117] border border-white/10 rounded-xl p-4 flex flex-col items-center"
                >
                  <img
                    src={ach.icon}
                    className="w-14 h-14 mb-3"
                    alt={ach.name}
                  />
                  <div className="text-sm font-medium text-indigo-300">
                    {ach.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {ach.pointsRequired} pts
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">
                No achievements yet.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
